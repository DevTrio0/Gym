# Product Requirements Document (PRD)
## Gym & Online Coaching Platform API

**Document Date:** February 8, 2026  
**Project:** Gym & Online Coaching API (Node.js/Express)  
**Version:** 1.0  
**Status:** Development Phase - Needs Refinement

---

## Executive Summary

The Gym & Online Coaching Platform is a comprehensive REST API designed to manage a fitness and coaching business with three distinct user roles: **Admin**, **Coach**, and **Client**. The system handles user authentication, subscription management, financial tracking, and coaching services delivery across multiple mediums (gym, online, hybrid).

---

## Current State Review

### ✅ Code Quality Assessment

**Strengths:**
- Clean separation of concerns (Controllers, Routes, Middleware, Models)
- Proper use of Express.js framework
- JWT Bearer token authentication implemented
- Role-based access control (Admin, Coach, Client)
- Mock database structure in place
- Error handling with proper HTTP status codes
- Service layer for business logic (Profit & Salary services)
- Comprehensive documentation files



**Areas for Improvement:**
- Validation could be more robust (email format, phone numbers, etc.)
- No database migration strategy documented
- No API rate limiting implemented
- Session management not fully implemented
- Error messages could be more descriptive
- No logging system implemented
- Timestamps could use UTC consistently
- No input sanitization for security

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    REST API Layer                        │
├─────────────────────────────────────────────────────────┤
│  Routes (adminRoutes, coachRoutes, clientRoutes)        │
├─────────────────────────────────────────────────────────┤
│  Controllers (Business Logic)                            │
├─────────────────────┬─────────────────────┬──────────────┤
│  authController     │  adminController    │  coachCtrl   │
└─────────────────────┴─────────────────────┴──────────────┘
         ↓                    ↓                    ↓
┌────────────────────────────────────────────────────────┐
│         Services (Business Rules)                       │
│  profitService.js, coachSalaryService.js                │
└────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────┐
│         Models & Database Layer                         │
│  mockDatabase.js (will be replaced with real DB)        │
└────────────────────────────────────────────────────────┘
```

---

## Middleware Layer

The middleware layer provides cross-cutting concerns for authentication, authorization, and request processing.

### 1. **Authentication Middleware** (`auth.js`)

#### `verifyBearerToken(req, res, next)`
**Purpose:** Verify JWT Bearer token on protected endpoints

**How it works:**
1. Extracts token from `Authorization: Bearer <token>` header
2. Validates token signature and expiration
3. Decodes token to get user information
4. Stores user data in `req.user` for downstream handlers

**Usage:**
```javascript
router.get('/dashboard', verifyBearerToken, adminController.getDashboard);
```

**Responses:**
- ✅ **200** - Token valid, continues to next middleware
- ❌ **401** - No token provided
- ❌ **403** - Invalid or expired token

#### `checkRole(requiredRole)`
**Purpose:** Verify user has specific required role

**How it works:**
1. Checks `req.user.role` against required role
2. Blocks access if role doesn't match
3. Returns permission denied error

**Usage:**
```javascript
router.post('/dashboard/salary/set', 
  verifyBearerToken, 
  checkRole('admin'),              // Only admins
  adminController.setCoachSalary
);
```

**Supported Roles:**
- `admin` - Full platform control
- `coach` - Client management and training
- `client` - Personal account and workouts

#### `checkRoles(rolesArray)`
**Purpose:** Verify user has one of multiple allowed roles

**How it works:**
1. Checks if `req.user.role` is in allowed roles array
2. Grants access if any role matches
3. Denies if none match

**Usage:**
```javascript
router.get('/dashboard/report', 
  verifyBearerToken, 
  checkRoles(['admin', 'coach']),  // Admin OR Coach
  reportController.getReport
);
```

### Middleware Chain Example

```
Request → verifyBearerToken → checkRole('admin') → Execute Controller
           (Authenticate)      (Authorize)         (Business Logic)
```

**Flow for Protected Admin Endpoint:**
```
1. Client sends: GET /dashboard 
   Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

2. verifyBearerToken executes:
   - Extracts token from header
   - Validates JWT signature
   - Checks expiration
   - Sets req.user = { userId, email, role: 'admin' }
   - Calls next()

