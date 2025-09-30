import React from 'react';

interface AssessorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  assessorName: string;
  trustLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const AssessorSidebar: React.FC<AssessorSidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  assessorName,
  trustLevel = 'bronze'
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'My Leads', icon: '📋' },
    { id: 'postcodes', label: 'Post Codes', icon: '🗺️' },
    { id: 'billing', label: 'Billing', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>EPC Dashboard</h2>
        <div className="admin-info">
          <span className="admin-name">{assessorName}</span>
          <span className="admin-role">Assessor</span>
          <span className={`trust-badge ${trustLevel}`}>
            {trustLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AssessorSidebar;