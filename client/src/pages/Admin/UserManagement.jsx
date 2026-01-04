import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../../services';
import './UserManagement.css';

function UserManagement() {
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [currentUserData, setCurrentUserData] = useState({
    Username: '',
    Password: '',
    Role: 'FieldOfficer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditMode(false);
    setCurrentUserData({
      Username: '',
      Password: '',
      Role: 'FieldOfficer'
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setCurrentUserData({
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role,
      Password: '' // Don't prefill password
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editMode) {
        // Update user (include password if provided)
        const updateData = {
          Username: currentUserData.Username,
          Role: currentUserData.Role
        };
        
        // Only include password if it's provided and meets minimum length
        if (currentUserData.Password && currentUserData.Password.length >= 6) {
          updateData.Password = currentUserData.Password;
        }
        
        await userService.updateUser(currentUserData.UserID, updateData);
        setSuccess('User updated successfully!');
      } else {
        // Create new user
        if (!currentUserData.Password || currentUserData.Password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        await userService.createUser({
          Username: currentUserData.Username,
          Password: currentUserData.Password,
          Role: currentUserData.Role
        });
        setSuccess('User created successfully!');
      }
      
      setShowModal(false);
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (userId === currentUser.UserID) {
      setError('You cannot delete your own account!');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        await userService.deleteUser(userId);
        setSuccess(`User "${username}" deleted successfully!`);
        fetchUsers();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      Admin: 'admin',
      Manager: 'manager',
      FieldOfficer: 'officer',
      Cashier: 'cashier'
    };
    return roleClasses[role] || 'default';
  };

  const getRoleIcon = (role) => {
    const icons = {
      Admin: 'A',
      Manager: 'M',
      FieldOfficer: 'F',
      Cashier: 'C'
    };
    return icons[role] || 'U';
  };

  const safeUsers = Array.isArray(users) ? users : [];

const normalize = (v) =>
  v?.toString().trim().toLowerCase().replace(/\s+/g, '');

const filteredUsers = filterRole === 'All'
  ? safeUsers
  : safeUsers.filter(
      u => normalize(u.Role) === normalize(filterRole)
    );



  const roleStats = {
  Admin: safeUsers.filter(u => normalize(u.Role) === 'admin').length,
  Manager: safeUsers.filter(u => normalize(u.Role) === 'manager').length,
  FieldOfficer: safeUsers.filter(u => normalize(u.Role) === 'fieldofficer').length,
  Cashier: safeUsers.filter(u => normalize(u.Role) === 'cashier').length
};


  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Create and manage application users</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          <span>+</span> Add User
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="role-stats">
        <div className="stat-card stat-admin">
          <div className="stat-icon">A</div>
          <div className="stat-info">
            <h3>{roleStats.Admin}</h3>
            <p>Admins</p>
          </div>
        </div>
        <div className="stat-card stat-manager">
          <div className="stat-icon">M</div>
          <div className="stat-info">
            <h3>{roleStats.Manager}</h3>
            <p>Managers</p>
          </div>
        </div>
        <div className="stat-card stat-officer">
          <div className="stat-icon">F</div>
          <div className="stat-info">
            <h3>{roleStats.FieldOfficer}</h3>
            <p>Field Officers</p>
          </div>
        </div>
        <div className="stat-card stat-cashier">
          <div className="stat-icon">C</div>
          <div className="stat-info">
            <h3>{roleStats.Cashier}</h3>
            <p>Cashiers</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <div className="filter-buttons">
            <button 
              className={filterRole === 'All' ? 'active' : ''}
              onClick={() => setFilterRole('All')}
            >
              All ({users.length})
            </button>
            <button 
              className={filterRole === 'Admin' ? 'active' : ''}
              onClick={() => setFilterRole('Admin')}
            >
              Admin ({roleStats.Admin})
            </button>
            <button 
              className={filterRole === 'Manager' ? 'active' : ''}
              onClick={() => setFilterRole('Manager')}
            >
              Manager ({roleStats.Manager})
            </button>
            <button 
              className={filterRole === 'FieldOfficer' ? 'active' : ''}
              onClick={() => setFilterRole('FieldOfficer')}
            >
              Officer ({roleStats.FieldOfficer})
            </button>
            <button 
              className={filterRole === 'Cashier' ? 'active' : ''}
              onClick={() => setFilterRole('Cashier')}
            >
              Cashier ({roleStats.Cashier})
            </button>
          </div>
        </div>
      </div>

      {isLoading && !showModal ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-data">No users found</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.UserID} className={`user-card ${user.UserID === currentUser.UserID ? 'current-user' : ''}`}>
                <div className="user-card-header">
                  <div className="user-avatar">
                    {getRoleIcon(user.Role)}
                  </div>
                  <div className="user-info">
                    <h3>{user.Username}</h3>
                    <span className={`role-badge ${getRoleBadgeClass(user.Role)}`}>
                      {user.Role}
                    </span>
                  </div>
                </div>
                <div className="user-card-body">
                  <div className="info-row">
                    <span>User ID:</span>
                    <strong>#{user.UserID}</strong>
                  </div>
                  <div className="info-row">
                    <span>Created:</span>
                    <strong>{new Date(user.CreatedAt).toLocaleDateString()}</strong>
                  </div>
                  {user.UserID === currentUser.UserID && (
                    <div className="current-user-badge">
                      Current User
                    </div>
                  )}
                </div>
                <div className="user-card-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(user.UserID, user.Username)}
                    disabled={user.UserID === currentUser.UserID}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  required
                  minLength="3"
                  value={currentUserData.Username}
                  onChange={(e) => setCurrentUserData({...currentUserData, Username: e.target.value})}
                  placeholder="Enter username"
                />
                <small>Minimum 3 characters</small>
              </div>

              {!editMode && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required={!editMode}
                    minLength="6"
                    value={currentUserData.Password}
                    onChange={(e) => setCurrentUserData({...currentUserData, Password: e.target.value})}
                    placeholder="Enter password"
                  />
                  <small>Minimum 6 characters</small>
                </div>
              )}

              {editMode && (
                <div className="form-group">
                  <label>New Password (optional)</label>
                  <input
                    type="password"
                    minLength="6"
                    value={currentUserData.Password}
                    onChange={(e) => setCurrentUserData({...currentUserData, Password: e.target.value})}
                    placeholder="Leave blank to keep current password"
                  />
                  <small>Leave blank to keep current password</small>
                </div>
              )}

              <div className="form-group">
                <label>Role *</label>
                <select
                  required
                  value={currentUserData.Role}
                  onChange={(e) => setCurrentUserData({...currentUserData, Role: e.target.value})}
                >
                  <option value="Admin">Admin - Full System Access</option>
                  <option value="Manager">Manager - All Operations</option>
                  <option value="FieldOfficer">Field Officer - Meters & Readings</option>
                  <option value="Cashier">Cashier - Bills & Payments</option>
                </select>
                <small>Select appropriate role for user permissions</small>
              </div>

              <div className="role-permissions">
                <h4>Role Permissions:</h4>
                {currentUserData.Role === 'Admin' && (
                  <ul>
                    <li>✓ Full system access</li>
                    <li>✓ User management</li>
                    <li>✓ All CRUD operations</li>
                    <li>✓ System settings</li>
                  </ul>
                )}
                {currentUserData.Role === 'Manager' && (
                  <ul>
                    <li>✓ All operational features</li>
                    <li>✓ Customer & Meter management</li>
                    <li>✓ Bills & Payments</li>
                    <li>✗ No user management</li>
                  </ul>
                )}
                {currentUserData.Role === 'FieldOfficer' && (
                  <ul>
                    <li>✓ Customer management</li>
                    <li>✓ Meter management</li>
                    <li>✓ Record readings</li>
                    <li>✗ No bill/payment access</li>
                  </ul>
                )}
                {currentUserData.Role === 'Cashier' && (
                  <ul>
                    <li>✓ View bills</li>
                    <li>✓ Process payments</li>
                    <li>✗ No customer/meter access</li>
                    <li>✗ No readings access</li>
                  </ul>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editMode ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