3. checkRole('admin') executes:
   - Checks req.user.role === 'admin'
   - ✅ Match! Calls next()

4. adminController.getDashboard() executes:
   - Generates dashboard data
   - Returns response with statistics

5. Client receives: 200 OK with dashboard data
```

**Flow for Unauthorized Access:**
```
1. Coach tries: POST /dashboard/add-coach
   Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

2. verifyBearerToken ✅ validates token
   - Sets req.user = { userId, email, role: 'coach' }

3. checkRole('admin') ❌ checks role
   - req.user.role === 'coach' (not 'admin')
   - Returns 403 error

4. Client receives: 403 Forbidden
   message: "Access denied. admin role required"
```

### Implementation Details

**In route files:**
```javascript
const { verifyBearerToken, checkRole, checkRoles } = require('../middleware/auth');

// Single role requirement
router.post('/endpoint', verifyBearerToken, checkRole('admin'), controller.action);

// Multiple roles
router.get('/endpoint', verifyBearerToken, checkRoles(['admin', 'coach']), controller.action);

// No authentication (public endpoint)
router.post('/auth/login', controller.login);
```

**Token Verification Process:**
1. Extract token from `Authorization` header
2. Split string to get token after "Bearer "
3. Use `jsonwebtoken.verify()` with secret key
4. If valid: return decoded payload
5. If invalid/expired: return null

### Security Features

✅ **Bearer Token Standard** - Industry-standard authentication  
✅ **JWT Validation** - Signature and expiration checked  
✅ **Role-Based Access Control** - Fine-grained permissions  
✅ **Token in Header** - Safer than URL parameters  
✅ **Stateless Authentication** - No session storage needed  

### Future Middleware Enhancements

🔲 **Error Handler Middleware** - Centralized error processing  
🔲 **Request Logger Middleware** - Log all API calls  
🔲 **Rate Limiting Middleware** - Prevent abuse  
🔲 **Input Sanitization Middleware** - Security enhancement  
🔲 **CORS Middleware** - Control cross-origin requests  
🔲 **Request ID Middleware** - Track requests through logs  
🔲 **Validation Middleware** - Validate request schemas  

---

## User Roles & Capabilities

### 1️⃣ ADMIN ROLE

#### Current Capabilities:
- ✅ **Authentication**
  - Login with email/password
  - Forgot password & reset
  - Register other admins
  - Logout

- ✅ **User Management**
  - Add coaches (pending approval)
  - Add clients
  - Delete user accounts
  - Deactivate/reactivate accounts

- ✅ **Coach Management**
  - View all coaches and their status
  - Approve pending coach registrations
  - Monitor coach activity

- ✅ **Financial Management**
  - View all payments
  - View profit reports (with tax calculations)
  - Calculate profit after taxes and salaries
  - View detailed profit breakdown by period

- ✅ **Coach Salary Management**
  - Set monthly coach salaries
  - View all coach salaries
  - Process salary payments
  - Track payment history per coach
  - View all salary transactions
  - Generate comprehensive salary reports
  - Calculate total payout and budgets

- ✅ **Dashboard & Reporting**
  - View dashboard with statistics
  - Get monthly reports
  - Count active clients and coaches
  - Track subscription plans

#### Future Capabilities:
- 🔲 Create subscription plans dynamically
- 🔲 Set different tax percentages by region/quarter
- 🔲 Export financial reports to PDF/Excel
- 🔲 View attendance records
- 🔲 Manage gym classes and schedules
- 🔲 Set commission structures for coaches
- 🔲 Handle refunds and cancellations
- 🔲 Generate invoices for clients
- 🔲 Analytics and business insights
- 🔲 Multi-language support

---

### 2️⃣ COACH ROLE

#### Current Capabilities:
- ✅ **Authentication**
  - Sign in (pending approval)
  - Forgot password & reset
  - Login check
  - Logout

- ✅ **Client Management**
  - View list of assigned clients
  - Access detailed client progress
  - View client subscription status
  - Manage multiple clients

- ✅ **Training Programs**
  - Create and update diet plans for clients
  - Create weekly training schedules
  - Add detailed notes for client progress
  - Track workout progression

- ✅ **Progress Tracking**
  - View client progress metrics
  - Review diet plan compliance
  - Monitor training plan adherence
  - Add coaching notes

#### Future Capabilities:
- 🔲 Video call integration for online coaching
- 🔲 Send messages/notifications to clients
- 🔲 Create customizable workout templates
- 🔲 Track client measurements and body metrics
- 🔲 Generate performance reports
- 🔲 Schedule appointments/sessions
- 🔲 View payment history for earned commissions
- 🔲 Create their own availability calendar
- 🔲 Client feedback and ratings
- 🔲 Integration with fitness tracking devices

---

### 3️⃣ CLIENT ROLE

#### Current Capabilities:
- ✅ **Authentication**
  - Sign up / Register
  - Sign in
  - Forgot password & reset
  - Login check
  - Logout

- ✅ **Profile & Dashboard**
  - View welcome page with profile info
  - Track personal progress
  - View assigned coach information

- ✅ **Subscription Management**
  - View available subscription plans
  - Select preferred plan
  - Choose service method (gym, online, hybrid)
  - View plan details and pricing
  - View active subscription status

- ✅ **Payment Processing**
  - Make payments for subscriptions
  - Renew or change subscriptions
  - View payment confirmation

- ✅ **Training & Progress**
  - View weekly workout schedule
  - Book workouts with requirement of active subscription
  - View diet plan assigned by coach
  - Update personal progress
  - View progress history
  - Send messages to coach (if implemented)

#### Future Capabilities:
- 🔲 Mobile app support
- 🔲 Receive push notifications
- 🔲 Integration with fitness trackers (Apple Health, Fitbit, etc.)
- 🔲 Video playback of workout tutorial
- 🔲 Progress photos and before/after gallery
- 🔲 Social features (challenges, leaderboards)
- 🔲 In-app messaging with coach
- 🔲 Nutrition logging with meal tracking
- 🔲 Automatic subscription renewal
- 🔲 Subscription pause/resume functionality
- 🔲 Referral program
- 🔲 Testimonials and review system

---

## Service Features

### Current Implementation

#### 1. Profit Service (`services/profitService.js`)
**Purpose:** Calculate gym profitability after deducting taxes and coach salaries

**Functions:**
- `calculateTotalRevenue()` - Sum all completed payments
- `calculateTax(revenue, taxPercentage)` - Calculate tax on revenue
- `calculateTotalCoachSalaries()` - Sum all coach salaries
- `calculateProfitAfterTaxes(taxPercentage)` - Final profit calculation
- `getRevenueByPeriod(startDate, endDate)` - Revenue in time window
- `getProfitReport(taxPercentage)` - Comprehensive report

**Formula:** 
```
Profit = Revenue - Taxes - Coach Salaries
Profit Margin = (Profit / Revenue) × 100%
```

#### 2. Coach Salary Service (`services/coachSalaryService.js`)
**Purpose:** Manage coach compensation and payment tracking

**Functions:**
- `setCoachSalary(coachId, amount, description)` - Set monthly salary
- `getCoachSalary(coachId)` - Retrieve salary record
- `getAllCoachSalaries()` - Get all salaries with statistics
- `payCoachSalary(coachId, amount, notes)` - Record payment
- `getCoachPaymentHistory(coachId, limit)` - Payment audit trail
- `getAllSalaryPayments(limit)` - All transactions
- `generateSalaryReport()` - Complete salary summary

---

## API Endpoints Summary

### Authentication Endpoints (Public)
| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| GET | `/start` | All | Load frontend |
| POST | `/auth/login` | All | Login check |
| POST | `/auth/signin` | All | Sign in |
| POST | `/auth/register` | Guest | Register account |
| POST | `/auth/forgetpassword` | All | Request password reset |
| POST | `/auth/resetpassword` | All | Reset password |

### Admin Endpoints (Admin Only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard` | View dashboard |
| POST | `/dashboard/add-coach` | Add new coach |
| POST | `/dashboard/add-client` | Add new client |
| DELETE | `/dashboard/delete-account` | Delete user |
| PUT | `/dashboard/deactivate-account` | Deactivate account |
| PUT | `/dashboard/reactivate-account` | Reactivate account |
| GET | `/dashboard/reports/monthly` | Monthly report |
| GET | `/dashboard/payments` | View all payments |
| GET | `/dashboard/profits` | Profit report |
| GET | `/dashboard/profits/detail` | Detailed profit breakdown |
| PUT | `/dashboard/subscription/approve` | Approve coach |
| GET | `/dashboard/clients/count` | Count clients |
| **SALARY MANAGEMENT** | | |
| POST | `/dashboard/salary/set` | Set coach salary |
| GET | `/dashboard/salary/all` | View all salaries |
| GET | `/dashboard/salary/:coachId` | View coach salary |
| POST | `/dashboard/salary/pay` | Pay coach salary |
| GET | `/dashboard/salary/history/:coachId` | Payment history |
| GET | `/dashboard/salary-payments/all` | All payments |
| GET | `/dashboard/salary/report` | Salary report |
| POST | `/exit` | Logout |

