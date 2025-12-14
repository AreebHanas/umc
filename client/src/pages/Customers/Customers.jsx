import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  clearError,
  clearSuccess
} from '../../redux/slices/customerSlice';
import { hasPermission } from '../../utils/permissions';
import './Customers.css';

function Customers() {
  const dispatch = useDispatch();
  const { customers = [], isLoading, error, success } = useSelector(state => state.customers);
  const { user } = useSelector(state => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentCustomer, setCurrentCustomer] = useState({
    FullName: '',
    Address: '',
    Phone: '',
    CustomerType: 'Household'
  });

  // Check permissions
  const canCreate = hasPermission(user?.Role, 'CREATE_CUSTOMERS');
  const canEdit = hasPermission(user?.Role, 'EDIT_CUSTOMERS');
  const canDelete = hasPermission(user?.Role, 'DELETE_CUSTOMERS');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowModal(false);
      setCurrentCustomer({ FullName: '', Address: '', Phone: '', CustomerType: 'Household' });
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
  }, [success, dispatch]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      dispatch(searchCustomers(term));
    } else if (term.length === 0) {
      dispatch(fetchCustomers());
    }
  };

  const handleCreate = () => {
    setEditMode(false);
    setCurrentCustomer({ FullName: '', Address: '', Phone: '', CustomerType: 'Household' });
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditMode(true);
    setCurrentCustomer(customer);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateCustomer({ id: currentCustomer.CustomerID, data: currentCustomer }));
    } else {
      dispatch(createCustomer(currentCustomer));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
    }
  };

  const filteredCustomers = filterType === 'All' 
    ? customers 
    : customers.filter(c => c.CustomerType === filterType);

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage household, business, and government customers</p>
        </div>
        {canCreate && (
          <button className="btn-primary" onClick={handleCreate}>
            <span>+</span> Add Customer
          </button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={filterType === 'All' ? 'active' : ''} 
            onClick={() => setFilterType('All')}
          >
            All ({customers.length})
          </button>
          <button 
            className={filterType === 'Household' ? 'active' : ''} 
            onClick={() => setFilterType('Household')}
          >
            Household ({customers.filter(c => c.CustomerType === 'Household').length})
          </button>
          <button 
            className={filterType === 'Business' ? 'active' : ''} 
            onClick={() => setFilterType('Business')}
          >
            Business ({customers.filter(c => c.CustomerType === 'Business').length})
          </button>
          <button 
            className={filterType === 'Government' ? 'active' : ''} 
            onClick={() => setFilterType('Government')}
          >
            Government ({customers.filter(c => c.CustomerType === 'Government').length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.CustomerID}>
                    <td>{customer.CustomerID}</td>
                    <td className="customer-name">{customer.FullName}</td>
                    <td>{customer.Address}</td>
                    <td>{customer.Phone}</td>
                    <td>
                      <span className={`badge badge-${customer.CustomerType.toLowerCase()}`}>
                        {customer.CustomerType}
                      </span>
                    </td>
                    <td>{new Date(customer.RegisteredDate).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {canEdit && (
                          <button className="btn-edit" onClick={() => handleEdit(customer)}>
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn-delete" onClick={() => handleDelete(customer.CustomerID)}>
                            Delete
                          </button>
                        )}
                        {!canEdit && !canDelete && (
                          <span className="no-actions">View Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={currentCustomer.FullName}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, FullName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  required
                  value={currentCustomer.Address}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, Address: e.target.value})}
                  placeholder="123 Main St, Colombo"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={currentCustomer.Phone}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, Phone: e.target.value})}
                  placeholder="0771234567"
                />
              </div>
              <div className="form-group">
                <label>Customer Type *</label>
                <select
                  required
                  value={currentCustomer.CustomerType}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, CustomerType: e.target.value})}
                >
                  <option value="Household">Household</option>
                  <option value="Business">Business</option>
                  <option value="Government">Government</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Update Customer' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
