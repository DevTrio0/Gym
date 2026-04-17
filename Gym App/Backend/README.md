# Gym & Online Coaching API

A comprehensive Node.js/Express REST API for a gym and online coaching platform with support for three user roles: **Admin**, **Coach**, and **Client**.

## Features

- 🔐 **JWT Authentication** with Bearer tokens
- 👥 **Three User Roles**: Admin, Coach, Client
- 📝 **Diet & Training Plans** management
- 💳 **Subscription Management** and payments
- 📊 **Progress Tracking** and reporting
- 🗑️ **Account Management** (create, deactivate, reactivate, delete)
- 📈 **Dashboard & Analytics** for admins
- 🔄 **Password Reset** functionality

## Project Structure

```
gym-coaching-api/
├── server.js                    # Main server entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── controllers/
│   ├── authController.js        # Authentication endpoints
│   ├── coachController.js       # Coach-specific endpoints
│   ├── adminController.js       # Admin-specific endpoints
│   └── clientController.js      # Client-specific endpoints
├── routes/
│   ├── coachRoutes.js          # Coach API routes
│   ├── adminRoutes.js          # Admin API routes
│   └── clientRoutes.js         # Client API routes
├── models/
│   └── database.js              # Mock database with sample data
├── middleware/
│   └── auth.js                  # JWT authentication middleware
└── utils/
    └── tokenUtils.js            # Token generation & password utilities
```

## Installation

1. **Clone or copy the project**
```bash
cd gym-coaching-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables** (`.env` file is already created):
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Start the server**
```bash
npm start        # Production
npm run dev      # Development with nodemon
```

The server will run on `http://localhost:5000`

## Test Credentials

All users have the same password for testing:
- **Email**: `{email}`
- **Password**: `admin123`

### Admin Account
```
Email: admin@gmail.com
Password: admin123
Role: admin
```

### Coach Account
```
Email: john@coach.com
Password: admin123
Role: coach
Status: active
```

### Client Account
```
Email: jane@client.com
Password: admin123
Role: client
Status: active
```

## API Endpoints

### Base URLs
- **Coach API**: `http://localhost:5000/coach`
- **Admin API**: `http://localhost:5000/admin`
- **Client API**: `http://localhost:5000/client`

### Authentication Flow

#### 1. Check if account exists
```javascript
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "coach@example.com"
}

Response:
{
  "exists": true,
  "message": "Please sign in",
  "role": "coach"
}
// OR
{
  "exists": false,
  "message": "Please register"
}
```

#### 2. Register (if account doesn't exist)
```javascript
POST /auth/register
Content-Type: application/json

Body (Coach/Client):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "coach" // or "client"
}

Response:
{
  "status": "success",
  "message": "Coach registered, pending approval",
  "userId": "user_12345..."
}
```

#### 3. Sign In
```javascript
POST /auth/signin
Content-Type: application/json

Body:
{
  "email": "coach@example.com",
  "password": "securePassword123"
}

Response:
{
  "status": "success",
  "message": "coach signed in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_12345...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "coach"
  }
}
```

### Coach Endpoints

#### Get Dashboard Clients
```javascript
GET /coach/dashboard/clients
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "clients": [
    {
      "id": "client_1",
      "name": "Jane Client",
      "email": "jane@client.com",
      "progress": "80%",
      "subscription": "active",
      "notes": 2
    }
  ]
}
```

#### Add Diet Plan
```javascript
POST /coach/dashboard/add-diet
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "clientId": "client_1",
  "dietPlan": {
    "breakfast": "500 cal",
    "lunch": "600 cal",
    "dinner": "500 cal",
    "snacks": "200 cal"
  }
}

Response:
{
  "status": "success",
  "message": "Diet plan added successfully",
  "dietId": "diet_12345..."
}
```

#### Add Training Plan
```javascript
POST /coach/dashboard/add-training
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "clientId": "client_1",
  "week": 1,
  "trainingPlan": {
    "monday": "Chest & Triceps",
    "tuesday": "Back & Biceps",
    "wednesday": "Rest",
    "thursday": "Legs",
    "friday": "Shoulders",
    "saturday": "Full Body",
    "sunday": "Rest"
  }
}

Response:
{
  "status": "success",
  "message": "Training plan added successfully",
  "trainingId": "training_12345..."
}
```

