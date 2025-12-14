import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReadings,
  createReading,
  fetchLastReading
} from '../../redux/slices/readingSlice';
import { fetchMeters } from '../../redux/slices/meterSlice';
import './Readings.css';

function Readings() {
  const dispatch = useDispatch();
  const { readings = [], isLoading, error, success, billGenerated } = useSelector(state => state.readings);
  const { meters = [] } = useSelector(state => state.meters);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState('');
  const [lastReading, setLastReading] = useState(null);
  const [currentReading, setCurrentReading] = useState({
    MeterID: '',
    ReadingDate: new Date().toISOString().split('T')[0],
    PreviousReading: 0,
    CurrentReading: 0,
    ReadingTakenBy: 1 // TODO: Get from auth context
  });

  useEffect(() => {
    dispatch(fetchReadings());
    dispatch(fetchMeters());
  }, [dispatch]);

  useEffect(() => {
    if (success && billGenerated) {
      setShowModal(false);
      setSelectedMeter('');
      setLastReading(null);
      setCurrentReading({
        MeterID: '',
        ReadingDate: new Date().toISOString().split('T')[0],
        PreviousReading: 0,
        CurrentReading: 0,
        ReadingTakenBy: 1
      });
      // Re-fetch all readings to get complete data with joins
      dispatch(fetchReadings());
      alert('Reading recorded and bill generated automatically!');
    }
  }, [success, billGenerated, dispatch]);

  const handleMeterSelect = async (meterId) => {
    setSelectedMeter(meterId);
    
    // Fetch last reading for this meter
    try {
      const result = await dispatch(fetchLastReading(meterId)).unwrap();
      if (result.data || result) {
        const lastReadingData = result.data || result;
        setLastReading(lastReadingData);
        setCurrentReading(prev => ({
          ...prev,
          MeterID: meterId,
          PreviousReading: lastReadingData.CurrentReading
        }));
      } else {
        setLastReading(null);
        setCurrentReading(prev => ({
          ...prev,
          MeterID: meterId,
          PreviousReading: 0
        }));
      }
    } catch (err) {
      setLastReading(null);
      setCurrentReading(prev => ({
        ...prev,
        MeterID: meterId,
        PreviousReading: 0
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(currentReading.CurrentReading) < parseFloat(currentReading.PreviousReading)) {
      alert('Current reading must be greater than or equal to previous reading!');
      return;
    }
    dispatch(createReading(currentReading));
  };

  const getUnitsConsumed = () => {
    return (parseFloat(currentReading.CurrentReading) - parseFloat(currentReading.PreviousReading)).toFixed(2);
  };

  const getMeterInfo = (meterId) => {
    return meters.find(m => m.MeterID === meterId);
  };

  return (
    <div className="readings-page">
      <div className="page-header">
        <div>
          <h1>Meter Readings</h1>
          <p>Record meter readings and auto-generate bills</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>+</span> Record Reading
        </button>
      </div>

      {success && billGenerated && (
        <div className="alert alert-success">
          Reading recorded successfully! Bill has been auto-generated.
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">Total</div>
          <div className="stat-info">
            <h3>{readings.length}</h3>
            <p>Total Readings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Today</div>
          <div className="stat-info">
            <h3>
              {readings.filter(r => {
                const date = new Date(r.ReadingDate);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Avg</div>
          <div className="stat-info">
            <h3>
              {readings.reduce((sum, r) => sum + (r.CurrentReading - r.PreviousReading), 0).toFixed(0)}
            </h3>
            <p>Total Units</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading readings...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Meter</th>
                <th>Date</th>
                <th>Previous Reading</th>
                <th>Current Reading</th>
                <th>Units Consumed</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {readings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No readings found</td>
                </tr>
              ) : (
                readings.slice().reverse().map(reading => {
                  const meterInfo = getMeterInfo(reading.MeterID);
                  return (
                    <tr key={reading.ReadingID}>
                      <td>{reading.ReadingID}</td>
                      <td>
                        <div className="meter-info-cell">
                          <strong>{meterInfo?.SerialNumber || 'Unknown'}</strong>
                          <small>{meterInfo?.CustomerName || ''}</small>
                        </div>
                      </td>
                      <td>{new Date(reading.ReadingDate).toLocaleDateString()}</td>
                      <td className="reading-value">{reading.PreviousReading}</td>
                      <td className="reading-value">{reading.CurrentReading}</td>
                      <td className="units-consumed">
                        {(reading.CurrentReading - reading.PreviousReading).toFixed(2)}
                      </td>
                      <td>User #{reading.ReadingTakenBy}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Meter Reading</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Meter *</label>
                <select
                  required
                  value={selectedMeter}
                  onChange={(e) => handleMeterSelect(e.target.value)}
                >
                  <option value="">Choose a meter...</option>
                  {meters.filter(m => m.Status === 'Active').map(meter => (
                    <option key={meter.MeterID} value={meter.MeterID}>
                      {meter.SerialNumber} - {meter.CustomerName} ({meter.TypeName})
                    </option>
                  ))}
                </select>
              </div>

              {lastReading && (
                <div className="info-box">
                  <h4>Last Reading Information</h4>
                  <div className="info-grid">
                    <div>
                      <span>Date:</span>
                      <strong>{new Date(lastReading.ReadingDate).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span>Reading:</span>
                      <strong>{lastReading.CurrentReading}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Reading Date *</label>
                <input
                  type="date"
                  required
                  value={currentReading.ReadingDate}
                  onChange={(e) => setCurrentReading({...currentReading, ReadingDate: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Previous Reading *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={currentReading.PreviousReading}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Current Reading *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={currentReading.CurrentReading}
                  onChange={(e) => setCurrentReading({...currentReading, CurrentReading: e.target.value})}
                  placeholder="Enter current meter reading"
                />
              </div>

              {currentReading.CurrentReading > 0 && (
                <div className="consumption-display">
                  <div className="consumption-label">Units to be Consumed:</div>
                  <div className="consumption-value">{getUnitsConsumed()}</div>
                  <small>Bill will be auto-generated after recording</small>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Record Reading & Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Readings;
