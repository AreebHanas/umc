import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  clearSuccess
} from '../../redux/slices/customerSlice';
import { hasPermission } from '../../utils/permissions';
import './Customers.css';

function Customers() {
  const dispatch = useDispatch();

  const { customers = [], isLoading, error, success } =
    useSelector(state => state.customers);

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

  const canCreate = hasPermission(user?.Role, 'CREATE_CUSTOMERS');
  const canEdit = hasPermission(user?.Role, 'EDIT_CUSTOMERS');
  const canDelete = hasPermission(user?.Role, 'DELETE_CUSTOMERS');

  useEffect(() => {
    console.log('Permission debug - user:', user);
    console.log('Permission debug - Role:', user?.Role);
    console.log('Permission debug - canCreate, canEdit, canDelete:', canCreate, canEdit, canDelete);
  }, [user, canCreate, canEdit, canDelete]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  
  useEffect(() => {
    if (success) {
      setShowModal(false);
      setCurrentCustomer({
        FullName: '',
        Address: '',
        Phone: '',
        CustomerType: 'Household'
      });
      setTimeout(() => dispatch(clearSuccess()), 2000);
    }
  }, [success, dispatch]);

  
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesType =
        filterType === 'All' || c.CustomerType === filterType;

      const matchesSearch =
        c.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Phone?.includes(searchTerm);

      return matchesType && matchesSearch;
    });
  }, [customers, searchTerm, filterType]);

  const handleCreate = () => {
    setEditMode(false);
    setCurrentCustomer({
      FullName: '',
      Address: '',
      Phone: '',
      CustomerType: 'Household'
    });
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
      dispatch(
        updateCustomer({
          id: currentCustomer.CustomerID,
          data: currentCustomer
        })
      );
    } else {
      dispatch(createCustomer(currentCustomer));
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await dispatch(deleteCustomer(id)).unwrap();
      dispatch(fetchCustomers()); 
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // `filteredCustomers` is computed via useMemo above; do not reassign it here.

  const location = useLocation();
  const prefix = location.pathname.startsWith('/admin') ? '/admin' : '';

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage customers</p>
        </div>
        {canCreate && (
          <button className="btn-create" onClick={handleCreate}>
            + Add Customer
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

     
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons">
          {['All', 'Household', 'Business', 'Government'].map(type => (
            <button
              key={type}
              className={`btn-filter ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

     
      {isLoading ? (
        <p>Loading customers...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
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
                <td colSpan="7">No customers found</td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.CustomerID}>
                  <td>C-{String(customer.CustomerID).padStart(4, '0')}</td>
                  <td className="customer-name">{customer.FullName}</td>
                  <td>{customer.Address}</td>
                  <td>{customer.Phone}</td>
                  <td>{customer.CustomerType}</td>
                  <td>{customer.RegisteredDate ? new Date(customer.RegisteredDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`${prefix}/customers/${customer.CustomerID}`} className="btn-view">View</Link>
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
      )}

     
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Customer' : 'Add Customer'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  required
                  placeholder="Enter full name"
                  minLength={3}
                  maxLength={100}
                  value={currentCustomer.FullName}
                  onChange={e =>
                    setCurrentCustomer({ ...currentCustomer, FullName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  required
                  placeholder="Enter full address"
                  minLength={10}
                  maxLength={255}
                  value={currentCustomer.Address}
                  onChange={e =>
                    setCurrentCustomer({ ...currentCustomer, Address: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="0771234567"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  maxLength={15}
                  value={currentCustomer.Phone}
                  onChange={e =>
                    setCurrentCustomer({ ...currentCustomer, Phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Customer Type *</label>
                <select
                  required
                  value={currentCustomer.CustomerType}
                  onChange={e =>
                    setCurrentCustomer({ ...currentCustomer, CustomerType: e.target.value })
                  }
                >
                  <option>Household</option>
                  <option>Business</option>
                  <option>Government</option>
                </select>
              </div>

              <div className="btn-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-create">
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
