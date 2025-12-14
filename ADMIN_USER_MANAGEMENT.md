# 👨‍💼 Admin User Management Guide

## Overview
The Admin User Management system allows administrators to create, edit, and delete application users with different role-based permissions.

## Features Implemented

### ✅ User Management Page (`/admin/users`)

#### 1. **View All Users**
- Card-based grid layout showing all system users
- Role badges with color coding
- User creation date display
- Current user highlighted with special badge

#### 2. **Role Statistics**
- Real-time count of users by role
- Visual stats cards for:
  - 👨‍💼 Admins
  - 📊 Managers
  - 🔧 Field Officers
  - 💰 Cashiers

#### 3. **Filter Users by Role**
- Quick filter buttons to view users by specific role
- Shows count for each role type
- "All" option to view everyone

#### 4. **Create New User**
- Username validation (min 3 characters)
- Password requirements (min 6 characters)
- Role selection with permission preview
- Clear role descriptions in dropdown

#### 5. **Edit Existing User**
- Update username
- Change role assignment
- Optional password update (leave blank to keep current)
- Cannot edit own account username/role

#### 6. **Delete User**
- Confirmation dialog before deletion
- Cannot delete your own account
- Permanently removes user from system

### 🎨 UI Features

#### User Cards Display:
```
┌─────────────────────────────────┐
│  🔧  username123                │
│      [Field Officer Badge]      │
├─────────────────────────────────┤
│  User ID: #5                    │
│  Created: 12/14/2025            │
├─────────────────────────────────┤
│  [✏️ Edit]  [🗑️ Delete]        │
└─────────────────────────────────┘
```

#### Role Permissions Preview:
When creating/editing users, the modal shows:
- ✅ What the role CAN do
- ❌ What the role CANNOT do

### 🔐 Security Features

#### Password Handling:
- **Creating New User**: Password required, hashed with bcrypt
- **Editing User**: Password optional (only update if provided)
- **Minimum Length**: 6 characters
- **Storage**: Never stored in plain text

#### Self-Protection:
- Admins cannot delete their own account
- Current user clearly marked in UI
- Confirmation required before deletion

### 📊 Role Definitions

#### Admin (👨‍💼)
**Permissions:**
- ✅ Full system access
- ✅ User management
- ✅ All CRUD operations
- ✅ System settings

**Access:**
- Dashboard: ✅
- Customers: ✅
- Meters: ✅
- Readings: ✅
- Bills: ✅
- Payments: ✅
- Admin Panel: ✅

---

#### Manager (📊)
**Permissions:**
- ✅ All operational features
- ✅ Customer & Meter management
- ✅ Bills & Payments
- ❌ No user management

**Access:**
- Dashboard: ✅
- Customers: ✅
- Meters: ✅
- Readings: ✅
- Bills: ✅
- Payments: ✅
- Admin Panel: ❌

---

#### Field Officer (🔧)
**Permissions:**
- ✅ Customer management
- ✅ Meter management
- ✅ Record readings
- ❌ No bill/payment access

**Access:**
- Dashboard: ✅
- Customers: ✅
- Meters: ✅
- Readings: ✅
- Bills: ❌
- Payments: ❌
- Admin Panel: ❌

---

#### Cashier (💰)
**Permissions:**
- ✅ View bills
- ✅ Process payments
- ❌ No customer/meter access
- ❌ No readings access

**Access:**
- Dashboard: ✅
- Customers: ❌
- Meters: ❌
- Readings: ❌
- Bills: ✅
- Payments: ✅
- Admin Panel: ❌

---

## 🚀 How to Use

### Creating a New User

1. **Navigate to User Management**
   - Login as Admin
   - Go to `/admin/users` or click "Manage Users" from admin dashboard

2. **Click "Add User" Button**
   - Located in top-right of page

3. **Fill in User Details**
   - **Username**: Enter unique username (min 3 chars)
   - **Password**: Enter secure password (min 6 chars)
   - **Role**: Select appropriate role from dropdown

4. **Review Role Permissions**
   - Modal shows what the selected role can/cannot do
   - Helps ensure correct role assignment

5. **Submit**
   - Click "Create User"
   - User is immediately available for login

### Editing a User

1. **Find the User**
   - Use role filter if needed
   - Locate user card

2. **Click "Edit" Button**
   - Opens edit modal

3. **Update Details**
   - Change username if needed
   - Change role if needed
   - **Password**: Leave blank to keep current, or enter new password

