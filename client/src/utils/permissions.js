// Role-based permission utilities

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  FIELD_OFFICER: 'FieldOfficer',
  CASHIER: 'Cashier'
};

export const PERMISSIONS = {
  // Customer permissions
  // Admin & Manager: Full CRUD
  // Cashier: View only (for reports)
  // Field Officer: No access
  VIEW_CUSTOMERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  CREATE_CUSTOMERS: [ROLES.ADMIN, ROLES.MANAGER],
  EDIT_CUSTOMERS: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_CUSTOMERS: [ROLES.ADMIN, ROLES.MANAGER],

  // Meter permissions
  // Admin & Manager: Full CRUD
  // Field Officer: Full CRUD (install and manage meters)
  // Cashier: No access
  VIEW_METERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
  CREATE_METERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
  EDIT_METERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
  DELETE_METERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],

  // Reading permissions
  // Admin & Manager: Full CRUD
  // Field Officer: Create only (record readings)
  // Cashier: No access
  VIEW_READINGS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
  CREATE_READINGS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_OFFICER],
  EDIT_READINGS: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_READINGS: [ROLES.ADMIN, ROLES.MANAGER],

  // Bill permissions
  // Admin & Manager: Full access
  // Cashier: View only
  // Field Officer: No access
  VIEW_BILLS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  EDIT_BILLS: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_BILLS: [ROLES.ADMIN, ROLES.MANAGER],
  MARK_OVERDUE: [ROLES.ADMIN, ROLES.MANAGER],

  // Payment permissions
  // Admin & Manager: Full access
  // Cashier: Create payments (pay bills)
  // Field Officer: No access
  VIEW_PAYMENTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  CREATE_PAYMENTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  DELETE_PAYMENTS: [ROLES.ADMIN, ROLES.MANAGER],

  // Report permissions
  // Admin & Manager: All reports
  // Cashier: Can generate customer reports
  GENERATE_REPORTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],

  // Admin permissions
  // Only Admin can manage users
  MANAGE_USERS: [ROLES.ADMIN],
  VIEW_USERS: [ROLES.ADMIN],
  SYSTEM_SETTINGS: [ROLES.ADMIN]
};

/**
 * Check if user has permission for an action
 * @param {string} userRole - Current user's role
 * @param {string} permission - Permission key from PERMISSIONS
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  // Accept either a role string or a user object containing a `Role` property
  let role = userRole;
  if (role && typeof role === 'object' && role.Role) {
    role = role.Role;
  }

  if (typeof role !== 'string') return false;

  const normalize = (s) => s.replace(/\s+/g, '').toLowerCase();
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;

  return allowedRoles.some(ar => normalize(ar) === normalize(role));
};

/**
 * Check if user can perform CRUD operation
 * @param {string} userRole - Current user's role
 * @param {string} resource - Resource name (CUSTOMERS, METERS, etc.)
 * @param {string} operation - Operation (VIEW, CREATE, EDIT, DELETE)
 * @returns {boolean} - True if user has permission
 */
export const canPerformOperation = (userRole, resource, operation) => {
  const permissionKey = `${operation}_${resource}`;
  return hasPermission(userRole, permissionKey);
};

/**
 * Get available operations for a user on a resource
 * @param {string} userRole - Current user's role
 * @param {string} resource - Resource name
 * @returns {Array<string>} - Array of available operations
 */
export const getAvailableOperations = (userRole, resource) => {
  const operations = ['VIEW', 'CREATE', 'EDIT', 'DELETE'];
  return operations.filter(op => 
    canPerformOperation(userRole, resource, op)
  );
};

/**
 * Check if user is admin
 * @param {string} userRole - Current user's role
 * @returns {boolean} - True if admin
 */
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;

/**
 * Check if user is manager
 * @param {string} userRole - Current user's role
 * @returns {boolean} - True if manager
 */
export const isManager = (userRole) => userRole === ROLES.MANAGER;

/**
 * Check if user is field officer
 * @param {string} userRole - Current user's role
 * @returns {boolean} - True if field officer
 */
export const isFieldOfficer = (userRole) => userRole === ROLES.FIELD_OFFICER;

/**
 * Check if user is cashier
 * @param {string} userRole - Current user's role
 * @returns {boolean} - True if cashier
 */
export const isCashier = (userRole) => userRole === ROLES.CASHIER;

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  canPerformOperation,
  getAvailableOperations,
  isAdmin,
  isManager,
  isFieldOfficer,
  isCashier
};
