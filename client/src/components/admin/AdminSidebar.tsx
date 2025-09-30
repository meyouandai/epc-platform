import React from 'react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  adminName: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  adminName
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'assessors', label: 'Assessors', icon: '👨‍💼' },
    { id: 'coverages', label: 'Coverages', icon: '🗺️' },
    { id: 'leads', label: 'Leads', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'create-account', label: 'Create Account', icon: '➕' },
    { id: 'profile', label: 'Profile', icon: '⚙️' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>EPC Admin</h2>
        <div className="admin-info">
          <span className="admin-name">{adminName}</span>
          <span className="admin-role">Administrator</span>
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

export default AdminSidebar;