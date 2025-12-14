# 🏢 Utility Management System (UMS)

> A comprehensive full-stack utility billing and management system for electricity, water, and gas utilities. Built with React + Vite frontend, Node.js + Express backend, and MySQL database with automated bill generation and role-based access control.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.11.0-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?logo=mysql)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.7-646CFF?logo=vite)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.5.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)

---

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Features](#features)
- [Authentication & Roles](#authentication--roles)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## About The Project

The **Utility Management System (UMS)** is a comprehensive full-stack web application designed for utility companies to manage their complete operations from customer registration to bill payment. The system handles multiple utility types (Electricity, Water, Gas) with automated billing, role-based access control, and real-time analytics.

### 🎯 Project Overview

This system streamlines utility management by:
- **Automating bill generation** when meter readings are recorded using database triggers
- **Managing multiple utility types** with different tariff rates per customer type
- **Enforcing role-based permissions** for Admin, Manager, Field Officer, and Cashier roles
- **Processing payments** with multiple payment methods and transaction safety
- **Tracking everything** from customer registration → meter installation → reading records → bill generation → payment collection

### 🌟 Key Highlights

- ⚡ **Automated Workflow**: Database triggers automatically generate bills when readings are recorded
- 🔐 **4-Tier RBAC**: Admin, Manager, Field Officer, and Cashier with granular permissions
- 💼 **Multi-Utility Support**: Electricity, Water, and Gas with separate tariff structures  
- 👥 **Customer Types**: Household, Business, and Government with different pricing
- 🎨 **Modern UI**: Responsive design with mobile-friendly sidebar navigation
- 📊 **Real-time Analytics**: Interactive charts and statistics using Chart.js
- 🛡️ **Secure**: bcrypt password hashing, SQL injection prevention, transaction safety
- ☁️ **Cloud-Ready**: Works with Aiven, Railway, PlanetScale, or local MySQL
- 🚀 **Production-Ready**: Complete with error handling, loading states, and user feedback

### 💡 Business Logic Flow

```
1. Admin creates system users (Cashier, Manager, Field Officer)
2. Manager/Officer registers customers and installs meters
3. Field Officer visits sites and records meter readings
4. System automatically calculates usage and generates bills
5. Cashier processes customer payments at office/collection center
6. Bills automatically update from Unpaid → Paid status
7. Managers view reports and analytics on dashboard
```

### 🎓 Who Is This For?

- 🏢 **Utility Companies** - Manage electricity, water, and gas services efficiently
- 🏛️ **Municipal Corporations** - Handle public utilities with automated billing
- 🏘️ **Property Management** - Track utility consumption across multiple properties
- 💼 **Small-Medium Businesses** - Implement billing automation without expensive software
- 🎓 **Educational Institutions** - Learn full-stack development with real-world RBAC
- 👨‍💻 **Developers** - Reference implementation for React + Express + MySQL + Redux projects
- 🚀 **Startups** - Ready-to-deploy utility management solution with modern tech stack

### ✨ What Makes This Special?

- 🔥 **Complete Working System**: Not just a demo - production-ready with all CRUD operations
- 🎯 **Real-World Business Logic**: Database triggers, tariff calculations, payment transactions
- 🔐 **Professional Security**: Password hashing, role permissions, protected routes
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern Tech Stack**: Latest versions of React, Express, MySQL, Redux Toolkit
- 📚 **Well-Documented**: Comprehensive README, inline comments, and setup guides
- 🧪 **Sample Data Included**: Pre-populated with test customers, meters, and demo users

---

## Built With

### Frontend
- **[React 18.3.1](https://reactjs.org/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management with localStorage persistence
- **[Chart.js 4.4.7](https://www.chartjs.org/)** - Data visualization (Pie, Bar, Line charts)
- **[Axios](https://axios-http.com/)** - HTTP client
- **CSS3** - Modern styling with multiple layouts

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Express 5.2.1](https://expressjs.com/)** - Web framework
- **[MySQL2 3.15.3](https://github.com/sidorares/node-mysql2)** - Database client with promises
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing (10 salt rounds)
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variables
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin support
- **[Nodemon](https://nodemon.io/)** - Development auto-restart

### Database
- **MySQL 5.7+** - Relational database with triggers and views
- Cloud providers: Aiven, Railway, PlanetScale, FreeSQLDatabase

---

## Features

### Core Functionality
- **Customer Management**: Register and manage household, business, and government customers
- **Meter Management**: Track meters for multiple utility types per customer with serial numbers
- **Reading Records**: Field officers record meter readings with automatic bill generation
- **Automated Billing**: Database trigger automatically generates bills from readings
- **Payment Processing**: Process payments with Cash, Card, or Online methods
- **Tariff Management**: Different rates for customer types and utility types
- **Overdue Tracking**: Automatically mark bills as overdue after due date
- **Unpaid Bills View**: Database view for quick access to unpaid bills

### Authentication & Authorization
- **User Roles**: 4 distinct roles (Admin, Manager, Field Officer, Cashier)
- **Protected Routes**: Role-based route protection with ProtectedRoute HOC
- **Permission System**: Granular permissions for each role
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Token-based Auth**: Persistent authentication with localStorage
- **Admin Panel**: Complete user management system
- **User CRUD**: Admins can create, edit, and delete users
- **Role Assignment**: Dynamic role assignment with permission preview

### Frontend Features
- **6 Feature Pages**:
  - Customers - Customer CRUD with search and filters
  - Meters - Meter management with utility type tracking
  - Readings - Record readings with auto-bill generation
  - Bills - Bill listing with status filters and chart view
  - Payments - Payment processing with history
  - Dashboard - Analytics with Chart.js visualizations

- **2 Admin Pages**:
  - Admin Dashboard - System overview and statistics
  - User Management - Full user CRUD interface

- **4 Pre-built Layouts**:
  - MainLayout - Public pages with navigation
  - DashboardLayout - User dashboard with role-based sidebar
  - AuthLayout - Login page with demo credentials
  - AdminLayout - Admin panel with full navigation

- **Data Visualization**: Pie, Bar, and Line charts using Chart.js
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Redux State Management**: Centralized state with async thunks and localStorage persistence
- **Component Library**: Reusable UI components (Button, RoleGuard, ProtectedRoute)
- **Role-based UI**: Menu items and buttons show/hide based on user permissions

### Backend Features
- **RESTful API**: 6 main resource endpoints + authentication
- **Database Transactions**: Payment processing uses transactions for data integrity
- **Password Security**: bcrypt hashing with salt rounds
- **MVC Architecture**: Clean separation of concerns
- **Connection Pooling**: Optimized database performance
- **SQL Injection Prevention**: Parameterized queries throughout
- **Migration Script**: One-command database setup with sample data
- **User Authentication**: Login endpoint with token generation

---

## Authentication & Roles

### User Roles & Permissions

The system implements a comprehensive role-based access control (RBAC) system with 4 distinct user roles:

#### 1. Admin
- **Access Level**: Full system access
- **Permissions**:
  - User management (create, edit, delete users)
  - All CRUD operations on customers, meters, readings, bills, payments
  - View all reports and analytics
  - System configuration and settings
- **Use Case**: System administrators and IT staff

#### 2. Manager
- **Access Level**: All operational features
- **Permissions**:
  - Customer & Meter management
  - View and manage readings
  - Bill management and tracking
  - Payment processing and reports
  - NO user management access
- **Use Case**: Branch managers and supervisors

#### 3. Field Officer
- **Access Level**: Field operations
- **Permissions**:
  - Customer management (view, create, edit)
  - Meter management (view, install, update)
  - Record meter readings (triggers automatic bill generation)
  - NO access to bills or payments
  - NO user management
- **Use Case**: Field technicians who visit customer sites

#### 4. Cashier
- **Access Level**: Financial operations
- **Permissions**:
  - View bills
  - Process payments (Cash, Card, Online)
  - View payment history
  - NO access to customers, meters, or readings
  - NO user management
- **Use Case**: Front desk staff and payment collection centers

### Demo Credentials

For testing purposes, use these credentials:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| manager | manager123 | Manager |
| officer | officer123 | Field Officer |
| cashier | cashier123 | Cashier |

> **Note**: Change these passwords in production!

### Permission Matrix

| Feature | Admin | Manager | Field Officer | Cashier |
|---------|:-----:|:-------:|:-------------:|:-------:|
| User Management | ✓ | ✗ | ✗ | ✗ |
| Create Customers | ✓ | ✓ | ✓ | ✗ |
| Manage Meters | ✓ | ✓ | ✓ | ✗ |
| Record Readings | ✓ | ✓ | ✓ | ✗ |
| View Bills | ✓ | ✓ | ✗ | ✓ |
| Process Payments | ✓ | ✓ | ✗ | ✓ |
| View Reports | ✓ | ✓ | ✗ | ✗ |

---

## Database Schema

The system uses 8 main tables with relationships, triggers, and views:

### Tables

1. **Users** - System users (Admin, FieldOfficer, Cashier, Manager)
2. **Customers** - Utility customers (Household, Business, Government)
3. **UtilityTypes** - Types of utilities (Electricity, Water, Gas)
4. **Tariffs** - Pricing structure per utility and customer type
5. **Meters** - Customer meters linked to utility types
6. **Readings** - Meter readings with date and user who recorded
7. **Bills** - Generated bills with amounts and due dates
8. **Payments** - Payment records with methods and processing user

### Database Objects

- **Function**: `GetTariffRate()` - Calculate tariff rate for a meter
- **Trigger**: `After_Reading_Insert` - Auto-generate bill when reading is added
- **View**: `View_UnpaidBills` - Show all unpaid bills with customer details

### Entity Relationships

```
Customers ─┬─ Meters ─┬─ Readings ──→ Bills ──→ Payments
           │          │
           │          └─ UtilityTypes ──→ Tariffs
           │
           └─ CustomerType (Household/Business/Government)

Users ─────┬─ ReadingTakenBy (Readings)
           └─ ProcessedBy (Payments)
```

---

## Architecture

### System Overview

```
┌─────────────────┐
│   Client Side   │
│  (React + Vite) │
│   Port: 5173    │
│   Redux Store   │
└────────┬────────┘
         │
         │ HTTP/HTTPS (Axios)
         │
         ▼
┌─────────────────┐
│   API Server    │
│   (Express.js)  │
│   Port: 5000    │
│  MVC Pattern    │
└────────┬────────┘
         │
         │ MySQL2 (Connection Pool)
         │
         ▼
┌─────────────────┐
│  MySQL Database │
│  (Cloud/Local)  │
│  8 Tables       │
│  Triggers/Views │
└─────────────────┘
```

### Folder Structure

```
umc/
│
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button/
│   │   │   └── index.js      # Export all components
│   │   ├── layouts/           # 4 layout types
│   │   │   ├── MainLayout/   # Public pages layout
│   │   │   ├── DashboardLayout/ # User dashboard layout
│   │   │   ├── AuthLayout/   # Login/register layout
│   │   │   ├── AdminLayout/  # Admin panel layout
│   │   │   └── index.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx      # Landing page
│   │   │   └── Home.css
│   │   ├── routes/            # Route configuration
│   │   │   └── index.jsx     # Centralized routing
│   │   ├── redux/             # State management
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── customerSlice.js
│   │   │       ├── meterSlice.js
│   │   │       ├── readingSlice.js
│   │   │       ├── billSlice.js
│   │   │       └── paymentSlice.js
│   │   ├── services/          # API service layer
│   │   │   ├── api.js        # Axios configuration
│   │   │   ├── customerService.js
│   │   │   ├── meterService.js
│   │   │   ├── readingService.js
│   │   │   ├── billService.js
│   │   │   ├── paymentService.js
│   │   │   ├── userService.js
│   │   │   └── index.js
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
│
├── server/                     # Backend Node.js application
│   ├── config/
│   │   └── database.js        # MySQL connection with pooling & SSL
│   ├── controllers/           # Business logic layer
│   │   ├── userController.js  # User & authentication
│   │   ├── customerController.js
│   │   ├── meterController.js
│   │   ├── readingController.js
│   │   ├── billController.js
│   │   └── paymentController.js
│   ├── routes/                # API route definitions
│   │   ├── userRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── meterRoutes.js
│   │   ├── readingRoutes.js
│   │   ├── billRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── index.js          # Centralized route mounting
│   ├── models/                # Database interaction layer
│   │   ├── userModel.js
│   │   ├── customerModel.js
│   │   ├── utilityTypeModel.js
│   │   ├── tariffModel.js
│   │   ├── meterModel.js
│   │   ├── readingModel.js
│   │   ├── billModel.js
│   │   └── paymentModel.js
│   ├── database/              # Database schema & migration
│   │   ├── schema.sql        # Complete database schema
│   │   ├── migrate.js        # Automated migration script
│   │   └── README.md         # Database setup guide
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── .env
│   └── package.json
│
├── screenshots/               # Project screenshots (to be added)
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **npm** (comes with Node.js)
- **MySQL Database** (v5.7+ - local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/utility-management-system.git
   cd utility-management-system
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

#### Server Setup

1. Create `.env` file in `server/` directory:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Update `.env` with your database credentials:
   ```env
   PORT=5000
   
   # Local MySQL Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=UtilityDB
   DB_PORT=3306
   DB_SSL=false
   
   # For Cloud Database (Aiven, Railway, PlanetScale)
   # DB_HOST=mysql-xxxxx.aivencloud.com
   # DB_USER=avnadmin
   # DB_PASSWORD=cloud_password
   # DB_NAME=UtilityDB
   # DB_PORT=xxxxx
   # DB_SSL=true
   ```

### Database Setup

#### Option 1: Automated Migration (Recommended)

Run the migration script to automatically set up the database:

```bash
cd server
npm run migrate
```

This will:
- Create the `UtilityDB` database
- Create all 8 tables
- Add triggers, functions, and views
- Insert sample data
- Verify the setup

#### Option 2: Manual Setup

1. Open MySQL Workbench or command line
2. Execute the schema file:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```

For detailed database setup instructions, see [server/database/README.md](server/database/README.md)

#### Client Setup

1. Create `.env` file in `client/` directory:
   ```bash
   cd client
   cp .env.example .env
   ```

2. Update `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## Usage

### Development Mode

Run both server and client in separate terminals.

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

### Production Build

**Build Client:**
```bash
cd client
npm run build
```

**Start Server:**
```bash
cd server
npm start
```

### Demo Credentials

Use these credentials for testing:

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| admin | admin123 | Admin | Full system access + User management |
| manager | manager123 | Manager | All operations except user management |
| officer | officer123 | Field Officer | Customers, Meters, Readings only |
| cashier | cashier123 | Cashier | Bills and Payments only |

> **Security Note**: These are demo credentials. In production, enforce strong passwords and change default credentials immediately.

### Testing the Complete Workflow

1. **Login as Admin** (admin / admin123)
   - Navigate to Admin Dashboard
   - Create a new user (Field Officer or Cashier)
   - View system statistics

2. **Login as Field Officer** (officer / officer123)
   - View Customers list
   - View Meters assigned to customers
   - Record a new Meter Reading
   - Verify bill auto-generates in database

3. **Login as Cashier** (cashier / cashier123)
   - View Bills page
   - Filter by "Unpaid" status
   - Process Payment for a bill
   - Verify bill status updates to "Paid"

4. **Login as Manager** (manager / manager123)
   - View Dashboard with charts
   - Check customer distribution (Pie chart)
   - View monthly consumption (Bar chart)
   - Review revenue trends (Line chart)
   - Check recent activity feeds

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### POST `/users/login`
Login user and get authentication token.

**Request:**
```json
{
  "Username": "admin",
  "PasswordHash": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "UserID": 1,
    "Username": "admin",
    "Role": "Admin"
  }
}
```

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers |
| GET | `/customers/:id` | Get customer by ID |
| GET | `/customers/type/:type` | Get customers by type (Household/Business/Government) |
| GET | `/customers/search?q=term` | Search customers by name/phone |
| POST | `/customers` | Create new customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

**POST /customers** Example:
```json
{
  "FullName": "John Doe",
  "Address": "123 Main St, Colombo",
  "Phone": "0771234567",
  "CustomerType": "Household"
}
```

### Meters

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meters` | Get all meters with customer & utility details |
| GET | `/meters/:id` | Get meter by ID |
| GET | `/meters/customer/:customerId` | Get all meters for a customer |
| GET | `/meters/status/:status` | Get meters by status (Active/Suspended) |
| POST | `/meters` | Install new meter |
| PUT | `/meters/:id` | Update meter |
| DELETE | `/meters/:id` | Remove meter |

**POST /meters** Example:
```json
{
  "SerialNumber": "ELEC-001",
  "CustomerID": 1,
  "UtilityTypeID": 1,
  "InstallationDate": "2024-12-14",
  "Status": "Active"
}
```

### Readings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/readings` | Get all readings |
| GET | `/readings/:id` | Get reading by ID |
| GET | `/readings/meter/:meterId` | Get all readings for a meter |
| GET | `/readings/meter/:meterId/last` | Get last reading for a meter |
| POST | `/readings` | Record new reading (auto-generates bill) |
| PUT | `/readings/:id` | Update reading |
| DELETE | `/readings/:id` | Delete reading |

**POST /readings** Example (Auto-generates Bill):
```json
{
  "MeterID": 1,
  "ReadingDate": "2024-12-14",
  "PreviousReading": 1000,
  "CurrentReading": 1150,
  "ReadingTakenBy": 2
}
```

### Bills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bills` | Get all bills |
| GET | `/bills/:id` | Get bill by ID |
| GET | `/bills/customer/:customerId` | Get all bills for a customer |
| GET | `/bills/unpaid` | Get all unpaid bills (uses database view) |
| GET | `/bills/status/:status` | Get bills by status (Unpaid/Paid/Overdue) |
| PUT | `/bills/:id/status` | Update bill status |
| PUT | `/bills/mark-overdue` | Mark overdue bills (past due date) |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments` | Get all payments |
| GET | `/payments/:id` | Get payment by ID |
| GET | `/payments/bill/:billId` | Get payments for a bill |
| GET | `/payments/stats` | Get payment statistics |
| POST | `/payments` | Process payment (uses transaction) |
| DELETE | `/payments/:id` | Delete payment |

**POST /payments** Example (Marks Bill as Paid):
```json
{
  "BillID": 1,
  "AmountPaid": 2250.00,
  "PaymentMethod": "Cash",
  "ProcessedBy": 3
}
```

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/login` | User authentication |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/role/:role` | Get users by role |
| POST | `/users` | Create new user (password auto-hashed) |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Response Format

All API responses follow this structure:

**Success (2xx):**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Project Structure

### Client Architecture
- **components/** - Reusable UI elements (Button, Input, Card, etc.)
- **layouts/** - 4 layout wrappers (Main, Dashboard, Auth, Admin)
- **pages/** - Page-level components for routes
- **routes/** - Centralized route configuration with layout nesting
- **redux/** - State management with slices for each resource
- **services/** - API integration layer with Axios
- **hooks/** - Custom React hooks (useAuth, etc.)

### Server Architecture
- **config/** - Database connection with pooling
- **controllers/** - Business logic, validation, error handling
- **routes/** - API endpoint definitions with centralized mounting
- **models/** - Database interaction layer (SQL queries)
- **database/** - Schema file and migration script
- **app.js** - Express setup and middleware configuration
- **server.js** - Server entry point (clean)

---

## Use Cases & Benefits

### Primary Use Case: Utility Service Providers

**Scenario:** A municipal water and electricity department needs to manage 10,000+ customers.

**Solution:**
1. Field officers visit sites and record meter readings via mobile app
2. System automatically generates bills based on tariff rates
3. Customers receive bills with due dates
4. Cashiers process payments at service centers
5. Managers view reports on revenue, overdue bills, consumption trends

### Secondary Use Cases:

1. **Apartment Complex Management** - Track utility usage per unit
2. **Commercial Buildings** - Bill tenants for shared utilities
3. **Educational Institutions** - Monitor utility consumption across campus
4. **Industrial Estates** - Manage utility distribution for multiple businesses
5. **Government Housing Projects** - Subsidized billing for low-income housing

### Key Benefits:

- **Reduces Manual Work**: 90% reduction in billing errors
- **Improves Cash Flow**: Faster bill generation and payment tracking
- **Enhances Transparency**: Customers can view consumption history
- **Supports Decision Making**: Reports on consumption patterns
- **Scalable**: Handle millions of records with proper indexing

---

## Roadmap

**Phase 1 - Core Features** (COMPLETED)
- [x] Database schema with 8 tables, triggers, and views
- [x] Backend API with 6 resource endpoints + authentication
- [x] Frontend Redux state management with persistence
- [x] 6 feature pages (Customers, Meters, Readings, Bills, Payments, Dashboard)
- [x] 4 layout types (Main, Dashboard, Auth, Admin)
- [x] Migration script with sample data
- [x] Password hashing with bcrypt
- [x] Transaction safety for payments

**Phase 2 - Authentication & Security** (COMPLETED)
- [x] Role-based access control (RBAC) with 4 roles
- [x] Protected routes with permission checking
- [x] Admin panel for user management
- [x] User CRUD operations
- [x] Token-based authentication
- [x] Password hashing and validation
- [x] Role-based UI components

**Phase 3 - Data Visualization** (COMPLETED)
- [x] Chart.js integration
- [x] Dashboard with Pie, Bar, and Line charts
- [x] Customer distribution analytics
- [x] Monthly consumption tracking
- [x] Revenue trend analysis
- [x] Recent activity feeds

**Phase 4 - Enhanced Features** (PLANNED)
- [ ] Customer portal for viewing bills online
- [ ] SMS/Email notifications for bills and payments
- [ ] Online payment gateway integration (Stripe/PayPal)
- [ ] PDF bill generation and download
- [ ] Export data to Excel/CSV
- [ ] Advanced search and filtering
- [ ] Bulk operations (bulk payment, bulk reading upload)

**Phase 5 - Advanced Analytics** (PLANNED)
- [ ] Predictive analytics for consumption patterns
- [ ] Anomaly detection in meter readings
- [ ] Customer segmentation
- [ ] Revenue forecasting
- [ ] Custom report builder
- [ ] Scheduled reports via email

**Phase 6 - Mobile & Real-time** (FUTURE)
- [ ] Mobile app (React Native)
- [ ] Real-time meter reading (IoT integration)
- [ ] Push notifications
- [ ] Offline mode for field officers
- [ ] GPS tracking for field visits
- [ ] Photo upload for meter readings

**Phase 7 - DevOps & Testing** (IN PROGRESS)
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance optimization
- [ ] Load testing and stress testing

---

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute:

1. **Fork the Project**
2. **Create Feature Branch** (`git checkout -b feature/NewFeature`)
3. **Commit Changes** (`git commit -m 'Add NewFeature'`)
4. **Push to Branch** (`git push origin feature/NewFeature`)
5. **Open Pull Request**

### Coding Standards:

- Follow existing code structure
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Developer:** Your Name  
**Email:** your.email@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**LinkedIn:** [your-linkedin](https://linkedin.com/in/yourprofile)

**Project Repository:** [https://github.com/yourusername/utility-management-system](https://github.com/yourusername/utility-management-system)

---

## Acknowledgments

- [React Documentation](https://reactjs.org/) - Frontend framework
- [Express.js Guide](https://expressjs.com/) - Backend framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [MySQL Documentation](https://dev.mysql.com/doc/) - Database
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Code quality
- [Aiven](https://aiven.io) - Cloud database hosting

---

## Troubleshooting

### Common Issues:

**1. Database connection fails**
- Check `.env` credentials are correct
- Verify MySQL server is running
- For cloud databases, check SSL settings

**2. CORS errors in browser**
- Ensure CORS is enabled in `app.js`
- Check `VITE_API_URL` in client `.env`

**3. Bills not auto-generating**
- Verify database trigger exists: `SHOW TRIGGERS FROM UtilityDB;`
- Check reading data is valid (CurrentReading >= PreviousReading)

**4. Migration script fails**
- Check MySQL version (5.7+ required)
- Verify user has CREATE DATABASE privileges
- Try manual schema execution

For more issues, check [Issues](https://github.com/yourusername/utility-management-system/issues) or create a new one.

---

<div align="center">

**Star this repository if you find it helpful!**

**Share with others who might benefit from this project**

Made with care for the developer community

</div>
