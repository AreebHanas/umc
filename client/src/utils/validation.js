/**
 * Validation utility functions for form inputs
 */

/**
 * Validate phone number (Sri Lankan format)
 * @param {string} phone - Phone number
 * @returns {{valid: boolean, message: string}}
 */
export const validatePhone = (phone) => {
  if (!phone) return { valid: true, message: '' }; // Optional field
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    return { valid: false, message: 'Phone number must be 10 digits' };
  }
  
  if (!cleaned.startsWith('0')) {
    return { valid: false, message: 'Phone number must start with 0' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {{valid: boolean, message: string}}
 */
export const validateEmail = (email) => {
  if (!email) return { valid: true, message: '' }; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate required field
 * @param {any} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, message: `${fieldName} cannot be empty` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate minimum length
 * @param {string} value - Field value
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate maximum length
 * @param {string} value - Field value
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return { valid: false, message: `${fieldName} must be at most ${maxLength} characters` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate number range
 * @param {number} value - Number value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validateRange = (value, min, max, fieldName = 'This field') => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (num < min || num > max) {
    return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate positive number
 * @param {number} value - Number value
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validatePositiveNumber = (value, fieldName = 'This field') => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (num <= 0) {
    return { valid: false, message: `${fieldName} must be greater than zero` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate date not in the future
 * @param {string|Date} date - Date value
 * @param {string} fieldName - Field name for error message
 * @returns {{valid: boolean, message: string}}
 */
export const validatePastDate = (date, fieldName = 'Date') => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  if (inputDate > today) {
    return { valid: false, message: `${fieldName} cannot be in the future` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate serial number format
 * @param {string} serialNumber - Serial number
 * @returns {{valid: boolean, message: string}}
 */
export const validateSerialNumber = (serialNumber) => {
  if (!serialNumber) {
    return { valid: false, message: 'Serial number is required' };
  }
  
  // Allow alphanumeric and hyphens
  const serialRegex = /^[A-Z0-9-]+$/i;
  
  if (!serialRegex.test(serialNumber)) {
    return { valid: false, message: 'Serial number can only contain letters, numbers, and hyphens' };
  }
  
  if (serialNumber.length < 3 || serialNumber.length > 50) {
    return { valid: false, message: 'Serial number must be between 3 and 50 characters' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate meter reading (current >= previous)
 * @param {number} current - Current reading
 * @param {number} previous - Previous reading
 * @returns {{valid: boolean, message: string}}
 */
export const validateMeterReading = (current, previous) => {
  const currentNum = Number(current);
  const previousNum = Number(previous);
  
  if (isNaN(currentNum) || isNaN(previousNum)) {
    return { valid: false, message: 'Reading values must be valid numbers' };
  }
  
  if (currentNum < previousNum) {
    return { valid: false, message: 'Current reading cannot be less than previous reading' };
  }
  
  // Check for unrealistic jump (more than 10000 units)
  if (currentNum - previousNum > 10000) {
    return { 
      valid: false, 
      message: 'Reading increase seems unusually high. Please verify the current reading.' 
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate username
 * @param {string} username - Username
 * @returns {{valid: boolean, message: string}}
 */
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 50) {
    return { valid: false, message: 'Username must be at most 50 characters' };
  }
  
  // Allow alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate password
 * @param {string} password - Password
 * @returns {{valid: boolean, message: string}}
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (password.length > 100) {
    return { valid: false, message: 'Password must be at most 100 characters' };
  }
  
  return { valid: true, message: '' };
};

export default {
  validatePhone,
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  validatePositiveNumber,
  validatePastDate,
  validateSerialNumber,
  validateMeterReading,
  validateUsername,
  validatePassword
};
