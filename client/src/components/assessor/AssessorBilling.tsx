import React, { useState, useEffect } from 'react';
import './AssessorBilling.css';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface BillingPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  leadsReceived: number;
  amount: number;
  status: 'active' | 'pending' | 'paid' | 'overdue';
  invoiceUrl?: string;
}

interface BillingDocument {
  id: string;
  documentNumber: string;
  type: 'invoice' | 'credit';
  period?: string;
  date: Date;
  amount: number;
  leadCount?: number;
  status: 'paid' | 'pending' | 'issued' | 'applied' | 'refunded';
  paymentDate?: Date;
  paymentMethod?: string;
  relatedToDocument?: string;
  appliedToDocument?: string;
  creditsApplied?: number;
  reason?: string;
  refundDate?: Date;
  leads?: any[];
}

interface AssessorBillingProps {
  token: string;
  assessorId: string;
}

const AssessorBilling: React.FC<AssessorBillingProps> = ({ token, assessorId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'methods'>('overview');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingPeriods, setBillingPeriods] = useState<BillingPeriod[]>([]);
  const [billingDocuments, setBillingDocuments] = useState<BillingDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<BillingDocument | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showReduceLimitModal, setShowReduceLimitModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBilling, setCurrentBilling] = useState({
    currentAmount: 175,
    threshold: 250,
    leadsThisPeriod: 12,
    nextPaymentDate: new Date('2025-02-15'),
    trustLevel: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum',
    costPerLead: 15,
    paymentsCompleted: 1,
    maxEligibleThreshold: 250,
    onTimePayments: 3,
    totalPayments: 3,
    autoIncreaseEnabled: true
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'trust_milestone',
      title: 'Trust level milestone',
      description: '2 payments remaining until Silver status',
      date: new Date('2025-01-24'),
      amount: null
    },
    {
      id: 2,
      type: 'payment',
      title: 'Monthly payment processed',
      description: 'December billing period settled automatically',
      date: new Date('2025-01-23'),
      amount: 240
    },
    {
      id: 3,
      type: 'period_start',
      title: 'New billing period started',
      description: 'January 15 - February 15',
      date: new Date('2025-01-15'),
      amount: null
    },
    {
      id: 4,
      type: 'credit',
      title: 'Credit applied',
      description: 'Lead refund credited to account',
      date: new Date('2025-01-12'),
      amount: 15
    },
    {
      id: 5,
      type: 'payment_method',
      title: 'Payment method updated',
      description: 'Default card changed to Visa •••• 4532',
      date: new Date('2025-01-08'),
      amount: null
    }
  ]);

  useEffect(() => {
    fetchBillingData();
  }, [assessorId]);

  const fetchBillingData = async () => {
    try {
      // Mock data - replace with real API calls
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4532',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2026,
          isDefault: true
        },
        {
          id: 'pm_2',
          type: 'card',
          last4: '1234',
          brand: 'mastercard',
          expiryMonth: 8,
          expiryYear: 2025,
          isDefault: false
        }
      ];

      const mockBillingPeriods: BillingPeriod[] = [
        {
          id: 'bp_current',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-02-15'),
          leadsReceived: 12,
          amount: 175,
          status: 'active'
        },
        {
          id: 'bp_1',
          startDate: new Date('2024-12-15'),
          endDate: new Date('2025-01-15'),
          leadsReceived: 16,
          amount: 240,
          status: 'paid',
          invoiceUrl: '/invoices/bp_1.pdf'
        },
        {
          id: 'bp_2',
          startDate: new Date('2024-11-15'),
          endDate: new Date('2024-12-15'),
          leadsReceived: 15,
          amount: 225,
          status: 'paid',
          invoiceUrl: '/invoices/bp_2.pdf'
        }
      ];

      const mockBillingDocuments: BillingDocument[] = [
        // Standard invoices (99.5% of cases)
        {
          id: 'inv_1',
          documentNumber: 'INV-2025-001',
          type: 'invoice',
          period: '1 Jan - 24 Jan 2025',
          date: new Date('2025-01-24'),
          amount: 150,
          leadCount: 10,
          status: 'paid',
          paymentDate: new Date('2025-01-24'),
          paymentMethod: 'Card ending 4532'
        },
        {
          id: 'inv_2',
          documentNumber: 'INV-2024-089',
          type: 'invoice',
          period: '15 Dec - 22 Dec 2024',
          date: new Date('2024-12-22'),
          amount: 100,
          leadCount: 10,
          status: 'paid',
          paymentDate: new Date('2024-12-22'),
          paymentMethod: 'Card ending 4532'
        },
        // Credit notes (rare 0.5% case)
        {
          id: 'cn_1',
          documentNumber: 'CN-2025-001',
          type: 'credit',
          date: new Date('2025-01-26'),
          amount: 15,
          leadCount: 1,
          status: 'issued',
          relatedToDocument: 'INV-2024-089',
          reason: 'Fraudulent lead verified by multiple assessors'
        },
        {
          id: 'cn_2',
          documentNumber: 'CN-2024-003',
          type: 'credit',
          date: new Date('2024-12-10'),
          amount: 30,
          leadCount: 2,
          status: 'applied',
          relatedToDocument: 'INV-2024-088',
          appliedToDocument: 'INV-2025-001',
          reason: 'Duplicate customer submissions detected'
        },
        {
          id: 'rn_1',
          documentNumber: 'RN-2024-002',
          type: 'credit',
          date: new Date('2024-11-20'),
          amount: 45,
          leadCount: 3,
          status: 'refunded',
          relatedToDocument: 'INV-2024-044',
          refundDate: new Date('2024-11-22'),
          reason: 'Customer requested cash refund for invalid leads'
        },
        // Standard invoice
        {
          id: 'inv_3',
          documentNumber: 'INV-2025-002',
          type: 'invoice',
          period: '23 Dec - 30 Dec 2024',
          date: new Date('2024-12-30'),
          amount: 150,
          leadCount: 10,
          status: 'paid',
          paymentDate: new Date('2024-12-30'),
          paymentMethod: 'Card ending 4532'
        },
        // Add one pending invoice to show contrast
        {
          id: 'inv_4',
          documentNumber: 'INV-2024-044',
          type: 'invoice',
          period: '1 Oct - 15 Oct 2024',
          date: new Date('2024-10-15'),
          amount: 225,
          leadCount: 15,
          status: 'pending'
        }
      ];

      setPaymentMethods(mockPaymentMethods);
      setBillingPeriods(mockBillingPeriods);
      setBillingDocuments(mockBillingDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'status-badge paid';
      case 'pending': return 'status-badge pending';
      case 'issued': return 'status-badge refunded';
      case 'applied': return 'status-badge refunded';
      case 'refunded': return 'status-badge refunded';
      default: return 'status-badge';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'issued': return 'Issued';
      case 'applied': return 'Applied';
      default: return status;
    }
  };

  const getDocumentTypeLabel = (document: BillingDocument) => {
    if (document.type === 'credit' && document.status === 'refunded') {
      return 'Refund';
    }
    switch (document.type) {
      case 'invoice': return 'Invoice';
      case 'credit': return 'Credit';
      default: return document.type;
    }
  };

  const filteredDocuments = billingDocuments
    .filter(doc => {
      const matchesSearch = !searchTerm ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.period && doc.period.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleViewDocument = (document: BillingDocument) => {
    setSelectedDocument(document);
    setShowInvoiceModal(true);
  };

  const getDaysOverdue = (invoiceDate: Date) => {
    const today = new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = () => {
    return (currentBilling.currentAmount / currentBilling.threshold) * 100;
  };

  const getTrustLevelInfo = () => {
    const levels = {
      bronze: { name: 'Bronze', color: '#cd7f32', next: 'Silver', paymentsNeeded: 3, description: "You're building trust with each payment cycle. After 3 successful payments, you'll unlock Silver status with increased spending limits and priority features." },
      silver: { name: 'Silver', color: '#c0c0c0', next: 'Gold', paymentsNeeded: 5, description: "£600 spending threshold (was £450), priority lead notifications, and faster support response. 3 more payment cycles until Gold!" },
      gold: { name: 'Gold', color: '#ffd700', next: 'Platinum', paymentsNeeded: 8, description: "NET 30 payment terms, multiple outstanding invoices allowed (up to £900), priority support, and early access to high-value leads." },
      platinum: { name: 'Platinum', color: '#e5e4e2', next: null, paymentsNeeded: 10, description: "Maximum benefits including extended credit terms, dedicated account manager, and premium lead filtering." }
    };
    return levels[currentBilling.trustLevel];
  };

  const handleSetDefaultPayment = (methodId: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== methodId));
  };

  const handleLimitSelection = (newThreshold: number) => {
    setSelectedLimit(newThreshold);
    const currentSpend = currentBilling.currentAmount;

    let timingMessage = '';
    let chargeMessage = ` You'll be charged automatically when you reach ${formatCurrency(newThreshold)}.`;

    if (newThreshold > currentBilling.threshold) {
      timingMessage = 'Your new limit is active immediately.';
    } else if (currentSpend < newThreshold) {
      timingMessage = 'Your new limit is active immediately.';
    } else {
      timingMessage = `Your new limit will apply after your next payment as you've already spent ${formatCurrency(currentSpend)} this period.`;
      chargeMessage = '';
    }

    setConfirmationMessage(`Your billing limit will change from ${formatCurrency(currentBilling.threshold)} to ${formatCurrency(newThreshold)}.\n\n${timingMessage}${chargeMessage}`);
    setShowConfirmation(true);
  };

  const handleConfirmLimit = () => {
    if (selectedLimit !== null) {
      setCurrentBilling(prev => ({
        ...prev,
        threshold: selectedLimit
      }));
      setShowReduceLimitModal(false);
      setShowConfirmation(false);
      setSelectedLimit(null);
      setConfirmationMessage('');
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setSelectedLimit(null);
    setConfirmationMessage('');
  };

  const getAllThresholds = () => {
    return [50, 100, 150, 250, 500, 1000];
  };

  const getThresholdInfo = (threshold: number) => {
    const maxEligible = currentBilling.maxEligibleThreshold || 250;
    const isLocked = threshold > maxEligible;
    const lockedReason = threshold === 1000 ? 'Gold' : threshold === 500 ? 'Silver' : null;

    return {
      isLocked,
      lockedReason,
      canSelect: !isLocked
    };
  };

  const handlePauseAccount = () => {
    setIsPaused(true);
    setShowPauseModal(false);
  };

  const handleResumeAccount = () => {
    setIsPaused(false);
    setShowResumeModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading billing information...</p>
      </div>
    );
  }

  const trustInfo = getTrustLevelInfo();
  const progressPercent = getProgressPercentage();

  return (
    <div className="billing-management">
      <div className="billing-header">
        <div className="header-content">
          <div>
            <h1>Billing & Payments</h1>
            <p>Manage your payment methods, billing history, and account status</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="billing-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Billing History
        </button>
        <button
          className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          Payment Methods
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="billing-overview">
          {/* Refined Billing Status */}
          <div className="billing-period-card">
            <div className="billing-header-row">
              <h3>This Period: <span style={{fontWeight: 'normal'}}>16 Jan 2025 - 15 Feb 2025</span></h3>
            </div>

            <div className="period-stats-row" style={{alignItems: 'stretch'}}>
              <div className="period-stat-card" style={{display: 'flex', flexDirection: 'column'}}>
                <div className="stat-label">Your Spending</div>
                <div className="spending-amount">
                  <span className="current-amount">{formatCurrency(currentBilling.currentAmount)}</span>
                  <span className="threshold-amount"> of {formatCurrency(currentBilling.threshold)}</span>
                </div>
                <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: '8px'}}>
                  {isPaused ? (
                    <span style={{fontWeight: '600', color: '#dc2626'}}>
                      Lead purchasing paused
                    </span>
                  ) : (
                    <span style={{fontWeight: '600', color: '#059669'}}>
                      {formatCurrency(currentBilling.threshold - currentBilling.currentAmount)} remaining
                    </span>
                  )}
                </div>
                <div className="progress-bar-refined">
                  <div
                    className="progress-fill-refined"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {Math.round(progressPercent)}%
                  </div>
                </div>
                <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: '8px', lineHeight: '1.4', flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                  {isPaused ? (
                    'Purchasing suspended - your postcodes are preserved'
                  ) : (
                    `Auto-charge at ${formatCurrency(currentBilling.threshold)} or period end (whichever first)`
                  )}
                </div>
                <div style={{marginTop: 'auto'}}>
                  {isPaused ? (
                    <button
                      className="add-assessor-btn"
                      onClick={() => setShowResumeModal(true)}
                      style={{fontSize: '12px', width: '100%'}}
                    >
                      Resume Purchasing
                    </button>
                  ) : (
                    <button
                      className="nav-button"
                      onClick={() => setShowPauseModal(true)}
                      style={{fontSize: '12px', width: '100%'}}
                    >
                      Pause Purchasing
                    </button>
                  )}
                </div>
              </div>

              <div className="period-stat-card" style={{display: 'flex', flexDirection: 'column'}}>
                <div className="stat-label">Leads Purchased</div>
                <div className="stat-value-large">{currentBilling.leadsThisPeriod}</div>
                <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: '8px'}}>
                  leads this period
                </div>
                <div style={{marginTop: 'auto'}}>
                  <button
                    className="nav-button"
                    style={{fontSize: '12px', width: '100%'}}
                  >
                    View Leads
                  </button>
                </div>
              </div>

              <div className="period-stat-card trust-card" style={{display: 'flex', flexDirection: 'column'}}>
                <div className="stat-label" style={{fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Account Level</div>
                <div className="trust-level" style={{color: '#cd7f32', fontSize: '36px', fontWeight: '700', lineHeight: '1', marginBottom: '8px'}}>{trustInfo.name}</div>
                <div className="spending-amount">
                  <span className="current-amount">{formatCurrency(currentBilling.threshold)}</span>
                  <span className="threshold-amount"> limit</span>
                </div>
                <div className="benefit-text" style={{fontSize: '12px', color: '#6b7280', margin: '4px 0 12px 0', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  🔒 Higher limits unlock with usage
                </div>
                <div className="trust-actions" style={{display: 'flex', flexDirection: 'row', gap: '8px', marginTop: 'auto'}}>
                  <button
                    className="add-assessor-btn"
                    style={{flex: 1, fontSize: '11px'}}
                    onClick={() => setShowReduceLimitModal(true)}
                  >
                    Manage Limit
                  </button>
                  <button className="nav-button" style={{flex: 1, fontSize: '11px'}}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {(currentBilling.trustLevel === 'gold' || currentBilling.trustLevel === 'platinum') && (
              <div className="period-description">
                Invoice will generate at {formatCurrency(currentBilling.threshold)} (NET 30 payment terms)
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="billing-period-card">
            <div className="activity-header" style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0'}}>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item" style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {activity.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginBottom: '4px',
                      whiteSpace: 'pre-line'
                    }}>
                      {activity.amount ? (
                        <span>
                          {activity.description} - <span style={{color: 'rgb(107, 114, 128)'}}>{formatCurrency(Math.abs(activity.amount))}</span>
                        </span>
                      ) : (
                        activity.description
                      )}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      {formatDate(activity.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Billing History Tab */}
      {activeTab === 'history' && (
        <div className="billing-history">
          <div className="history-header">
            <h3>Billing History</h3>
          </div>

          <div className="billing-controls" style={{ display: 'flex', gap: '16px', margin: '24px 0', alignItems: 'center' }}>
            <div className="search-box" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
              <input
                type="text"
                placeholder="Search invoices, periods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial-refund">Partial Refunds</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="invoice-table" style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="table-header" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '16px 20px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '600',
              fontSize: '12px',
              textTransform: 'uppercase',
              color: '#374151'
            }}>
              <div>Date</div>
              <div>Document</div>
              <div>Type</div>
              <div>Period</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {filteredDocuments.map(document => (
              <div key={document.id} className="table-row" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '14px' }}>
                  {formatDate(document.date)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                  {document.documentNumber}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: document.type === 'credit' ? '#dc2626' : '#059669' }}>
                  {getDocumentTypeLabel(document)}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {document.period || '-'}
                </div>
                <div className="amount-display" style={{ fontSize: '14px', fontWeight: '600' }}>
                  {document.type === 'credit' ? (
                    <span style={{ color: '#dc2626' }}>({formatCurrency(document.amount)})</span>
                  ) : (
                    <>
                      {formatCurrency(document.amount)}
                      {document.creditsApplied && (
                        <span style={{ fontSize: '12px', marginLeft: '4px', color: '#6b7280' }} title={`${formatCurrency(document.creditsApplied)} credit available`}>💳</span>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <span className={getStatusBadgeClass(document.status)}>
                    {getStatusLabel(document.status)}
                  </span>
                </div>
                <div>
                  <button
                    className="action-btn primary"
                    onClick={() => handleViewDocument(document)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #3b82f6',
                      borderRadius: '4px',
                      background: '#3b82f6',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              background: 'white',
              borderRadius: '8px',
              marginTop: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3 style={{ marginBottom: '8px' }}>No invoices found</h3>
              <p>No invoices match your current filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="payment-methods">
          <div className="methods-header">
            <h3>Payment Methods</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {paymentMethods
              .sort((a, b) => {
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                return 0;
              })
              .map(method => (
              <div key={method.id} style={{
                border: method.isDefault ? '2px solid #667eea' : '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                background: method.isDefault ? '#f3f4ff' : 'white',
                position: 'relative',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!method.isDefault) {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!method.isDefault) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                }
              }}>

                {/* Default badge */}
                {method.isDefault && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Default
                  </div>
                )}

                {/* Card content */}
                <div>
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '12px'
                  }}>
                    {method.type === 'card' ? '💳' : '🏦'}
                  </div>

                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {method.brand ? method.brand.toUpperCase() : 'Bank Account'}
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}>
                    •••• •••• •••• {method.last4}
                  </div>

                  {method.expiryMonth && method.expiryYear && (
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  {!method.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefaultPayment(method.id);
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        border: '1px solid #667eea',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#667eea',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePaymentMethod(method.id);
                    }}
                    disabled={method.isDefault}
                    style={{
                      flex: method.isDefault ? 1 : 'none',
                      padding: '6px 12px',
                      border: '1px solid #dc2626',
                      borderRadius: '6px',
                      background: 'white',
                      color: method.isDefault ? '#9ca3af' : '#dc2626',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: method.isDefault ? 'not-allowed' : 'pointer',
                      opacity: method.isDefault ? 0.5 : 1
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add new payment method card */}
            <div
              onClick={() => setShowAddPaymentModal(true)}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '24px',
                background: '#fafafa',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f3f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = '#fafafa';
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>
                ➕
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                textAlign: 'center'
              }}>
                Add Payment Method
              </div>
            </div>
          </div>

          {paymentMethods.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No Payment Methods</h3>
              <p>Add a payment method to start receiving leads</p>
              <button
                className="action-btn primary"
                onClick={() => setShowAddPaymentModal(true)}
              >
                Add Your First Payment Method
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowAddPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment Method</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddPaymentModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>This is a demo. In a real application, this would integrate with Stripe or another payment processor.</p>
              <div className="demo-message">
                <strong>Demo Mode:</strong> Payment methods are simulated for demonstration purposes.
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="action-btn secondary"
                onClick={() => setShowAddPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="action-btn primary"
                onClick={() => setShowAddPaymentModal(false)}
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Limit Modal */}
      {showReduceLimitModal && (
        <div className="modal-overlay" onClick={() => setShowReduceLimitModal(false)}>
          <div className="modal-content manage-limit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Manage Your Spending Limit</div>
              <div className="modal-subtitle">Choose your preferred payment threshold</div>
              <button
                className="close-button"
                onClick={() => setShowReduceLimitModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="current-status">
                <div className="status-row">
                  <span className="status-label">Account Level</span>
                  <span className="status-value">
                    <span className="account-badge bronze">Bronze</span>
                  </span>
                </div>
                <div className="status-row">
                  <span className="status-label">Current Limit</span>
                  <span className="status-value">{formatCurrency(currentBilling.threshold)}</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Total Spent</span>
                  <span className="status-value">{formatCurrency(currentBilling.currentAmount)}</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Progress to Silver</span>
                  <span className="status-value">{formatCurrency(currentBilling.currentAmount)} of £500</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${(currentBilling.currentAmount / 500) * 100}%`}}></div>
                </div>
              </div>

              <div className="options-section">
                <div className="section-label">Available Limits</div>
                <div className="limit-cards-grid">
                  {getAllThresholds().map(threshold => {
                    const thresholdInfo = getThresholdInfo(threshold);
                    const isCurrent = threshold === currentBilling.threshold;
                    const isSelected = selectedLimit === threshold;

                    return (
                      <div
                        key={threshold}
                        className={`limit-card ${
                          thresholdInfo.isLocked ? 'disabled' : ''
                        } ${
                          isSelected ? 'selected' : isCurrent && !selectedLimit ? 'selected' : ''
                        }`}
                        onClick={() => thresholdInfo.canSelect && handleLimitSelection(threshold)}
                      >
                        <div className="limit-amount">{formatCurrency(threshold)}</div>
                        {isCurrent && (
                          <div className="limit-badge badge-current">Current</div>
                        )}
                        {thresholdInfo.isLocked && thresholdInfo.lockedReason && (
                          <div className={`limit-badge ${thresholdInfo.lockedReason === 'Silver' ? 'badge-silver' : 'badge-locked'}`}>
                            {thresholdInfo.lockedReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {showConfirmation && (
                <div className="confirmation-message show">
                  <div className="confirmation-title">Confirm your new limit</div>
                  <div className="confirmation-details">
                    {confirmationMessage.split('\n\n').map((paragraph, index) => (
                      <div key={index} style={{marginBottom: index < confirmationMessage.split('\n\n').length - 1 ? '8px' : '0'}}>
                        {paragraph}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`modal-footer ${!showConfirmation && !selectedLimit ? 'single-button' : ''}`}>
              {!showConfirmation ? (
                selectedLimit && selectedLimit !== currentBilling.threshold ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelConfirmation}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowConfirmation(true)}
                    >
                      Update to {formatCurrency(selectedLimit)}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowReduceLimitModal(false)}
                  >
                    {selectedLimit === currentBilling.threshold ? 'Cancel' : 'Close'}
                  </button>
                )
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelConfirmation}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleConfirmLimit}
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pause Account Modal */}
      {showPauseModal && (
        <div className="modal-overlay">
          <div className="modal-content pause-modal">
            <div className="modal-header">
              <div className="modal-title">Pause Lead Purchasing</div>
              <div className="modal-subtitle">Temporarily suspend all lead acquisition</div>
              <button
                className="close-button"
                onClick={() => setShowPauseModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="pause-info">
                <div className="info-section">
                  <h4>What happens when you pause?</h4>
                  <ul className="pause-effects">
                    <li>✋ No new leads will be purchased</li>
                    <li>📍 Your post code selections will be preserved</li>
                    <li>💰 No charges will be made during pause</li>
                    <li>🔄 You can resume anytime from your billing page</li>
                  </ul>
                </div>

                <div className="current-status">
                  <div className="status-item">
                    <span className="status-label">Current Status:</span>
                    <span className="status-value active">Active</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Active Post Codes:</span>
                    <span className="status-value">12 areas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPauseModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePauseAccount}
              >
                Pause Purchasing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Account Modal */}
      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content resume-modal">
            <div className="modal-header">
              <div className="modal-title">Resume Lead Purchasing</div>
              <div className="modal-subtitle">Reactivate your account for lead acquisition</div>
              <button
                className="close-button"
                onClick={() => setShowResumeModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="resume-info">
                <div className="info-section">
                  <h4>Ready to resume purchasing?</h4>
                  <ul className="resume-effects">
                    <li>▶️ Lead purchasing will resume immediately</li>
                    <li>📍 Your 12 post codes are still active</li>
                    <li>💰 Billing will continue as normal</li>
                    <li>🔔 You'll receive lead notifications again</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowResumeModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleResumeAccount}
              >
                Resume Purchasing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowInvoiceModal(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
                {selectedDocument.type === 'credit' ? 'Credit Note Details' : 'Invoice Details'}
              </h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <div className="invoice-summary" style={{ marginBottom: '24px' }}>
                <div className="invoice-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{selectedDocument.documentNumber}</h3>
                    <span className={getStatusBadgeClass(selectedDocument.status)}>
                      {getStatusLabel(selectedDocument.status)}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: selectedDocument.type === 'credit' ? '#dc2626' : '#059669' }}>
                      {selectedDocument.type === 'credit' ? '-' : ''}{formatCurrency(selectedDocument.amount)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedDocument.leadCount} {selectedDocument.type === 'credit' ? 'lead credit' : 'leads'}
                    </div>
                  </div>
                </div>

                <div className="invoice-info">
                  {selectedDocument.period && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Period:</span>
                      <span style={{ color: '#6b7280' }}>{selectedDocument.period}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontWeight: '500', color: '#374151' }}>{selectedDocument.type === 'credit' ? 'Credit Date:' : 'Invoice Date:'}</span>
                    <span style={{ color: '#6b7280' }}>{formatDate(selectedDocument.date)}</span>
                  </div>
                  {selectedDocument.type === 'credit' && selectedDocument.relatedToDocument && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Original Invoice:</span>
                      <span style={{ color: '#6b7280' }}>{selectedDocument.relatedToDocument}</span>
                    </div>
                  )}
                  {selectedDocument.paymentDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Payment Date:</span>
                      <span style={{ color: '#6b7280' }}>{formatDate(selectedDocument.paymentDate)}</span>
                    </div>
                  )}
                  {selectedDocument.paymentMethod && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Payment Method:</span>
                      <span style={{ color: '#6b7280' }}>{selectedDocument.paymentMethod}</span>
                    </div>
                  )}
                  {selectedDocument.refundDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Refund Date:</span>
                      <span style={{ color: '#6b7280' }}>{formatDate(selectedDocument.refundDate)}</span>
                    </div>
                  )}
                  {selectedDocument.status === 'pending' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Days Overdue:</span>
                      <span style={{ color: '#dc2626', fontWeight: '600' }}>
                        {getDaysOverdue(selectedDocument.date)} days
                      </span>
                    </div>
                  )}
                </div>

                {/* Show related credit note for invoices */}
                {selectedDocument.type === 'invoice' && selectedDocument.documentNumber === 'INV-2024-089' && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fef3c7',
                    borderRadius: '6px',
                    border: '1px solid #fbbf24'
                  }}>
                    <h4 style={{ marginBottom: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ℹ️ Related Credit Note
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>CN-2025-001 issued on 26 Jan 2025</span>
                      <span style={{ color: '#dc2626' }}>-{formatCurrency(15)}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#78350f', marginTop: '8px' }}>
                      1 fraudulent lead credited
                    </div>
                  </div>
                )}

                {selectedDocument.type === 'credit' && selectedDocument.appliedToDocument !== undefined ? (
                  <div style={{ marginTop: '24px' }}>
                    <div>
                      {selectedDocument.status === 'refunded' ? (
                        <span style={{ padding: '4px 8px', background: '#fef2f2', borderRadius: '4px', fontSize: '14px', display: 'inline-block', color: '#dc2626' }}>
                          💰 Cash refund issued
                        </span>
                      ) : selectedDocument.appliedToDocument ? (
                        <span style={{ padding: '4px 8px', background: '#dcfce7', borderRadius: '4px', fontSize: '14px', display: 'inline-block' }}>
                          ✓ Credit applied to {selectedDocument.appliedToDocument}
                        </span>
                      ) : (
                        <span style={{ padding: '4px 8px', background: '#dcfce7', borderRadius: '4px', fontSize: '14px', display: 'inline-block' }}>
                          ✓ Credit applied to future invoices
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {selectedDocument.type === 'credit' && selectedDocument.leadCount && selectedDocument.leadCount > 0 ? (
                <div className="leads-section" style={{ marginTop: '24px' }}>
                  <h4 style={{ color: '#374151', marginBottom: '12px' }}>{selectedDocument.status === 'refunded' ? 'Refunded' : 'Credited'} Leads ({selectedDocument.leadCount})</h4>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Lead ID</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Postcode</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Address</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocument.documentNumber === 'CN-2025-001' ? (
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-089-007</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>22 Dec 2024</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>SW1A 1AA</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>10 Downing Street</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                          </tr>
                        ) : selectedDocument.documentNumber === 'CN-2024-003' ? (
                          <>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-088-012</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>5 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M1 4AE</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>123 Deansgate</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-088-013</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>5 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M1 4AE</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>123 Deansgate</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                          </>
                        ) : selectedDocument.documentNumber === 'RN-2024-002' ? (
                          <>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-044-003</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>15 Oct 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B1 2HF</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>45 Corporation Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-044-007</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>15 Oct 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B1 3HG</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>67 Broad Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-044-011</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>15 Oct 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B1 4JK</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>89 New Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                          </>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedDocument.leads && selectedDocument.leads.length > 0 ? (
                <div className="leads-section">
                  <h4>Lead Details ({selectedDocument.leadCount} leads{selectedDocument.leads.filter(l => l.status === 'refunded').length > 0 ? `, ${selectedDocument.leads.filter(l => l.status === 'refunded').length} refunded` : ''})</h4>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Lead ID</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Postcode</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Address</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Amount</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocument.leads.map(lead => (
                          <tr key={lead.id} style={{
                            background: lead.status === 'refunded' ? '#fef2f2' : 'transparent',
                            color: lead.status === 'refunded' ? '#7f1d1d' : 'inherit',
                            borderBottom: '1px solid #f3f4f6'
                          }}>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{lead.id}</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatDate(lead.date)}</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{lead.postcode}</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{lead.address}</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(lead.amount)}</td>
                            <td style={{ padding: '8px 12px', fontSize: '14px', textTransform: 'capitalize' }}>{lead.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {/* Lead details for invoices */}
              {selectedDocument.type === 'invoice' && selectedDocument.leadCount && selectedDocument.leadCount > 0 && (
                <div className="leads-section" style={{ marginTop: '24px' }}>
                  <h4 style={{ color: '#374151', marginBottom: '12px' }}>Lead Details ({selectedDocument.leadCount} leads)</h4>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Lead ID</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Postcode</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Address</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: '600', fontSize: '12px', color: '#374151' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocument.documentNumber === 'INV-2025-001' ? (
                          <>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-001</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>1 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M1 4AE</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>123 Manchester Road</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-002</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>3 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M1 5BF</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>456 Oxford Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-003</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>5 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M2 1AA</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>789 Deansgate</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-004</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>8 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M3 2BB</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>321 Market Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-005</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>10 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M4 3CC</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>654 King Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-006</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>12 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M5 4DD</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>987 Princess Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-007</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>15 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M6 5EE</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>159 Portland Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-008</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>18 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M7 6FF</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>753 Mosley Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-009</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>20 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M8 7GG</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>852 Albert Square</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2025-001-010</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>22 Jan 2025</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>M9 8HH</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>741 Cross Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                          </>
                        ) : selectedDocument.documentNumber === 'INV-2025-002' ? (
                          <>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-001</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>28 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B1 1HH</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>111 New Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-002</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>29 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B2 4QQ</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>222 Corporation Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-003</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B3 2GG</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>333 Broad Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-004</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B4 5TT</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>444 High Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-005</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B5 6YY</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>555 Colmore Row</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-006</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B6 7UU</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>666 Victoria Square</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-007</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B7 8II</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>777 Temple Row</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-008</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B8 9OO</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>888 Paradise Circus</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-009</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B9 1PP</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>999 Edmund Street</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 12px', fontSize: '14px', fontFamily: 'monospace' }}>L-2024-130-010</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>30 Dec 2024</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>B10 2QQ</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>1010 Bull Ring</td>
                              <td style={{ padding: '8px 12px', fontSize: '14px' }}>{formatCurrency(15)}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={5} style={{
                              padding: '16px',
                              textAlign: 'center',
                              color: '#6b7280',
                              fontStyle: 'italic'
                            }}>
                              Lead details not available for this invoice
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
              {selectedDocument.status === 'pending' ? (
                <button style={{
                  padding: '8px 16px',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  background: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Pay Now
                </button>
              ) : selectedDocument.type === 'credit' ? (
                <button style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Download Credit Note
                </button>
              ) : (
                <button style={{
                  padding: '8px 16px',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  background: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessorBilling;