/**
 * Utility functions for formatting data consistently across the application
 */

/**
 * Format customer ID with prefix and padding
 * @param {number} id - Customer ID
 * @returns {string} - Formatted ID (e.g., 'C-0001')
 */
export const formatCustomerID = (id) => {
  if (!id) return 'N/A';
  return `C-${String(id).padStart(4, '0')}`;
};

/**
 * Format bill ID with prefix and padding
 * @param {number} id - Bill ID
 * @returns {string} - Formatted ID (e.g., 'B-0001')
 */
export const formatBillID = (id) => {
  if (!id) return 'N/A';
  return `B-${String(id).padStart(4, '0')}`;
};

/**
 * Format payment ID with prefix and padding
 * @param {number} id - Payment ID
 * @returns {string} - Formatted ID (e.g., 'P-0001')
 */
export const formatPaymentID = (id) => {
  if (!id) return 'N/A';
  return `P-${String(id).padStart(4, '0')}`;
};

/**
 * Format reading ID with prefix and padding
 * @param {number} id - Reading ID
 * @returns {string} - Formatted ID (e.g., 'R-0001')
 */
export const formatReadingID = (id) => {
  if (!id) return 'N/A';
  return `R-${String(id).padStart(4, '0')}`;
};

/**
 * Format meter ID with prefix and padding
 * @param {number} id - Meter ID
 * @returns {string} - Formatted ID (e.g., 'M-0001')
 */
export const formatMeterID = (id) => {
  if (!id) return 'N/A';
  return `M-${String(id).padStart(4, '0')}`;
};

/**
 * Format user ID with prefix and padding
 * @param {number} id - User ID
 * @returns {string} - Formatted ID (e.g., 'U-0001')
 */
export const formatUserID = (id) => {
  if (!id) return 'N/A';
  return `U-${String(id).padStart(4, '0')}`;
};

/**
 * Format currency with LKR symbol
 * @param {number} amount - Amount
 * @returns {string} - Formatted currency (e.g., 'LKR 1,234.56')
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'LKR 0.00';
  return `LKR ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date to local date string
 * @param {string|Date} date - Date
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format datetime to local datetime string
 * @param {string|Date} datetime - Datetime
 * @returns {string} - Formatted datetime
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return 'N/A';
  try {
    return new Date(datetime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Get status badge class
 * @param {string} status - Status value
 * @returns {string} - CSS class name
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'Active': 'status-active',
    'Inactive': 'status-inactive',
    'Suspended': 'status-suspended',
    'Paid': 'status-paid',
    'Unpaid': 'status-unpaid',
    'Overdue': 'status-overdue',
    'Pending': 'status-pending',
    'Completed': 'status-completed',
    'Cancelled': 'status-cancelled'
  };
  
  return statusMap[status] || 'status-default';
};

export default {
  formatCustomerID,
  formatBillID,
  formatPaymentID,
  formatReadingID,
  formatMeterID,
  formatUserID,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  truncateText,
  getStatusBadgeClass
};
