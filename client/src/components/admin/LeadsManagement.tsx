import React, { useState, useEffect } from 'react';

interface AdminLead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  propertyType: string;
  status: string;
  price: number;
  createdAt: string;
}

interface LeadsManagementProps {
  token: string;
}

const LeadsManagement: React.FC<LeadsManagementProps> = ({ token }) => {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();

      if (data.success) {
        setLeads(data.leads || []);
      } else {
        setError('Failed to load leads data');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Error loading leads data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leads-management">
        <div className="loading-spinner">
          <p>Loading leads data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leads-management">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchLeads}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-management">
      <div className="header">
        <h1>Leads Management</h1>
        <p>Total leads: {leads.length}</p>
      </div>

      {leads.length === 0 ? (
        <div className="no-data">
          <h2>No Leads Available</h2>
          <p>No leads have been created yet. This will show real lead data when leads are added to the system.</p>
        </div>
      ) : (
        <div className="leads-list">
          {leads.map((lead) => (
            <div key={lead.id} className="lead-card">
              <div className="lead-header">
                <h3>{lead.customerName}</h3>
                <span className={`status status-${lead.status}`}>{lead.status}</span>
              </div>
              <div className="lead-details">
                <p><strong>Email:</strong> {lead.email}</p>
                <p><strong>Phone:</strong> {lead.phone}</p>
                <p><strong>Address:</strong> {lead.address}</p>
                <p><strong>Postcode:</strong> {lead.postcode}</p>
                <p><strong>Property Type:</strong> {lead.propertyType}</p>
                <p><strong>Price:</strong> £{lead.price}</p>
                <p><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .leads-management {
          padding: 20px;
        }
        .header {
          margin-bottom: 20px;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .leads-list {
          display: grid;
          gap: 16px;
        }
        .lead-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          background: white;
        }
        .lead-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-new { background: #e3f2fd; color: #1976d2; }
        .status-contacted { background: #f3e5f5; color: #7b1fa2; }
        .status-completed { background: #e8f5e8; color: #388e3c; }
        .lead-details p {
          margin: 4px 0;
          font-size: 14px;
        }
        .loading-spinner, .error-message {
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  );
};

export default LeadsManagement;