### Coach Endpoints (Coach Only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/dashboard/add-diet` | Create diet plan |
| GET | `/dashboard/clients` | View clients |
| POST | `/dashboard/clients/:id/add-note` | Add note |
| POST | `/dashboard/add-training` | Create training plan |
| GET | `/dashboard/clients/:id/progress` | View progress |
| POST | `/exit` | Logout |

### Client Endpoints (Client Only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/welcome` | View dashboard |
| POST | `/dashboard/book-workout` | Book workout |
| POST | `/dashboard/subscription/select-plan` | Choose plan |
| POST | `/dashboard/subscription/payment` | Make payment |
| POST | `/dashboard/subscription/renew-or-change` | Renew/change |
| GET | `/dashboard/workout-week` | View weekly schedule |
| GET | `/dashboard/progress` | View progress |
| POST | `/dashboard/progress/update` | Update progress |
| POST | `/exit` | Logout |

---

## Data Models

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string (hashed),
  role: "admin" | "coach" | "client",
  status: "active" | "pending" | "deactivated",
  createdAt: Date
}
```

### Coach
```javascript
{
  id: string,
  userId: string,
  name: string,
  email: string,
  specialization: string,
  bio: string,
  clients: [clientId],
  status: "active" | "pending",
  salary: number,
  salaryUpdatedAt: Date,
  approvedAt: Date,
  createdAt: Date
}
```

### Client
```javascript
{
  id: string,
  userId: string,
  name: string,
  email: string,
  coachId: string,
  subscription: {
    planId: string,
    method: "gym" | "online" | "hybrid",
    startDate: Date,
    endDate: Date,
    status: "active" | "expired"
  },
  progress: {
    dietProgress: string,
    workoutProgress: string,
    notes: string
  },
  createdAt: Date
}
```

### Subscription Plan
```javascript
{
  id: string,
  name: string,
  price: number,
  duration: number (days),
  type: "gym" | "online" | "hybrid",
  description: string
}
```

### Payment
```javascript
{
  id: string,
  clientId: string,
  planId: string,
  amount: number,
  method: string,
  status: "completed" | "pending" | "failed",
  date: Date
}
```

### Coach Salary
```javascript
{
  id: string,
  coachId: string,
  coachName: string,
  amount: number,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Salary Payment
```javascript
{
  id: string,
  coachId: string,
  coachName: string,
  coachEmail: string,
  salaryId: string,
  amount: number,
  notes: string,
  status: "completed",
  paidAt: Date
}
```

---

## Future Roadmap

### Phase 2: Enhanced Features
- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] Email notifications system
- [ ] SMS notifications
- [ ] Automated subscription renewal
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Refund management system
- [ ] Invoice generation and PDF export
- [ ] Advanced analytics dashboard
- [ ] Two-factor authentication

