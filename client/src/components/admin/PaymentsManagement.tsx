import React, { useState, useEffect, useRef } from 'react';

interface PaymentRecord {
  id: string;
  assessorId: string;
  assessorName: string;
  assessorCompany?: string;
  invoiceNumber: string;
  period: string;
  amount: number;
  threshold: number;
  leadCount: number;
  status: 'pending' | 'paid' | 'failed' | 'disputed' | 'active';
  invoiceDate: Date;
  paymentDate?: Date;
  paymentMethod?: string;
  leads: {
    id: string;
    date: Date;
    postcode: string;
    amount: number;
  }[];
}

interface MonthlyRevenue {
  month: string;
  assessorPayments: number;
  subscriptionFees: number;
  premiumFeatures: number;
  totalRevenue: number;
}

interface PaymentsManagementProps {
  token: string;
}

const PaymentsManagement: React.FC<PaymentsManagementProps> = ({ token }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [statusFilter, setStatusFilter] = useState('overdue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notePayment, setNotePayment] = useState<PaymentRecord | null>(null);
  const [showNotesTimelineModal, setShowNotesTimelineModal] = useState(false);
  const [timelinePayment, setTimelinePayment] = useState<PaymentRecord | null>(null);
  const [cameFromTimeline, setCameFromTimeline] = useState(false);
  const [showAllSearchResults, setShowAllSearchResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      // Mock data for demo
      const mockPayments: PaymentRecord[] = [
        {
          id: 'pay-001',
          assessorId: 'ass-001',
          assessorName: 'Michael Davis',
          assessorCompany: 'Central EPC',
          invoiceNumber: 'INV-2024-001',
          period: '15 Dec - 24 Dec 2024',
          amount: 450.00,
          threshold: 450.00,
          leadCount: 30,
          status: 'paid',
          invoiceDate: new Date('2024-01-31'),
          paymentDate: new Date('2024-02-05'),
          paymentMethod: 'Card ending 4532',
          leads: [
            { id: 'lead-001', date: new Date('2024-01-15'), postcode: 'WC1A', amount: 15.00 },
            { id: 'lead-002', date: new Date('2024-01-18'), postcode: 'WC2H', amount: 15.00 },
            { id: 'lead-003', date: new Date('2024-01-22'), postcode: 'WC1E', amount: 15.00 }
          ]
        },
        {
          id: 'pay-002',
          assessorId: 'ass-002',
          assessorName: 'Emma Wilson',
          assessorCompany: 'Wilson Energy Solutions',
          invoiceNumber: 'INV-2024-002',
          period: '14 Nov - 13 Dec 2024',
          amount: 276.00,
          threshold: 450.00,
          leadCount: 23,
          status: 'pending',
          invoiceDate: new Date('2024-01-31'),
          leads: [
            { id: 'lead-004', date: new Date('2024-01-10'), postcode: 'EC1A', amount: 12.00 },
            { id: 'lead-005', date: new Date('2024-01-14'), postcode: 'EC2A', amount: 12.00 },
            { id: 'lead-006', date: new Date('2024-01-20'), postcode: 'EC1M', amount: 12.00 }
          ]
        },
        {
          id: 'pay-003',
          assessorId: 'ass-003',
          assessorName: 'James Brown',
          invoiceNumber: 'INV-2024-003',
          period: '1 Dec - 10 Dec 2023',
          amount: 600.00,
          threshold: 600.00,
          leadCount: 40,
          status: 'failed',
          invoiceDate: new Date('2023-12-31'),
          leads: [
            { id: 'lead-007', date: new Date('2023-12-05'), postcode: 'N1', amount: 15.00 },
            { id: 'lead-008', date: new Date('2023-12-08'), postcode: 'N7', amount: 15.00 },
            { id: 'lead-009', date: new Date('2023-12-12'), postcode: 'N19', amount: 15.00 }
          ]
        },
        {
          id: 'pay-004',
          assessorId: 'ass-004',
          assessorName: 'Sophie Taylor',
          assessorCompany: 'Green Cert Solutions',
          invoiceNumber: 'INV-2024-004',
          period: '20 Jan - 1 Feb 2024',
          amount: 750.00,
          threshold: 750.00,
          leadCount: 50,
          status: 'paid',
          invoiceDate: new Date('2024-02-29'),
          paymentDate: new Date('2024-03-02'),
          paymentMethod: 'Bank Transfer',
          leads: [
            { id: 'lead-010', date: new Date('2024-02-01'), postcode: 'E14', amount: 15.00 },
            { id: 'lead-011', date: new Date('2024-02-03'), postcode: 'E1W', amount: 15.00 },
            { id: 'lead-012', date: new Date('2024-02-05'), postcode: 'E1', amount: 15.00 }
          ]
        },
        {
          id: 'pay-005',
          assessorId: 'ass-005',
          assessorName: 'David Johnson',
          invoiceNumber: 'INV-2024-005',
          period: '15 Jan - 14 Feb 2024',
          amount: 180.00,
          threshold: 300.00,
          leadCount: 15,
          status: 'disputed',
          invoiceDate: new Date('2024-02-29'),
          leads: [
            { id: 'lead-013', date: new Date('2024-02-10'), postcode: 'B1', amount: 12.00 },
            { id: 'lead-014', date: new Date('2024-02-15'), postcode: 'B2', amount: 12.00 },
            { id: 'lead-015', date: new Date('2024-02-20'), postcode: 'B3', amount: 12.00 }
          ]
        },
        {
          id: 'pay-006',
          assessorId: 'ass-006',
          assessorName: 'Sarah Mitchell',
          assessorCompany: 'Mitchell Energy Assessments',
          invoiceNumber: 'INV-2023-089',
          period: '15 Oct - 14 Nov 2023',
          amount: 525.00,
          threshold: 600.00,
          leadCount: 35,
          status: 'pending',
          invoiceDate: new Date('2023-11-14'), // 120+ days old
          leads: [
            { id: 'lead-016', date: new Date('2023-10-20'), postcode: 'SW1', amount: 15.00 },
            { id: 'lead-017', date: new Date('2023-10-25'), postcode: 'SW3', amount: 15.00 },
            { id: 'lead-018', date: new Date('2023-11-01'), postcode: 'SW6', amount: 15.00 }
          ]
        },
        {
          id: 'pay-007',
          assessorId: 'ass-007',
          assessorName: 'Robert Clarke',
          invoiceNumber: 'INV-2023-045',
          period: '1 Sep - 15 Sep 2023',
          amount: 450.00,
          threshold: 450.00,
          leadCount: 30,
          status: 'failed',
          invoiceDate: new Date('2023-09-15'), // 180+ days old
          leads: [
            { id: 'lead-019', date: new Date('2023-09-05'), postcode: 'N1', amount: 15.00 },
            { id: 'lead-020', date: new Date('2023-09-08'), postcode: 'N5', amount: 15.00 },
            { id: 'lead-021', date: new Date('2023-09-12'), postcode: 'N8', amount: 15.00 }
          ]
        },
        {
          id: 'pay-008',
          assessorId: 'ass-008',
          assessorName: 'Lisa Thompson',
          assessorCompany: 'EcoCheck Solutions',
          invoiceNumber: 'INV-2023-012',
          period: '15 Jul - 30 Jul 2023',
          amount: 375.00,
          threshold: 450.00,
          leadCount: 25,
          status: 'pending',
          invoiceDate: new Date('2023-07-30'), // 240+ days old
          leads: [
            { id: 'lead-022', date: new Date('2023-07-20'), postcode: 'E1', amount: 15.00 },
            { id: 'lead-023', date: new Date('2023-07-25'), postcode: 'E2', amount: 15.00 },
            { id: 'lead-024', date: new Date('2023-07-28'), postcode: 'E3', amount: 15.00 }
          ]
        },
        {
          id: 'pay-009',
          assessorId: 'ass-009',
          assessorName: 'Peter Williams',
          assessorCompany: 'Williams & Co Energy',
          invoiceNumber: 'INV-2024-101',
          period: '1 Mar - Present',
          amount: 225.00,
          threshold: 450.00,
          leadCount: 15,
          status: 'active',
          invoiceDate: new Date('2024-03-01'), // Invoice created at start of period
          leads: [
            { id: 'lead-025', date: new Date('2024-03-01'), postcode: 'SW1', amount: 15.00 },
            { id: 'lead-026', date: new Date('2024-03-05'), postcode: 'SW2', amount: 15.00 },
            { id: 'lead-027', date: new Date('2024-03-10'), postcode: 'SW3', amount: 15.00 }
          ]
        },
        {
          id: 'pay-010',
          assessorId: 'ass-010',
          assessorName: 'Amanda Foster',
          invoiceNumber: 'INV-2024-098',
          period: '15 Feb - Present',
          amount: 120.00,
          threshold: 300.00,
          leadCount: 10,
          status: 'active',
          invoiceDate: new Date('2024-02-15'), // Invoice created at start of period
          leads: [
            { id: 'lead-028', date: new Date('2024-02-15'), postcode: 'N1', amount: 12.00 },
            { id: 'lead-029', date: new Date('2024-02-20'), postcode: 'N2', amount: 12.00 },
            { id: 'lead-030', date: new Date('2024-02-25'), postcode: 'N3', amount: 12.00 }
          ]
        }
      ];

      const mockMonthlyRevenue: MonthlyRevenue[] = [
        { month: 'Jan 2024', assessorPayments: 15420, subscriptionFees: 2800, premiumFeatures: 850, totalRevenue: 19070 },
        { month: 'Feb 2024', assessorPayments: 18650, subscriptionFees: 3200, premiumFeatures: 1200, totalRevenue: 23050 },
        { month: 'Mar 2024', assessorPayments: 22100, subscriptionFees: 3600, premiumFeatures: 1450, totalRevenue: 27150 },
        { month: 'Apr 2024', assessorPayments: 19800, subscriptionFees: 3400, premiumFeatures: 980, totalRevenue: 24180 },
        { month: 'May 2024', assessorPayments: 26400, subscriptionFees: 4100, premiumFeatures: 1800, totalRevenue: 32300 },
        { month: 'Jun 2024', assessorPayments: 29800, subscriptionFees: 4500, premiumFeatures: 2100, totalRevenue: 36400 }
      ];

      setPayments(mockPayments);
      setMonthlyRevenue(mockMonthlyRevenue);
    } catch (error) {
      console.error('Error fetching payments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverviewStats = () => {
    const totalDue = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const activeInvoices = payments.filter(p => p.status === 'pending' || p.status === 'failed').length;

    // Calculate overdue amount (invoices older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const overdueAmount = payments
      .filter(p => p.status === 'pending' && p.invoiceDate < thirtyDaysAgo)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalDue,
      overdueAmount,
      totalPaid,
      activeInvoices
    };
  };

  const formatCurrency = (amount: number) => {
    return amount % 1 === 0 ? `£${amount}` : `£${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'status-badge paid';
      case 'pending': return 'status-badge pending';
      case 'failed': return 'status-badge failed';
      case 'disputed': return 'status-badge disputed';
      case 'active': return 'status-badge active';
      default: return 'status-badge';
    }
  };

  const generateLeadsForPayment = (payment: PaymentRecord) => {
    const postcodes = ['W1A 1AA', 'WC1A 2BB', 'WC2H 3CC', 'EC1A 4DD', 'EC2A 5EE', 'EC1M 6FF', 'N1 7GG', 'N7 8HH', 'N19 9JJ', 'E14 1KK', 'E1W 2LL', 'E1 3MM', 'B1 4NN', 'B2 5PP', 'B3 6QQ', 'SW1 7RR', 'SW3 8SS', 'SW6 9TT', 'SE1 1UU', 'SE10 2VV', 'NW1 3WW', 'NW3 4XX', 'NW8 5YY', 'CR0 6ZZ', 'BR1 7AA', 'TW1 8BB', 'KT1 9CC', 'RM1 1DD', 'IG1 2EE', 'UB1 3FF'];
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Sophie', 'Robert', 'Amanda', 'Peter', 'Helen', 'Andrew', 'Rebecca', 'Mark', 'Caroline', 'Paul', 'Jessica', 'Simon', 'Rachel'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const propertyTypes = ['Flat', 'House', 'Maisonette', 'Bungalow', 'Terraced House', 'Semi-Detached', 'Detached House'];
    const leads = [];
    const startDate = new Date(payment.invoiceDate);

    for (let i = 0; i < payment.leadCount; i++) {
      const leadDate = new Date(startDate);
      leadDate.setDate(startDate.getDate() + Math.floor(i / 2));
      const fullPostcode = postcodes[i % postcodes.length];
      const postcodeArea = fullPostcode.split(' ')[0];

      const dateStr = leadDate.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD format
      const letterIndex = Math.floor(Math.random() * 26); // Simulate company-wide sequential
      const leadLetter = String.fromCharCode(65 + (letterIndex % 26)); // A-Z

      leads.push({
        id: `${dateStr}${leadLetter}`,
        date: leadDate,
        postcode: postcodeArea,
        fullPostcode: fullPostcode,
        amount: payment.amount / payment.leadCount,
        customer: {
          name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
          phone: `07${Math.floor(Math.random() * 900000000 + 100000000)}`,
          email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i + 5) % lastNames.length].toLowerCase()}@email.com`,
          address: `${Math.floor(Math.random() * 200) + 1} ${['High Street', 'Church Lane', 'Victoria Road', 'King Street', 'Queen Avenue', 'Park Road'][i % 6]}`
        },
        property: {
          type: propertyTypes[i % propertyTypes.length],
          bedrooms: Math.floor(Math.random() * 4) + 1,
          size: Math.floor(Math.random() * 100) + 50,
          yearBuilt: Math.floor(Math.random() * 50) + 1970
        }
      });
    }

    return leads;
  };

  const getStatusDisplay = (payment: PaymentRecord) => {
    const today = new Date();
    const dueDate = new Date(payment.invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30); // 30 days to pay

    switch (payment.status) {
      case 'paid':
        return {
          label: 'Paid',
          date: payment.paymentDate ? formatDate(payment.paymentDate) : '',
          isOverdue: false
        };
      case 'pending':
        const isOverdue = today > dueDate;
        return {
          label: isOverdue ? 'Overdue' : 'Due',
          date: formatDate(dueDate),
          isOverdue
        };
      case 'failed':
        return {
          label: 'Overdue',
          date: formatDate(dueDate),
          isOverdue: true
        };
      case 'disputed':
        return {
          label: 'Overdue',
          date: formatDate(dueDate),
          isOverdue: true
        };
      case 'active':
        return {
          label: 'Active',
          date: '',
          isOverdue: false
        };
      default:
        return {
          label: payment.status,
          date: '',
          isOverdue: false
        };
    }
  };

  const getDropdownActions = (payment: PaymentRecord) => {
    const statusDisplay = getStatusDisplay(payment);

    switch (payment.status) {
      case 'paid':
        return [
          { label: 'Add Note', action: 'add-note' }
        ];

      case 'pending':
      case 'failed':
      case 'disputed':
        // Overdue/Due invoices
        return [
          { label: 'Add Note', action: 'add-note' },
          { label: 'Mark Paid', action: 'mark-paid' },
          { label: 'Adjust Amount', action: 'adjust-amount' },
          { label: 'Send Payment Link', action: 'send-payment-link' }
        ];

      case 'active':
        return [
          { label: 'Add Note', action: 'add-note' },
          { label: 'Adjust Amount', action: 'adjust-amount' }
        ];

      default:
        return [
          { label: 'Add Note', action: 'add-note' }
        ];
    }
  };

  // Helper function to check if payment matches search term
  const matchesSearchTerm = (payment: PaymentRecord) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return payment.assessorName.toLowerCase().includes(term) ||
           payment.invoiceNumber.toLowerCase().includes(term) ||
           payment.period.toLowerCase().includes(term) ||
           (payment.assessorCompany && payment.assessorCompany.toLowerCase().includes(term));
  };

  // Get all payments that match search (ignoring status filter)
  const allSearchResults = payments.filter(matchesSearchTerm);

  // Get filtered payments (respecting both search and status filter)
  const filteredPayments = payments.filter(payment => {
    const statusDisplay = getStatusDisplay(payment);
    let matchesStatus = false;

    // If showing all search results, ignore status filter
    if (showAllSearchResults && searchTerm) {
      matchesStatus = true;
    } else {
      switch (statusFilter) {
        case 'all':
          matchesStatus = true;
          break;
        case 'overdue':
          matchesStatus = statusDisplay.label === 'Overdue';
          break;
        case 'due':
          matchesStatus = statusDisplay.label === 'Due';
          break;
        case 'active':
          matchesStatus = statusDisplay.label === 'Active';
          break;
        case 'paid':
          matchesStatus = statusDisplay.label === 'Paid';
          break;
        default:
          matchesStatus = true;
      }
    }

    return matchesStatus && matchesSearchTerm(payment);
  });

  // Calculate smart search info
  const getSearchResultsInfo = () => {
    if (!searchTerm) return null;

    const currentResults = filteredPayments.length;
    const totalResults = allSearchResults.length;
    const hasHiddenResults = !showAllSearchResults && statusFilter !== 'all' && totalResults > currentResults;

    return {
      currentResults,
      totalResults,
      hasHiddenResults,
      statusFilter
    };
  };

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageItems = () => {
    return filteredPayments.slice(startIndex, endIndex);
  };

  const generatePageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 2, 3, '...', totalPages];
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Only scroll if pagination controls are not visible
      setTimeout(() => {
        if (paginationRef.current) {
          const rect = paginationRef.current.getBoundingClientRect();
          const isVisible = rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

          if (!isVisible) {
            paginationRef.current.scrollIntoView({
              behavior: 'auto',
              block: 'end'
            });
          }
        }
      }, 50);
    }
  };

  const getPaginationInfo = () => {
    const start = startIndex + 1;
    const end = Math.min(endIndex, filteredPayments.length);
    const total = filteredPayments.length;
    return { start, end, total };
  };

  const handleAddNote = (payment: PaymentRecord, fromTimeline = false) => {
    setNotePayment(payment);
    setNoteContent('');
    setCameFromTimeline(fromTimeline);
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (!noteContent.trim() || !notePayment) return;

    // Here you would save to backend
    console.log('Saving note:', {
      assessorId: notePayment.assessorId,
      invoiceId: notePayment.invoiceNumber,
      content: noteContent,
      timestamp: new Date(),
      type: 'admin_note'
    });

    // Reset and close
    setNoteContent('');
    setShowNoteModal(false);
    setNotePayment(null);

    // If came from timeline, reopen timeline modal
    if (cameFromTimeline && timelinePayment) {
      setShowNotesTimelineModal(true);
    }
    setCameFromTimeline(false);
  };

  const handleViewNotes = (payment: PaymentRecord) => {
    setTimelinePayment(payment);
    setShowNotesTimelineModal(true);
  };

  const getMockNotesTimeline = (payment: PaymentRecord) => {
    // Mock notes data - in real app this would come from API
    return [
      {
        id: '1',
        timestamp: new Date('2024-03-15T14:30:00Z'),
        type: 'admin_note',
        content: 'Called assessor 3 times, no response. Sending final notice.',
        adminName: 'John Admin'
      },
      {
        id: '2',
        timestamp: new Date('2024-03-14T10:00:00Z'),
        type: 'auto_email',
        content: 'Payment reminder email sent',
        metadata: { status: 'delivered' }
      },
      {
        id: '3',
        timestamp: new Date('2024-03-12T15:45:00Z'),
        type: 'admin_note',
        content: 'Discussed payment plan options with assessor',
        adminName: 'Sarah Admin'
      },
      {
        id: '4',
        timestamp: new Date('2024-03-10T09:00:00Z'),
        type: 'auto_invoice',
        content: `Invoice ${payment.invoiceNumber} generated`,
        metadata: { amount: payment.amount }
      }
    ];
  };

  if (loading) {
    return (
      <div className="payments-loading">
        <div className="loading-spinner"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="payments-management">
      <div className="payments-header">
        <div className="header-content">
          <div>
            <h1>Payment Management</h1>
            <p>Track assessor payments, revenue, and financial performance</p>
          </div>
          <div className="header-actions">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-filter-dropdown"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="export-btn">Export Data</button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="summary-cards">
        <div className="summary-card warning">
          <div className="card-label">Total Due</div>
          <div className="card-value">{formatCurrency(stats.totalDue)}</div>
          <div className="card-sub">{payments.filter(p => p.status === 'pending').length} pending invoices</div>
        </div>
        <div className="summary-card error">
          <div className="card-label">Overdue Amount</div>
          <div className="card-value">{formatCurrency(stats.overdueAmount)}</div>
          <div className="card-sub">Over 30 days old</div>
        </div>
        <div className="summary-card success">
          <div className="card-label">Total Paid</div>
          <div className="card-value">{formatCurrency(stats.totalPaid)}</div>
          <div className="card-sub">{payments.filter(p => p.status === 'paid').length} completed payments</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Active Invoices</div>
          <div className="card-value">{stats.activeInvoices}</div>
          <div className="card-sub">Pending & failed invoices</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="payments-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="overview-section">
            <h2>Recent Activity</h2>
            <div className="recent-payments">
              {payments.slice(0, 5).map(payment => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-info">
                    <div className="assessor-name">{payment.assessorName}</div>
                    <div className="payment-details">
                      {payment.invoiceNumber} • {formatDate(payment.invoiceDate)}
                    </div>
                  </div>
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                  <div className={getStatusBadgeClass(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="tab-content">
          <div className="transactions-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search assessors, invoice numbers, periods..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowAllSearchResults(false); // Reset when typing
                }}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setShowAllSearchResults(false);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Invoices</option>
              <option value="overdue">Overdue</option>
              <option value="due">Due</option>
              <option value="active">Active</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="transactions-table">
            <div className="table-header">
              <div className="col-date">Date</div>
              <div className="col-invoice">Invoice ID</div>
              <div className="col-assessor">Assessor</div>
              <div className="col-period">Period</div>
              <div className="col-amount">Amount</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>

            {getCurrentPageItems().map((payment, index) => (
              <div key={payment.id} className="table-row">
                <div className="col-date">
                  {formatDate(payment.invoiceDate)}
                </div>
                <div className="col-invoice">
                  {payment.invoiceNumber}
                </div>
                <div className="col-assessor">
                  <div className="assessor-info">
                    <div className="assessor-name">{payment.assessorName}</div>
                    {payment.assessorCompany && (
                      <div className="assessor-company">{payment.assessorCompany}</div>
                    )}
                  </div>
                </div>
                <div className="col-period">
                  {payment.period}
                </div>
                <div className="col-amount">
                  <div className="amount-stacked">
                    <div className="amount-label">Spend / Threshold</div>
                    <div className="amount-threshold">
                      {formatCurrency(payment.amount)} / {formatCurrency(payment.threshold)}
                    </div>
                    <div className="lead-count">
                      {payment.leadCount} leads
                    </div>
                  </div>
                </div>
                <div className="col-status">
                  <div className="status-with-date">
                    <span className={getStatusDisplay(payment).label === 'Overdue' ? 'status-badge failed' : getStatusBadgeClass(payment.status)}>
                      {getStatusDisplay(payment).label}
                    </span>
                    {getStatusDisplay(payment).date && (
                      <div className={`status-date ${getStatusDisplay(payment).isOverdue ? 'overdue' : ''}`}>
                        {getStatusDisplay(payment).date}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-actions">
                  <div className="action-option-1">
                    <button
                      className="action-btn primary"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                    <div className="dropdown-container">
                      <button className="action-btn menu">⋮</button>
                      <div className="dropdown-content">
                        {getDropdownActions(payment).map((action) => (
                          <button
                            key={action.action}
                            className="dropdown-item"
                            onClick={() => {
                              if (action.action === 'add-note') {
                                handleAddNote(payment);
                              } else if (action.action === 'send-payment-link') {
                                console.log(`Sending payment link for ${payment.invoiceNumber} to ${payment.assessorName}`);
                                // Here you would trigger the payment link email/SMS
                              } else {
                                console.log(`${action.action} for ${payment.invoiceNumber}`);
                              }
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredPayments.length === 0 && (
            <div className="no-results">
              {(() => {
                const searchInfo = getSearchResultsInfo();

                if (!searchTerm) {
                  // No search term, just no results for current filter
                  return (
                    <div className="no-results-content">
                      <div className="no-results-title">No invoices found</div>
                      <div className="no-results-subtitle">
                        No {statusFilter === 'all' ? '' : statusFilter + ' '}invoices match your current filter.
                      </div>
                    </div>
                  );
                }

                if (searchInfo?.hasHiddenResults) {
                  // Found results but they're filtered out
                  return (
                    <div className="no-results-content">
                      <div className="no-results-title">
                        No {searchInfo.statusFilter} invoices found for "{searchTerm}"
                      </div>
                      <div className="no-results-subtitle">
                        Found {searchInfo.totalResults} other invoices for this search
                      </div>
                      <div className="no-results-actions">
                        <button
                          className="show-all-btn"
                          onClick={() => setShowAllSearchResults(true)}
                        >
                          Show All Results
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  // No results found at all
                  return (
                    <div className="no-results-content">
                      <div className="no-results-title">No invoices found for "{searchTerm}"</div>
                      <div className="no-results-actions">
                        <button
                          className="clear-search-btn"
                          onClick={() => {
                            setSearchTerm('');
                            setShowAllSearchResults(false);
                          }}
                        >
                          Clear Search
                        </button>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          )}

          {/* Show all results banner */}
          {showAllSearchResults && searchTerm && (
            <div className="search-results-banner">
              <span>Showing all search results for "{searchTerm}" •</span>
              <button
                className="filter-results-btn"
                onClick={() => setShowAllSearchResults(false)}
              >
                Show Only {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredPayments.length > itemsPerPage && (
            <div className="pagination-container" ref={paginationRef}>
              <div className="pagination-info">
                Showing {getPaginationInfo().start} to {getPaginationInfo().end} of {getPaginationInfo().total} entries
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ‹
                </button>
                {generatePageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum as number)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="tab-content">
          <div className="analytics-section">
            <h2>Revenue Trends</h2>
            <div className="revenue-chart-placeholder">
              <div className="chart-info">
                <h3>Monthly Revenue Growth</h3>
                <div className="chart-stats">
                  {monthlyRevenue.slice(-3).map(month => (
                    <div key={month.month} className="month-stat">
                      <div className="month-name">{month.month}</div>
                      <div className="month-revenue">{formatCurrency(month.totalRevenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Top Performing Areas</h3>
                <div className="area-performance">
                  <div className="area-item">
                    <span className="area-name">London (Central)</span>
                    <span className="area-revenue">{formatCurrency(1250)}</span>
                  </div>
                  <div className="area-item">
                    <span className="area-name">London (East)</span>
                    <span className="area-revenue">{formatCurrency(890)}</span>
                  </div>
                  <div className="area-item">
                    <span className="area-name">London (North)</span>
                    <span className="area-revenue">{formatCurrency(720)}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Payment Methods</h3>
                <div className="payment-methods">
                  <div className="method-item">
                    <span className="method-name">Credit Card</span>
                    <span className="method-percentage">68%</span>
                  </div>
                  <div className="method-item">
                    <span className="method-name">Bank Transfer</span>
                    <span className="method-percentage">25%</span>
                  </div>
                  <div className="method-item">
                    <span className="method-name">Direct Debit</span>
                    <span className="method-percentage">7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="invoice-summary">
                <div className="invoice-header">
                  <div className="invoice-number">
                    <h3>{selectedPayment.invoiceNumber}</h3>
                    <span className={getStatusBadgeClass(selectedPayment.status)}>
                      {getStatusDisplay(selectedPayment).label}
                    </span>
                  </div>
                  <div className="invoice-amount">
                    <div className="amount-large">{formatCurrency(selectedPayment.amount)}</div>
                    <div className="amount-details">
                      {selectedPayment.amount} / {formatCurrency(selectedPayment.threshold)} • {selectedPayment.leadCount} leads
                    </div>
                  </div>
                </div>

                <div className="invoice-info">
                  <div className="info-row">
                    <span className="label">Assessor:</span>
                    <span className="value">
                      {selectedPayment.assessorName}
                      {selectedPayment.assessorCompany && ` (${selectedPayment.assessorCompany})`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Period:</span>
                    <span className="value">{selectedPayment.period}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Invoice Date:</span>
                    <span className="value">{formatDate(selectedPayment.invoiceDate)}</span>
                  </div>
                  {selectedPayment.paymentDate && (
                    <div className="info-row">
                      <span className="label">Payment Date:</span>
                      <span className="value">{formatDate(selectedPayment.paymentDate)}</span>
                    </div>
                  )}
                  {selectedPayment.paymentMethod && (
                    <div className="info-row">
                      <span className="label">Payment Method:</span>
                      <span className="value">{selectedPayment.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="leads-section">
                <h4>Lead Details ({selectedPayment.leadCount} leads)</h4>
                <div className="leads-table-container">
                  <table className="leads-table-simple">
                    <thead>
                      <tr>
                        <th>Lead ID</th>
                        <th>Date</th>
                        <th>Postcode</th>
                        <th>Address</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateLeadsForPayment(selectedPayment).map(lead => (
                        <tr key={lead.id}>
                          <td>{lead.id}</td>
                          <td>{formatDate(lead.date)}</td>
                          <td>{lead.postcode}</td>
                          <td>{lead.customer.address}</td>
                          <td>{formatCurrency(lead.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleViewNotes(selectedPayment)}
              >
                View Notes
              </button>
              <button className="btn-primary">Download Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && notePayment && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Note</h2>
              <button className="modal-close" onClick={() => setShowNoteModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="note-context">
                <div className="context-row">
                  <span className="context-label">Assessor:</span>
                  <span className="context-value">{notePayment.assessorName}</span>
                </div>
                <div className="context-row">
                  <span className="context-label">Invoice:</span>
                  <span className="context-value context-disabled">{notePayment.invoiceNumber}</span>
                </div>
                <div className="context-row">
                  <span className="context-label">Amount:</span>
                  <span className="context-value context-disabled">{formatCurrency(notePayment.amount)}</span>
                </div>
              </div>

              <div className="note-input-section">
                <label htmlFor="note-content">Note Content:</label>
                <textarea
                  id="note-content"
                  className="note-textarea"
                  placeholder="Enter your note about this invoice or assessor..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteContent('');
                  setNotePayment(null);

                  // If came from timeline, reopen timeline modal
                  if (cameFromTimeline && timelinePayment) {
                    setShowNotesTimelineModal(true);
                  }
                  setCameFromTimeline(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={saveNote}
                disabled={!noteContent.trim()}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Timeline Modal */}
      {showNotesTimelineModal && timelinePayment && (
        <div className="modal-overlay" onClick={() => setShowNotesTimelineModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Notes & Communication Timeline</h2>
              <button className="modal-close" onClick={() => setShowNotesTimelineModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="timeline-header">
                <div className="timeline-assessor">
                  <strong>{timelinePayment.assessorName}</strong>
                  {timelinePayment.assessorCompany && (
                    <span className="company-name"> ({timelinePayment.assessorCompany})</span>
                  )}
                </div>
                <div className="timeline-invoice">
                  Related to: {timelinePayment.invoiceNumber} • {formatCurrency(timelinePayment.amount)}
                </div>
              </div>

              <div className="timeline-container">
                {getMockNotesTimeline(timelinePayment).map((note) => (
                  <div key={note.id} className={`timeline-item ${note.type}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-time">
                          {new Date(note.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="timeline-type">
                          {note.type === 'admin_note' && `${note.adminName}`}
                          {note.type === 'auto_email' && 'Automated Email'}
                          {note.type === 'auto_invoice' && 'System'}
                        </span>
                      </div>
                      <div className="timeline-text">{note.content}</div>
                      {note.metadata && (
                        <div className="timeline-metadata">
                          {note.type === 'auto_email' && `Status: ${note.metadata.status}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowNotesTimelineModal(false)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowNotesTimelineModal(false);
                  handleAddNote(timelinePayment, true);
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentsManagement;