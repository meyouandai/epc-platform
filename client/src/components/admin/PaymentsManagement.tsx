import React, { useState, useEffect } from 'react';

interface PaymentsManagementProps {
  token: string;
}

const PaymentsManagement: React.FC<PaymentsManagementProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="payments-management">
        <div className="loading-spinner">
          <p>Loading payments data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-management">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-management">
      <div className="header">
        <h1>Payments Management</h1>
        <p>Monitor assessor payments and platform revenue</p>
      </div>

      <div className="no-data">
        <h2>No Payment Data Available</h2>
        <p>No payment records have been created yet. This will show real payment data when transactions occur in the system.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Payments</h3>
            <div className="stat-value">0</div>
            <div className="stat-label">All time</div>
          </div>

          <div className="stat-card">
            <h3>This Month</h3>
            <div className="stat-value">£0</div>
            <div className="stat-label">Revenue</div>
          </div>

          <div className="stat-card">
            <h3>Outstanding</h3>
            <div className="stat-value">£0</div>
            <div className="stat-label">Pending payments</div>
          </div>

          <div className="stat-card">
            <h3>Active Assessors</h3>
            <div className="stat-value">0</div>
            <div className="stat-label">With transactions</div>
          </div>
        </div>
      </div>

      <style>{`
        .payments-management {
          padding: 20px;
        }
        .header {
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #333;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }
        .no-data h2 {
          color: #495057;
          margin: 0 0 10px 0;
        }
        .no-data p {
          color: #6c757d;
          margin: 0 0 30px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #28a745;
          margin: 10px 0;
        }
        .stat-label {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }
        .loading-spinner, .error-message {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default PaymentsManagement;