### Phase 3: Premium Features
- [ ] Video streaming capability
- [ ] Live class scheduling
- [ ] Mobile app (iOS/Android)
- [ ] Wearable device integration
- [ ] AI-powered workout recommendations
- [ ] Community features (challenges, leaderboards)
- [ ] Integration with nutrition tracking apps
- [ ] Multi-language support
- [ ] Multi-timezone handling

### Phase 4: Enterprise Features
- [ ] Multi-location gym support
- [ ] Staff management
- [ ] Equipment inventory tracking
- [ ] Class scheduling and booking
- [ ] Member check-in system
- [ ] Advanced reporting and business intelligence
- [ ] Integration with gym equipment
- [ ] API for third-party integrations
- [ ] White-label solution

---

## Security Considerations

### Current Implementation
✅ Password hashing with bcryptjs  
✅ JWT Bearer token authentication  
✅ Role-based access control (RBAC)  
✅ Protected endpoints with middleware  

### Recommendations for Future
🔲 Input validation and sanitization  
🔲 Rate limiting on endpoints  
🔲 HTTPS enforcement  
🔲 CORS configuration  
🔲 Environment variables for secrets  
🔲 Request logging and audit trails  
🔲 Two-factor authentication (2FA)  
🔲 API key management for integrations  
🔲 Data encryption at rest  
🔲 Regular security audits  

