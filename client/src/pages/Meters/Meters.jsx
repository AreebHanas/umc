import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMeters,
  fetchMetersByCustomerId,
  createMeter,
  updateMeter,
  deleteMeter
} from '../../redux/slices/meterSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import './Meters.css';

function Meters() {
  const dispatch = useDispatch();
  const { meters, isLoading, error, success } = useSelector(state => state.meters);
  const { customers = [] } = useSelector(state => state.customers);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentMeter, setCurrentMeter] = useState({
    SerialNumber: '',
    CustomerID: '',
    UtilityTypeID: 1,
    InstallationDate: new Date().toISOString().split('T')[0],
    Status: 'Active'
  });

  const utilityTypes = [
    { id: 1, name: 'Electricity', icon: 'E' },
    { id: 2, name: 'Water', icon: 'W' },
    { id: 3, name: 'Gas', icon: 'G' }
  ];

  useEffect(() => {
    dispatch(fetchMeters());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowModal(false);
      setCurrentMeter({
        SerialNumber: '',
        CustomerID: '',
        UtilityTypeID: 1,
        InstallationDate: new Date().toISOString().split('T')[0],
        Status: 'Active'
      });
    }
  }, [success]);

  const handleCreate = () => {
    setEditMode(false);
    setCurrentMeter({
      SerialNumber: '',
      CustomerID: '',
      UtilityTypeID: 1,
      InstallationDate: new Date().toISOString().split('T')[0],
      Status: 'Active'
    });
    setShowModal(true);
  };

  const handleEdit = (meter) => {
    setEditMode(true);
    setCurrentMeter({
      ...meter,
      InstallationDate: meter.InstallationDate?.split('T')[0]
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateMeter({ id: currentMeter.MeterID, data: currentMeter }));
    } else {
      dispatch(createMeter(currentMeter));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this meter?')) {
      dispatch(deleteMeter(id));
    }
  };

  const filteredMeters = meters.filter(meter => {
    const matchCustomer = filterCustomer === 'All' || meter.CustomerID === parseInt(filterCustomer);
    const matchStatus = filterStatus === 'All' || meter.Status === filterStatus;
    return matchCustomer && matchStatus;
  });

  const getUtilityIcon = (typeId) => {
    const utility = utilityTypes.find(u => u.id === typeId);
    return utility ? utility.icon : 'M';
  };

  const getUtilityName = (typeId) => {
    const utility = utilityTypes.find(u => u.id === typeId);
    return utility ? utility.name : 'Unknown';
  };

  return (
    <div className="meters-page">
      <div className="page-header">
        <div>
          <h1>Meter Management</h1>
          <p>Track and manage utility meters</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          <span>+</span> Install Meter
        </button>
      </div>

      {success && <div className="alert alert-success">Operation successful</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">Total</div>
          <div className="stat-info">
            <h3>{meters.length}</h3>
            <p>Total Meters</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Active</div>
          <div className="stat-info">
            <h3>{meters.filter(m => m.Status === 'Active').length}</h3>
            <p>Active Meters</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Inactive</div>
          <div className="stat-info">
            <h3>{meters.filter(m => m.Status === 'Suspended').length}</h3>
            <p>Suspended</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Customer:</label>
          <select value={filterCustomer} onChange={(e) => setFilterCustomer(e.target.value)}>
            <option value="All">All Customers</option>
            {customers && customers.length > 0 && customers.map(customer => (
              <option key={customer.CustomerID} value={customer.CustomerID}>
                {customer.FullName}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading meters...</div>
      ) : (
        <div className="meters-grid">
          {filteredMeters.length === 0 ? (
            <div className="no-data">No meters found</div>
          ) : (
            filteredMeters.map(meter => (
              <div key={meter.MeterID} className="meter-card">
                <div className="meter-header">
                  <div className="meter-icon">
                    {getUtilityIcon(meter.UtilityTypeID)}
                  </div>
                  <span className={`status-badge ${meter.Status.toLowerCase()}`}>
                    {meter.Status}
                  </span>
                </div>
                <div className="meter-body">
                  <h3>{meter.SerialNumber}</h3>
                  <div className="meter-info">
                    <div className="info-row">
                      <span className="label">Utility:</span>
                      <span className="value">{getUtilityName(meter.UtilityTypeID)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Customer:</span>
                      <span className="value">{meter.FullName || 'Unknown'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Serial Number:</span>
                      <span className="value">{meter.SerialNumber || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Installed:</span>
                      <span className="value">
                        {meter.InstallationDate ? new Date(meter.InstallationDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="meter-actions">
                  <button className="btn-edit" onClick={() => handleEdit(meter)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(meter.MeterID)}>
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
              <h2>{editMode ? 'Edit Meter' : 'Install New Meter'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Serial Number *</label>
                <input
                  type="text"
                  required
                  value={currentMeter.SerialNumber}
                  onChange={(e) => setCurrentMeter({...currentMeter, SerialNumber: e.target.value})}
                  placeholder="ELEC-001"
                />
              </div>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  required
                  value={currentMeter.CustomerID}
                  onChange={(e) => setCurrentMeter({...currentMeter, CustomerID: e.target.value})}
                >
                  <option value="">Select Customer</option>
                  {customers && customers.length > 0 && customers.map(customer => (
                    <option key={customer.CustomerID} value={customer.CustomerID}>
                      {customer.FullName} - {customer.CustomerType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Utility Type *</label>
                <select
                  required
                  value={currentMeter.UtilityTypeID}
                  onChange={(e) => setCurrentMeter({...currentMeter, UtilityTypeID: parseInt(e.target.value)})}
                >
                  {utilityTypes.map(utility => (
                    <option key={utility.id} value={utility.id}>
                      {utility.icon} {utility.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Installation Date *</label>
                <input
                  type="date"
                  required
                  value={currentMeter.InstallationDate}
                  onChange={(e) => setCurrentMeter({...currentMeter, InstallationDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={currentMeter.Status}
                  onChange={(e) => setCurrentMeter({...currentMeter, Status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Update Meter' : 'Install Meter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meters;
