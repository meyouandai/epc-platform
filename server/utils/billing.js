const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { markLeadAsCharged } = require('../models/lead');

const LEAD_CHARGE_AMOUNT = 500; // £5.00 in pence

// Charge assessor for a lead
const chargeAssessorForLead = async (assessorId, leadId) => {
  try {
    // In production, you'd retrieve the assessor's stripe customer ID and payment method
    const stripeCustomerId = `cus_assessor_${assessorId.split('_')[1]}`;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: LEAD_CHARGE_AMOUNT,
      currency: 'gbp',
      customer: stripeCustomerId,
      description: `Lead charge for lead ${leadId}`,
      metadata: {
        leadId,
        assessorId,
        type: 'lead_charge'
      },
      confirm: true,
      payment_method: 'pm_card_visa', // In production, use saved payment method
      return_url: `${process.env.DOMAIN}/payment-return`
    });

    // Mark lead as charged
    await markLeadAsCharged(leadId, {
      stripePaymentIntentId: paymentIntent.id,
      amount: LEAD_CHARGE_AMOUNT,
      currency: 'gbp',
      status: paymentIntent.status
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: LEAD_CHARGE_AMOUNT
    };
  } catch (error) {
    console.error('Error charging assessor for lead:', error);

    // For demo purposes, mark as charged even if stripe fails
    if (process.env.NODE_ENV === 'development') {
      await markLeadAsCharged(leadId, {
        amount: LEAD_CHARGE_AMOUNT,
        currency: 'gbp',
        status: 'demo_charged',
        note: 'Demo mode - no actual charge'
      });

      return {
        success: true,
        demo: true,
        amount: LEAD_CHARGE_AMOUNT
      };
    }

    throw error;
  }
};

// Create customer in Stripe for new assessor
const createStripeCustomer = async (assessorData) => {
  try {
    const customer = await stripe.customers.create({
      email: assessorData.email,
      name: assessorData.name,
      metadata: {
        assessorId: assessorData.id,
        company: assessorData.company
      }
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

// Setup payment method for assessor
const setupPaymentMethod = async (customerId) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session'
    });

    return setupIntent.client_secret;
  } catch (error) {
    console.error('Error setting up payment method:', error);
    throw error;
  }
};

module.exports = {
  chargeAssessorForLead,
  createStripeCustomer,
  setupPaymentMethod,
  LEAD_CHARGE_AMOUNT
};