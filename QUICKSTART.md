# 🚀 Quick Start Guide - Authentication & Roles

## Test the Authentication System

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 2. Access the Application
Open browser: `http://localhost:5173`

### 3. Try Demo Logins

Click on any demo button or use these credentials:

#### 👨‍💼 Admin (Full Access)
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Everything including Admin Panel

**What you can do:**
- ✅ View Dashboard
- ✅ Manage Customers (Create, Edit, Delete)
- ✅ Manage Meters (Create, Edit, Delete)
- ✅ Record Readings
- ✅ View & Manage Bills
- ✅ Process Payments
- ✅ Access Admin Panel (/admin)
- ✅ Manage System Settings

---

#### 📊 Manager (Operational Access)
- **Username**: `manager1`
- **Password**: `manager123`
- **Access**: All operations except Admin Panel

**What you can do:**
- ✅ View Dashboard
- ✅ Manage Customers
- ✅ Manage Meters
- ✅ Record Readings
- ✅ View & Manage Bills
- ✅ Process Payments
- ❌ No Admin Panel access

---

#### 🔧 Field Officer (Field Operations)
- **Username**: `officer1`
- **Password**: `officer123`
- **Access**: Customer & Meter management, Readings

**What you can do:**
- ✅ View Dashboard
- ✅ Manage Customers
- ✅ Manage Meters
- ✅ Record Readings (Primary job!)
- ❌ Cannot view Bills
- ❌ Cannot process Payments
- ❌ No Admin Panel access

**Perfect for**: Field staff who visit customer sites to record meter readings

---

#### 💰 Cashier (Payment Processing)
- **Username**: `cashier1`
- **Password**: `cashier123`
- **Access**: Bills and Payments only

**What you can do:**
- ✅ View Dashboard
- ✅ View Bills
- ✅ Process Payments (Primary job!)
- ❌ Cannot manage Customers
- ❌ Cannot manage Meters
- ❌ Cannot record Readings
- ❌ No Admin Panel access

**Perfect for**: Counter staff who collect payments from customers

---

## 🎯 Testing Scenarios

### Scenario 1: Field Officer Records Reading
1. Login as **Field Officer** (`officer1 / officer123`)
2. Navigate to **Readings** page
3. Select a meter
4. Enter current reading
5. Submit → Bill auto-generates!
6. Try to access **Payments** → Redirected to Unauthorized

### Scenario 2: Cashier Processes Payment
1. Login as **Cashier** (`cashier1 / cashier123`)
2. Navigate to **Payments** page
3. See unpaid bills list
4. Click **Process Payment** on a bill
5. Select payment method (Cash/Card/Online)
6. Submit payment
7. Try to access **Customers** → Redirected to Unauthorized

### Scenario 3: Manager Oversees Operations
1. Login as **Manager** (`manager1 / manager123`)
2. Access **Dashboard** - see all statistics
3. Navigate to **Customers** - manage customer records
4. Navigate to **Bills** - view unpaid bills
5. Navigate to **Payments** - process payment if needed
6. Try to access `/admin` → Redirected to Unauthorized

### Scenario 4: Admin Full Control
1. Login as **Admin** (`admin / admin123`)
2. Access **Dashboard**
3. Navigate to **Admin Panel** (`/admin`)
4. View **User Management** (coming soon)
5. Access all features
6. Manage system settings

---

## 🔍 Visual Indicators

### Role Badges
Look for colored badges showing your role:
- 🔴 **Admin** - Red gradient badge
- 🔵 **Manager** - Blue gradient badge
- 🟢 **Field Officer** - Green gradient badge
- 🟠 **Cashier** - Orange gradient badge

### Menu Items
The sidebar menu automatically hides options you don't have access to!

---

## 🔐 Security Features Implemented

✅ **Password Hashing**: All passwords stored with bcrypt
✅ **Token Authentication**: Session tokens in localStorage
✅ **Protected Routes**: Automatic redirect if not authenticated
✅ **Role Verification**: Server-side role checking
✅ **Unauthorized Page**: Clear message when access denied
✅ **Persistent Login**: Stay logged in across page refreshes
✅ **Secure Logout**: Clears all session data

---

## 📱 Navigation Tips

### From Home Page:
- Click **"🔐 Sign In"** → Goes to Login page
- Click **"📊 View Dashboard"** → Protected, redirects to Login if not authenticated

### After Login:
- Sidebar shows only what you can access
- Role badge visible in header
- Click **"🚪 Logout"** in sidebar to sign out

### If Access Denied:
- Shown **Unauthorized (🚫)** page
- Options to go to Dashboard or Home
- Can logout and login with different role

---

## 🛠️ Troubleshooting

### "Invalid username or password"
- Check credentials match exactly (case-sensitive)
- Use demo buttons for quick testing
- Verify database has user records

### Stuck on Login Page
- Clear browser localStorage
- Check backend is running on port 5000
- Verify database connection

### Page keeps redirecting to Login
- Token may be expired or invalid
- Clear localStorage and login again
- Check Redux DevTools for auth state

### Menu items missing
- This is normal! You only see what your role allows
- Login with Admin to see all options
- Check role badge in header

---

## 🎨 UI/UX Features

### Login Page
- Beautiful gradient background
- Demo login buttons for quick testing
- Remember credentials
- Clear error messages

### Dashboard Layout
- Clean, modern sidebar
- Role-based menu filtering
- User info in header
- Easy logout access

### Admin Layout
- Exclusive dark blue theme
- Comprehensive admin menu
- Admin badge prominence
- Separate from regular dashboard

---

## 📊 System Architecture

```
┌─────────────┐
│   Browser   │
│ (React App) │
└──────┬──────┘
       │
       │ Login Request
       ▼
┌─────────────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │
       │ Verify Password
       ▼
┌─────────────┐
│   MySQL DB  │
│    Users    │
└─────────────┘
       │
       │ Return User + Token
       ▼
┌─────────────┐
│ localStorage│
│  + Redux    │
└─────────────┘
       │
       │ Access Protected Routes
       ▼
┌─────────────┐
│Role-Based   │
│Authorization│
└─────────────┘
```

---

## 🎓 Learning Points

### For Developers:
1. **ProtectedRoute Component**: Wraps routes to check auth
2. **Redux Auth Slice**: Manages user state globally
3. **localStorage**: Persists session across refreshes
4. **Role-Based Rendering**: Conditional UI based on user role
5. **Server-Side Validation**: Backend verifies every request

### Best Practices:
- Never store passwords in plain text
- Always verify on server-side
- Clear tokens on logout
- Show clear error messages
- Provide visual role indicators

---

**Happy Testing! 🎉**

For questions or issues, check the full documentation in `AUTHENTICATION_SETUP.md`