#### Add Client Note
```javascript
POST /coach/dashboard/clients/{clientId}/add-note
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "note": "Jane is progressing well with cardio exercises"
}

Response:
{
  "status": "success",
  "message": "Note added successfully",
  "noteId": "note_12345..."
}
```

#### Get Client Progress
```javascript
GET /coach/dashboard/clients/{clientId}/progress
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "client": {
    "id": "client_1",
    "name": "Jane Client",
    "email": "jane@client.com",
    "progress": {
      "dietProgress": "Good",
      "workoutProgress": "80%",
      "notes": "Progressing well"
    },
    "dietPlan": { ... },
    "trainingPlan": { ... },
    "notes": [
      {
        "id": "note_1",
        "note": "Jane is doing great",
        "createdAt": "2026-02-08T10:30:00.000Z"
      }
    ]
  }
}
```

#### Logout
```javascript
POST /coach/exit
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": "user_12345..."
}

Response:
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Admin Endpoints

#### Get Dashboard
```javascript
GET /admin/dashboard
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Dashboard loaded",
  "dashboard": {
    "totalUsers": 3,
    "totalCoaches": 1,
    "totalClients": 1,
    "totalPayments": 50,
    "stats": {
      "activeCoaches": 1,
      "pendingCoaches": 0,
      "activeClients": 1
    }
  }
}
```

#### Add Coach
```javascript
POST /admin/dashboard/add-coach
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "name": "Mike Coach",
  "email": "mike@coach.com",
  "password": "securePassword123"
}

Response:
{
  "status": "success",
  "message": "Coach added (pending approval)",
  "coachId": "coach_12345..."
}
```

#### Add Client
```javascript
POST /admin/dashboard/add-client
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "name": "Sarah Client",
  "email": "sarah@client.com",
  "password": "securePassword123"
}

Response:
{
  "status": "success",
  "message": "Client added successfully",
  "clientId": "client_12345..."
}
```

#### Approve Coach
```javascript
PUT /admin/dashboard/subscription/approve
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "coachId": "coach_12345..."
}

Response:
{
  "status": "success",
  "message": "Coach account approved",
  "coachStatus": "active"
}
```

#### Deactivate Account
```javascript
PUT /admin/dashboard/deactivate-account
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": "user_12345...",
  "role": "client"  // or "coach"
}

Response:
{
  "status": "success",
  "message": "Account deactivated successfully"
}
```

#### Delete Account
```javascript
DELETE /admin/dashboard/delete-account
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": "user_12345...",
  "role": "client"  // or "coach"
}

Response:
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

#### Get Monthly Reports
```javascript
GET /admin/dashboard/reports/monthly?month=2&year=2026
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "reports": [
    {
      "month": 2,
      "year": 2026,
      "totalRegistrations": 3,
      "totalCoaches": 1,
      "totalClients": 1,
      "totalRevenue": 50,
      "transactions": [...]
    }
  ]
}
```

#### Get Payments
```javascript
GET /admin/dashboard/payments
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "payments": [
    {
      "id": "payment_1",
      "clientId": "client_1",
      "amount": 50,
      "method": "credit_card",
      "status": "completed",
      "date": "2026-02-08T10:30:00.000Z"
    }
  ]
}
```

#### Get Profits
```javascript
GET /admin/dashboard/profits
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "profits": 50,
  "currency": "USD"
}
```

#### Count Clients
```javascript
GET /admin/dashboard/clients/count
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "clients": [
    {
      "id": "client_1",
      "name": "Jane Client",
      "email": "jane@client.com",
      "status": "active"
    }
  ],
  "totalCount": 1
}
```

### Client Endpoints

#### Welcome Page
```javascript
GET /client/welcome
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Welcome page loaded",
  "user": {
    "id": "client_1",
    "name": "Jane Client",
    "email": "jane@client.com",
    "subscription": {
      "planId": "plan_1",
      "method": "gym",
      "startDate": "2026-02-08T10:30:00.000Z",
      "endDate": "2026-03-10T10:30:00.000Z",
      "status": "active"
    }
  }
}
```

#### Select Subscription Plan
```javascript
POST /client/dashboard/subscription/select-plan
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "planId": "plan_1",
  "method": "gym"  // or "online", "hybrid"
}

Response:
{
  "status": "success",
  "message": "Plan selected, proceed to payment",
  "plan": {
    "id": "plan_1",
    "name": "Basic Plan",
    "price": 50,
    "duration": 30,
    "method": "gym"
  }
}
```