4. **Submit**
   - Click "Update User"
   - Changes take effect immediately

### Deleting a User

1. **Find the User**
   - Locate user card

2. **Click "Delete" Button**
   - Confirmation dialog appears

3. **Confirm Deletion**
   - Click "OK" to permanently delete
   - User cannot login after deletion

**Note**: You cannot delete your own account!

---

## 🎯 Best Practices

### Role Assignment Guidelines:

#### When to assign **Admin** role:
- IT staff who manage the system
- Senior management with full oversight
- System administrators

#### When to assign **Manager** role:
- Department heads
- Supervisors who need operational control
- Staff who handle all customer/billing operations

#### When to assign **Field Officer** role:
- Field staff who visit customer sites
- Meter readers
- Technical staff who manage installations

#### When to assign **Cashier** role:
- Counter staff at payment centers
- Billing clerks
- Payment processing staff

### Security Best Practices:

1. **Regular User Audits**
   - Review user list quarterly
   - Remove inactive users
   - Verify role assignments

2. **Strong Passwords**
   - Enforce 8+ character passwords
   - Include numbers and symbols
   - Change default passwords immediately

3. **Role-Based Principle**
   - Assign minimum necessary permissions
   - Don't make everyone an Admin
   - Use appropriate role for job function

4. **User Tracking**
   - Monitor creation dates
   - Track who creates which users (future feature)
   - Log user activities

---

## 🔧 Technical Details

### API Endpoints Used:

```javascript
GET    /api/users              // Get all users
POST   /api/users              // Create new user
PUT    /api/users/:id          // Update user
DELETE /api/users/:id          // Delete user
GET    /api/users/role/:role   // Get users by role
```

### Backend Validation:

- Username: Required, unique, min 3 characters
- Password: Required on create, min 6 characters, bcrypt hashed
- Role: Required, must be valid ENUM value
- Duplicate username check
- SQL injection prevention

### Frontend Validation:

- Form validation before submission
- Client-side length checks
- Confirmation dialogs
- Error message display
- Success notifications

---

## 📈 Admin Dashboard Features

### Overview Statistics:
- Total users count
- Users by role breakdown
- System health indicators
- Quick action cards

### Quick Actions:
- Link to User Management
- Link to all resource pages
- System reports (coming soon)
- Settings access (coming soon)

### System Health:
- ✅ Database connection status
- ✅ API services status
- ⚠️ Pending bills alert

---

## 💡 Tips & Tricks

1. **Filter Before Searching**
   - Use role filters to narrow down user list
   - Easier to find specific users

2. **Identify Current User**
   - Your account has a ⭐ badge
   - Cannot accidentally delete yourself

3. **Role Permissions Preview**
   - Always review permissions before assigning role
   - Visible in create/edit modal

4. **Password Updates**
   - When editing, leave password blank to keep current
   - Only change when necessary

5. **User Organization**
   - Use consistent naming convention
   - Example: `firstname.lastname` or `role.firstname`

---

## 🐛 Troubleshooting

### "Username already exists"
- Choose a different username
- Check if user already in system

### "Cannot delete user"
- You cannot delete your own account
- Login with different admin account

### "Password too short"
- Ensure password is at least 6 characters
- Add more characters or symbols

### User not appearing after creation
- Refresh the page
- Check role filters aren't hiding user

### Changes not saving
- Check internet connection
- Verify backend server is running
- Check browser console for errors

---

## 🎓 Example Use Cases

### Scenario 1: New Field Officer Hired
1. Admin logs in
2. Goes to `/admin/users`
3. Clicks "Add User"
4. Username: `john.doe`
5. Password: `SecurePass123`
6. Role: Field Officer
7. Submits → Officer can login and record readings

### Scenario 2: Promote Cashier to Manager
1. Admin finds cashier user card
2. Clicks "Edit"
3. Changes role from "Cashier" to "Manager"
4. Saves → User now has full operational access

### Scenario 3: Employee Leaves Company
1. Admin locates user card
2. Clicks "Delete"
3. Confirms deletion
4. User account removed, cannot login

---

## 📚 Related Documentation

- [AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md) - Full auth system docs
- [QUICKSTART.md](../QUICKSTART.md) - Quick testing guide
- [README.md](../README.md) - Project overview

---

**Last Updated**: December 14, 2025  
**Feature Status**: ✅ Fully Implemented & Tested