---

## Technology Stack

**Backend:**
- Node.js (Runtime)
- Express.js (Web Framework)
- jsonwebtoken (JWT)
- bcryptjs (Password Hashing)
- body-parser (Request Parser)
- cors (Cross-Origin Support)
- dotenv (Configuration)

**Database:**
- Currently: Mock in-memory database
- Recommended: MongoDB or PostgreSQL

**Development:**
- nodemon (Development Server)

**Recommended Additions:**
- Jest (Testing)
- Supertest (API Testing)
- Winston (Logging)
- Joi (Validation)
- Helmet (Security Headers)

---

## Performance Metrics

### Current State
- Mock database: Fast response times
- No database queries to optimize
- No caching mechanism

### Future Optimizations
- Database indexing on frequently queried fields
- Implement caching layer (Redis)
- Pagination for large datasets
- API response compression
- Database query optimization
- Connection pooling

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Current | Target |
|--------|---------|--------|
| API Response Time | <100ms | <100ms |
| System Uptime | N/A | 99.9% |
| User Onboarding | 3 endpoints | 1-click sign-up |
| Payment Success Rate | Mock | >99% |
| Coach Retention | Manual | Auto-tracked |
| Client Retention | N/A | >80% |
| Revenue Tracking | Manual | Real-time |

---

## User Story Examples

### Admin: Financial Management
**As an** Admin  
**I want to** see profit after deducting taxes and coach salaries  
**So that** I can understand my actual business profitability

**Acceptance Criteria:**
- ✅ View total revenue
- ✅ See tax amount deducted automatically
- ✅ See total coach salaries
- ✅ Calculate net profit automatically
- ✅ Export report to PDF

### Coach: Client Management
**As a** Coach  
**I want to** assign diet and training plans to my clients  
**So that** I can guide them effectively towards their fitness goals

**Acceptance Criteria:**
- ✅ Add multiple diet plans per client
- ✅ Create weekly training schedules
- ✅ Track client progress
- ✅ Add coaching notes
- ✅ View payment history

### Client: Subscription Management
**As a** Client  
**I want to** choose my subscription plan and pay online  
**So that** I can start my fitness journey immediately

**Acceptance Criteria:**
- ✅ View available plans
- ✅ See pricing and benefits
- ✅ Choose plan type (gym/online/hybrid)
- ✅ Make secure payment
- ✅ Get immediate access

---

## Release Checklist

### Before Production (Phase 1 - Current)
- [x] Core authentication system
- [x] User role management
- [x] Basic dashboard
- [x] Subscription system
- [x] Payment tracking
- [x] Coach management
- [x] Salary management
- [x] Profit calculation
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Database migration strategy
- [ ] Error handling guide
- [ ] Deployment guide

### For Phase 2
- [ ] Real database implementation
- [ ] Email notification system
- [ ] SMS notifications
- [ ] Payment gateway
- [ ] User documentation
- [ ] Admin manual
- [ ] Coach tutorial
- [ ] Client onboarding

---

## Conclusion

The Gym & Online Coaching Platform has a solid foundation with:
- ✅ Working authentication system
- ✅ Three distinct user roles with appropriate permissions
- ✅ Financial tracking and profit calculation
- ✅ Coach salary management
- ✅ Subscription and payment handling
- ✅ Clean code architecture

**Critical Action Item:** Fix duplicate export in `adminController.js`

The platform is ready for:
1. Database integration (replace mock database)
2. Testing and QA
3. Deployment to staging environment
4. Phase 2 feature development

**Estimated Timeline to MVP:** 2-3 weeks with dedicated team
**Estimated Timeline to Phase 2:** 1-2 months
