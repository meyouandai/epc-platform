const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { findAssessorById, updateAssessor } = require('../models/assessor');
const { query } = require('../models/database');

// Mock Stripe for now - replace with real Stripe in production
const mockStripe = {
  customers: {
    create: async (data) => ({
      id: `cus_${Date.now()}`,
      email: data.email,
      name: data.name
    }),
    retrieve: async (id) => ({
      id,
      email: 'mock@example.com',
      name: 'Mock Customer'
    })
  },
  paymentMethods: {
    create: async (data) => ({
      id: `pm_${Date.now()}`,
      type: data.type,
      card: data.card ? {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      } : null
    }),
    attach: async (paymentMethodId, params) => ({
      id: paymentMethodId,
      customer: params.customer
    }),
    list: async (params) => ({
      data: [
        {
          id: 'pm_mock1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        }
      ]
    })
  },
  invoices: {
    create: async (data) => ({
      id: `in_${Date.now()}`,
      customer: data.customer,
      amount_due: data.amount_due || 0,
      status: 'draft'
    }),
    finalizeInvoice: async (invoiceId) => ({
      id: invoiceId,
      status: 'open',
      hosted_invoice_url: `https://invoice.stripe.com/mock/${invoiceId}`
    }),
    pay: async (invoiceId) => ({
      id: invoiceId,
      status: 'paid',
      amount_paid: 25000 // $250.00
    })
  },
  invoiceItems: {
    create: async (data) => ({
      id: `ii_${Date.now()}`,
      customer: data.customer,
      amount: data.amount,
      currency: data.currency,
      description: data.description
    })
  }
};

// Create Stripe customer for assessor
router.post('/setup-customer', authenticateToken, async (req, res) => {
  try {
    const assessor = await findAssessorById(req.assessorId);
    if (!assessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    // Check if already has Stripe customer
    if (assessor.stripe_customer_id) {
      return res.json({
        success: true,
        customerId: assessor.stripe_customer_id,
        message: 'Customer already exists'
      });
    }

    // Create Stripe customer
    const customer = await mockStripe.customers.create({
      email: assessor.email,
      name: assessor.name,
      metadata: {
        assessor_id: assessor.id,
        company: assessor.company || ''
      }
    });

    // Update assessor with Stripe customer ID
    await updateAssessor(assessor.id, {
      stripe_customer_id: customer.id
    });

    res.json({
      success: true,
      customerId: customer.id,
      message: 'Payment account created successfully'
    });
  } catch (error) {
    console.error('Setup customer error:', error);
    res.status(500).json({ error: 'Failed to setup payment account' });
  }
});

// Add payment method
router.post('/add-payment-method', authenticateToken, async (req, res) => {
  try {
    const { type, cardToken } = req.body; // cardToken would come from Stripe frontend

    const assessor = await findAssessorById(req.assessorId);
    if (!assessor || !assessor.stripe_customer_id) {
      return res.status(400).json({ error: 'Payment account not set up' });
    }

    // Create payment method
    const paymentMethod = await mockStripe.paymentMethods.create({
      type: type || 'card',
      card: cardToken ? { token: cardToken } : {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123'
      }
    });

    // Attach to customer
    await mockStripe.paymentMethods.attach(paymentMethod.id, {
      customer: assessor.stripe_customer_id
    });

    // Store in database
    await query(`
      INSERT INTO payment_methods (
        assessor_id, stripe_payment_method_id, type, last4, brand,
        expiry_month, expiry_year, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      ON CONFLICT (assessor_id, stripe_payment_method_id) DO NOTHING
    `, [
      assessor.id,
      paymentMethod.id,
      paymentMethod.type,
      paymentMethod.card?.last4 || '4242',
      paymentMethod.card?.brand || 'visa',
      paymentMethod.card?.exp_month || 12,
      paymentMethod.card?.exp_year || 2025
    ]);

    res.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand
      }
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// Get payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const assessor = await findAssessorById(req.assessorId);
    if (!assessor || !assessor.stripe_customer_id) {
      return res.json({ success: true, paymentMethods: [] });
    }

    // Get from Stripe
    const stripePaymentMethods = await mockStripe.paymentMethods.list({
      customer: assessor.stripe_customer_id,
      type: 'card'
    });

    // Also get from database for additional info
    const dbResult = await query(`
      SELECT * FROM payment_methods WHERE assessor_id = $1 ORDER BY created_at DESC
    `, [assessor.id]);

    const paymentMethods = stripePaymentMethods.data.map(pm => {
      const dbMethod = dbResult.rows.find(db => db.stripe_payment_method_id === pm.id);
      return {
        id: pm.id,
        type: pm.type,
        last4: pm.card?.last4,
        brand: pm.card?.brand,
        expiryMonth: pm.card?.exp_month,
        expiryYear: pm.card?.exp_year,
        isDefault: dbMethod?.is_default || false
      };
    });

    res.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Process payment (for testing)
router.post('/process-payment', authenticateToken, async (req, res) => {
  try {
    const { amount, description = 'Lead charges' } = req.body;

    const assessor = await findAssessorById(req.assessorId);
    if (!assessor || !assessor.stripe_customer_id) {
      return res.status(400).json({ error: 'Payment account not set up' });
    }

    // Create invoice item
    const invoiceItem = await mockStripe.invoiceItems.create({
      customer: assessor.stripe_customer_id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'gbp',
      description
    });

    // Create invoice
    const invoice = await mockStripe.invoices.create({
      customer: assessor.stripe_customer_id,
      auto_advance: true
    });

    // Finalize and pay invoice (auto-payment)
    const finalizedInvoice = await mockStripe.invoices.finalizeInvoice(invoice.id);
    const paidInvoice = await mockStripe.invoices.pay(finalizedInvoice.id);

    // Record in database
    await query(`
      INSERT INTO billing_documents (
        assessor_id, document_number, type, amount, status,
        stripe_invoice_id, payment_date
      ) VALUES ($1, $2, 'invoice', $3, 'paid', $4, CURRENT_DATE)
    `, [
      assessor.id,
      `INV-${Date.now()}`,
      amount,
      paidInvoice.id
    ]);

    // Update assessor spending
    await updateAssessor(assessor.id, {
      current_period_spend: (parseFloat(assessor.current_period_spend) || 0) + amount,
      total_successful_payments: (assessor.total_successful_payments || 0) + 1
    });

    res.json({
      success: true,
      invoice: {
        id: paidInvoice.id,
        amount: amount,
        status: paidInvoice.status,
        paidAt: new Date()
      },
      message: `Payment of £${amount} processed successfully`
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Webhook endpoint for Stripe events (for production)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    // In production, verify the webhook signature
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Mock event processing
    const event = {
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_mock',
          customer: 'cus_mock',
          amount_paid: 25000
        }
      }
    };

    switch (event.type) {
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Update database with payment success
        break;
      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle payment failure
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;