#### Make Payment
```javascript
POST /client/dashboard/subscription/payment
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "planId": "plan_1",
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "****1234",
    "method": "gym"
  }
}

Response:
{
  "status": "success",
  "message": "Payment confirmed",
  "paymentId": "payment_12345...",
  "subscription": {
    "planId": "plan_1",
    "method": "gym",
    "startDate": "2026-02-08T10:30:00.000Z",
    "endDate": "2026-03-10T10:30:00.000Z",
    "status": "active"
  }
}
```

#### Book Workout
```javascript
POST /client/dashboard/book-workout
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "workoutId": "training_1",
  "agree": true
}

Response:
{
  "status": "success",
  "message": "Workout booked successfully",
  "workoutId": "training_1"
}
```

#### Get Weekly Workouts
```javascript
GET /client/dashboard/workout-week?weekId=1
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "workouts": [
    {
      "id": "training_1",
      "week": 1,
      "name": "Chest & Triceps",
      "details": "Chest & Triceps"
    }
  ]
}
```

#### Get Progress
```javascript
GET /client/dashboard/progress
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "progress": {
    "dietProgress": "Good",
    "workoutProgress": "80%",
    "notes": "Progressing well"
  }
}
```

#### Update Progress
```javascript
POST /client/dashboard/progress/update
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "dietProgress": "Excellent",
  "workoutProgress": "85%",
  "notes": "Great improvements in cardio"
}

Response:
{
  "status": "success",
  "message": "Progress updated",
  "progress": {
    "dietProgress": "Excellent",
    "workoutProgress": "85%",
    "notes": "Great improvements in cardio"
  }
}
```

#### Renew/Change Subscription
```javascript
POST /client/dashboard/subscription/renew-or-change
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "newPlanId": "plan_2"
}

Response:
{
  "status": "success",
  "message": "Subscription updated",
  "subscription": { ... }
}
```

#### Logout
```javascript
POST /client/exit
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": "user_12345..."
}

Response:
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## Password Reset Flow

### 1. Request Password Reset
```javascript
POST /coach/auth/forgetpassword
Content-Type: application/json

Body:
{
  "email": "coach@example.com"
}

Response:
{
  "status": "success",
  "message": "Reset link sent to your email",
  "resetToken": "reset_1707410800000_0.5432..."
}
```

### 2. Reset Password
```javascript
POST /coach/auth/resetpassword
Content-Type: application/json

Body:
{
  "email": "coach@example.com",
  "newPassword": "newSecurePassword123",
  "token": "reset_1707410800000_0.5432..."
}

Response:
{
  "status": "success",
  "message": "Password updated successfully"
}
```

## Subscription Plans

The API comes with predefined subscription plans:

1. **Basic Plan** (plan_1)
   - Price: $50
   - Duration: 30 days
   - Type: gym
   - Description: Basic gym access

2. **Premium Plan** (plan_2)
   - Price: $100
   - Duration: 30 days
   - Type: online
   - Description: Online coaching with diet plan

3. **Elite Plan** (plan_3)
   - Price: $150
   - Duration: 30 days
   - Type: hybrid
   - Description: Gym + Online coaching

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  "status": "error",
  "message": "Descriptive error message"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request (missing/invalid fields)
- `401` - Unauthorized (invalid credentials)
- `402` - Payment required
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Security Notes

⚠️ **This is a development skeleton. For production:**
1. Use a real database (MongoDB, PostgreSQL, MySQL, etc.)
2. Use environment variables for sensitive data
3. Implement rate limiting
4. Add HTTPS/SSL
5. Implement proper email verification
6. Use secure password hashing (bcrypt is used, but increase salt rounds for production)
7. Add input validation and sanitization
8. Implement CORS properly for your frontend domain
9. Add logging and monitoring
10. Use httpOnly cookies for token storage instead of localStorage

## Future Enhancements

- [ ] Integration with real database
- [ ] Email verification and notifications
- [ ] Advanced payment gateway integration
- [ ] Booking and calendar system
- [ ] Video upload for workout demonstrations
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app support
- [ ] Two-factor authentication
- [ ] Refund management

## License

ISC

## Support

For questions or issues, please refer to the API endpoints documentation above.
