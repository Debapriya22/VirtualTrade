import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trade', label: 'Trade', icon: '💹' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  if (user.isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Virtual Trading</h2>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="nav-user">
        <span className="user-name">{user.fullName}</span>
        <span className="user-balance">${user.balance.toLocaleString()}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navigation;