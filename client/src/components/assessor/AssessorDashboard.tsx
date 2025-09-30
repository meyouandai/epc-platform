import React, { useState, useEffect } from 'react';

interface AssessorDashboardProps {
  token: string;
  assessorId: string;
  onSectionChange?: (section: string) => void;
}

interface DashboardData {
  totalLeads: {
    today: number;
    yesterday: number;
    last7Days: number;
    last30Days: number;
  };
  activePostCodes: number;
  averageLeadPrice: number;
  paymentStatus: 'good' | 'due' | 'overdue' | 'failed';
  lastPaymentDate: Date;
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  canHaveMultipleInvoices: boolean;
}

interface MultipleBillingStatus {
  type: 'multiple';
  currentSpend: number;
  threshold: number;
  invoiceCount: number;
  nextDueDate: Date;
  creditLimit: number;
}

interface SingleBillingStatus {
  type: 'single';
  currentSpend: number;
  threshold: number;
  estimatedDays: number;
}

type BillingStatus = MultipleBillingStatus | SingleBillingStatus;

const AssessorDashboard: React.FC<AssessorDashboardProps> = ({ token, assessorId, onSectionChange }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock dashboard data - replace with API call
    const mockDashboardData: DashboardData = {
      totalLeads: {
        today: 2,
        yesterday: 5,
        last7Days: 18,
        last30Days: 67
      },
      activePostCodes: 12,
      averageLeadPrice: 3.2,
      paymentStatus: 'good',
      lastPaymentDate: new Date('2024-12-28'),
      trustLevel: 'bronze',
      canHaveMultipleInvoices: false
    };

    setDashboardData(mockDashboardData);
    setLoading(false);
  }, [token, assessorId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(date);
  };

  const getPaymentStatusInfo = () => {
    if (!dashboardData) return { text: '£0 Outstanding', subText: 'No issues detected', cardClass: '' };

    switch (dashboardData.paymentStatus) {
      case 'good':
        return {
          text: '£0 Outstanding',
          subText: `Last payment: ${formatDate(dashboardData.lastPaymentDate)}`,
          cardClass: ''
        };
      case 'due':
        return {
          text: 'Invoice Due',
          subText: 'Due in 5 days',
          cardClass: 'warning'
        };
      case 'overdue':
        return {
          text: 'Payment Overdue',
          subText: '7 days overdue',
          cardClass: 'error'
        };
      case 'failed':
        return {
          text: 'Auto-pay Failed',
          subText: 'Grace period: 3 days left',
          cardClass: 'warning'
        };
      default:
        return { text: '£0 Outstanding', subText: 'No issues detected', cardClass: '' };
    }
  };

  const getBillingStatus = (): BillingStatus | null => {
    if (!dashboardData) return null;

    if (dashboardData.canHaveMultipleInvoices) {
      // Trusted assessor with multiple invoices
      return {
        type: 'multiple' as const,
        currentSpend: 675,
        threshold: 450,
        invoiceCount: 2,
        nextDueDate: new Date('2025-01-30'),
        creditLimit: 900
      };
    } else {
      // Single invoice assessor
      return {
        type: 'single' as const,
        currentSpend: 225,
        threshold: 450,
        estimatedDays: Math.ceil((450 - 225) / (225 / 30)) // Based on current rate
      };
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const paymentStatusInfo = getPaymentStatusInfo();
  const billingStatus = getBillingStatus();

  return (
    <div className="assessor-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
      </div>

      {/* 4 Metrics Cards */}
      <div className="summary-cards">
        {/* Total Leads Card */}
        <div className="summary-card">
          <div className="card-label">Total Leads</div>
          <div className="card-value">{dashboardData?.totalLeads.last30Days || 0}</div>
          <div className="card-sub">
            Leads purchased last 30 days
          </div>
        </div>

        {/* Active Post Codes */}
        <div className="summary-card">
          <div className="card-label">Active Post Codes</div>
          <div className="card-value">{dashboardData?.activePostCodes || 0}</div>
          <div className="card-sub">Areas you're covering</div>
        </div>

        {/* Average Lead Price */}
        <div className="summary-card">
          <div className="card-label">Average Lead Price</div>
          <div className="card-value">{formatCurrency(dashboardData?.averageLeadPrice || 0)}</div>
          <div className="card-sub">Per lead purchased</div>
        </div>

        {/* Payment Status */}
        <div className={`summary-card ${paymentStatusInfo.cardClass}`}>
          <div className="card-label">Payment Status</div>
          <div className="card-value">{paymentStatusInfo.text}</div>
          <div className="card-sub">{paymentStatusInfo.subText}</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="two-column">
        {/* Recent Leads */}
        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Recent Leads</h3>
            <button className="view-all-btn" onClick={() => onSectionChange?.('leads')}>
              View All
            </button>
          </div>
          <div className="recent-leads">
            <div className="lead-item">
              <div className="lead-info">
                <div className="lead-postcode">WV6 8DL</div>
                <div className="lead-customer">Sarah Johnson</div>
              </div>
              <div className="lead-price">£3</div>
            </div>
            <div className="lead-item">
              <div className="lead-info">
                <div className="lead-postcode">CV1 2AB</div>
                <div className="lead-customer">David Chen</div>
              </div>
              <div className="lead-price">£4</div>
            </div>
            <div className="lead-item">
              <div className="lead-info">
                <div className="lead-postcode">B1 1AA</div>
                <div className="lead-customer">Emma Thompson</div>
              </div>
              <div className="lead-price">£2</div>
            </div>
            <div className="lead-item">
              <div className="lead-info">
                <div className="lead-postcode">LS1 4DP</div>
                <div className="lead-customer">Manchester Properties</div>
              </div>
              <div className="lead-price">£3</div>
            </div>
            <div className="lead-item">
              <div className="lead-info">
                <div className="lead-postcode">M1 1AD</div>
                <div className="lead-customer">Robert Wilson</div>
              </div>
              <div className="lead-price">£3</div>
            </div>
          </div>
        </div>

        {/* Your Spending Card - Exact copy from AssessorBilling.tsx */}
        <div className="content-section" style={{ display: 'flex', flexDirection: 'column' }}>
          {billingStatus && billingStatus.type === 'single' ? (
            <div className="period-stat-card" style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              position: 'relative'
            }}>
              <div className="stat-label">Your Spending</div>
              <div className="spending-amount">
                <span className="current-amount">{formatCurrency(billingStatus.currentSpend)}</span>
                <span className="threshold-amount"> of {formatCurrency(billingStatus.threshold)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#059669' }}>
                  {formatCurrency(billingStatus.threshold - billingStatus.currentSpend)} remaining
                </span>
              </div>
              <div
                className="progress-bar-refined"
                style={{
                  marginTop: '20px',
                  marginBottom: '0px'
                }}
              >
                <div
                  className="progress-fill-refined"
                  style={{ width: `${(billingStatus.currentSpend / billingStatus.threshold) * 100}%` }}
                >
                  {Math.round((billingStatus.currentSpend / billingStatus.threshold) * 100)}%
                </div>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '12px',
                marginBottom: '8px'
              }}>
                Auto-charge at {formatCurrency(billingStatus.threshold)} or period end (whichever first)
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                <button
                  className="nav-button"
                  onClick={() => onSectionChange?.('billing')}
                  style={{ fontSize: '12px', flex: 1 }}
                >
                  Pause Purchasing
                </button>
                <button
                  className="view-all-btn"
                  onClick={() => onSectionChange?.('billing')}
                  style={{ fontSize: '12px', flex: 1 }}
                >
                  View Billing
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💳</div>
              <p>Your billing information will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessorDashboard;