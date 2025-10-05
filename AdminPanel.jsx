import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [newUser, setNewUser] = useState({ email: '', password: '', fullName: '', isAdmin: false });
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    // Mock users data
    const mockUsers = [
      { id: 1, email: 'admin@trading.com', fullName: 'Admin User', balance: 10000, isAdmin: true, joinDate: '2024-01-01', lastLogin: '2024-01-10 14:30:25', status: 'active' },
      { id: 2, email: 'john.trader@email.com', fullName: 'John Trader', balance: 7500, isAdmin: false, joinDate: '2024-01-05', lastLogin: '2024-01-10 09:15:33', status: 'active' },
      { id: 3, email: 'sarah.investor@email.com', fullName: 'Sarah Investor', balance: 12000, isAdmin: false, joinDate: '2024-01-08', lastLogin: '2024-01-09 16:45:12', status: 'active' },
      { id: 4, email: 'mike.daytrader@email.com', fullName: 'Mike Daytrader', balance: 8500, isAdmin: false, joinDate: '2024-01-03', lastLogin: '2024-01-08 11:20:47', status: 'inactive' },
      { id: 5, email: 'lisa.quant@email.com', fullName: 'Lisa Quant', balance: 15000, isAdmin: false, joinDate: '2024-01-06', lastLogin: '2024-01-10 13:05:18', status: 'active' }
    ];

    const mockPlatformStats = {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      totalVirtualMoney: mockUsers.reduce((total, user) => total + user.balance, 0),
      totalTrades: 156,
      averageBalance: Math.round(mockUsers.reduce((total, user) => total + user.balance, 0) / mockUsers.length),
      adminUsers: mockUsers.filter(u => u.isAdmin).length
    };

    setUsers(mockUsers);
    setPlatformStats(mockPlatformStats);
  }, []);

  const resetUserBalance = (userId) => {
    if (window.confirm('Reset this user\'s balance to $10,000?')) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, balance: 10000 } : u
      ));
    }
  };

  const deleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete user "${userToDelete.fullName}"? This action cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const addNewUser = () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      alert('Please fill in all fields');
      return;
    }

    const newUserObj = {
      id: Date.now(),
      email: newUser.email,
      fullName: newUser.fullName,
      balance: 10000,
      isAdmin: newUser.isAdmin,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString(),
      status: 'active'
    };

    setUsers([...users, newUserObj]);
    setNewUser({ email: '', password: '', fullName: '', isAdmin: false });
    setShowAddUser(false);
  };

  const promoteToAdmin = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isAdmin: true } : u
    ));
  };

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage users and platform settings</p>
      </div>

      {/* Platform Statistics */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-value">{platformStats.totalUsers}</div>
            <div className="stat-subtext">
              {platformStats.activeUsers} active
            </div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Virtual Money</h3>
            <div className="stat-value">
              ${platformStats.totalVirtualMoney?.toLocaleString()}
            </div>
            <div className="stat-subtext">
              Avg: ${platformStats.averageBalance}
            </div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>Admin Users</h3>
            <div className="stat-value">{platformStats.adminUsers}</div>
            <div className="stat-subtext">
              Platform administrators
            </div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Trades</h3>
            <div className="stat-value">{platformStats.totalTrades}</div>
            <div className="stat-subtext">
              All user trades
            </div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="add-user-form">
          <h3>Add New User</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="Set temporary password"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newUser.isAdmin}
                  onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                />
                Administrator Account
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button onClick={addNewUser} className="btn-primary">
              Create User
            </button>
            <button onClick={() => setShowAddUser(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <button 
            onClick={() => setShowAddUser(true)}
            className="btn-primary"
          >
            + Add New User
          </button>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Balance</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{user.fullName}</div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>${user.balance.toLocaleString()}</td>
                  <td>
                    <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="action-btn reset"
                        onClick={() => resetUserBalance(user.id)}
                        title="Reset Balance"
                      >
                        💰
                      </button>
                      
                      {!user.isAdmin && (
                        <button 
                          className="action-btn promote"
                          onClick={() => promoteToAdmin(user.id)}
                          title="Promote to Admin"
                        >
                          ⬆️
                        </button>
                      )}
                      
                      <button 
                        className={`action-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                        onClick={() => toggleUserStatus(user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      
                      {!user.isAdmin && (
                        <button 
                          className="action-btn delete"
                          onClick={() => deleteUser(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="platform-settings">
        <h2>Platform Settings</h2>
        <div className="settings-grid">
          <div className="setting-card">
            <h4>Default Balance</h4>
            <p>Set the default virtual balance for new users</p>
            <div className="setting-control">
              <input 
                type="number" 
                defaultValue="10000" 
                className="setting-input"
              />
              <button className="btn-secondary">Update</button>
            </div>
          </div>
          
          <div className="setting-card">
            <h4>Trading Limits</h4>
            <p>Maximum trade size per transaction</p>
            <div className="setting-control">
              <input 
                type="number" 
                defaultValue="5000" 
                className="setting-input"
              />
              <button className="btn-secondary">Update</button>
            </div>
          </div>
          
          <div className="setting-card">
            <h4>Auto Logout</h4>
            <p>Session timeout in minutes</p>
            <div className="setting-control">
              <input 
                type="number" 
                defaultValue="60" 
                className="setting-input"
              />
              <button className="btn-secondary">Update</button>
            </div>
          </div>
          
          <div className="setting-card">
            <h4>Market Hours</h4>
            <p>Enable/disable after-hours trading</p>
            <div className="setting-control">
              <select className="setting-select">
                <option value="24/7">24/7 Trading</option>
                <option value="market">Market Hours Only</option>
              </select>
              <button className="btn-secondary">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;