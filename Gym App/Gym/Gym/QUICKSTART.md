# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start the Server

```bash
npm start
```

You should see:
```
✅ Server is running on http://localhost:5000
📍 Coach API: http://localhost:5000/coach
📍 Admin API: http://localhost:5000/admin
📍 Client API: http://localhost:5000/client
```

## Step 3: Test the API

### Option A: Using cURL

#### 1. Load Frontend
```bash
curl http://localhost:5000/coach/start
```

#### 2. Sign In as Coach
```bash
curl -X POST http://localhost:5000/coach/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@coach.com",
    "password": "admin123"
  }'
```

You'll receive a token like:
```json
{
  "status": "success",
  "message": "coach signed in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJyb2xlIjoiY29hY2giLCJpYXQiOjE3MDc0MTA4MDAsImV4cCI6MTcwODAxNDgwMH0...",
  "user": {
    "id": "user_1",
    "name": "John Coach",
    "email": "john@coach.com",
    "role": "coach"
  }
}
```

#### 3. Get Clients (Use the token from step 2)
```bash
curl http://localhost:5000/coach/dashboard/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Sign In as Admin
```bash
curl -X POST http://localhost:5000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin123"
  }'
```

#### 5. Get Admin Dashboard
```bash
curl http://localhost:5000/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

#### 6. Sign In as Client
```bash
curl -X POST http://localhost:5000/client/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@client.com",
    "password": "admin123"
  }'
```

#### 7. Get Client Progress
```bash
curl http://localhost:5000/client/dashboard/progress \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN_HERE"
```

### Option B: Using Postman

1. **Create a new Postman Collection** called "Gym API"
2. **Create shared variables** in the collection:
   - `base_url` = `http://localhost:5000`
   - `coach_token` = (will be filled after login)
   - `admin_token` = (will be filled after login)
   - `client_token` = (will be filled after login)

3. **Add requests** following the structure in the README.md file

### Option C: Using VS Code Extensions

Install the "Thunder Client" or "REST Client" extension for VS Code

Create `test.rest` file:
```rest
### Load Frontend - Coach
GET http://localhost:5000/coach/start

### Sign In - Coach
POST http://localhost:5000/coach/auth/signin
Content-Type: application/json

{
  "email": "john@coach.com",
  "password": "admin123"
}

### Sign In - Admin
POST http://localhost:5000/admin/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "admin123"
}

### Sign In - Client
POST http://localhost:5000/client/auth/signin
Content-Type: application/json

{
  "email": "jane@client.com",
  "password": "admin123"
}

### Get Coach Clients
GET http://localhost:5000/coach/dashboard/clients
Authorization: Bearer YOUR_TOKEN_HERE

### Get Admin Dashboard
GET http://localhost:5000/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE

### Get Client Progress
GET http://localhost:5000/client/dashboard/progress
Authorization: Bearer YOUR_CLIENT_TOKEN_HERE

### Get Client Welcome
GET http://localhost:5000/client/welcome
Authorization: Bearer YOUR_CLIENT_TOKEN_HERE
```

Then click "Send Request" above each request.

## Default Test Accounts

### Admin
```
Email: admin@gmail.com
Password: admin123
```

### Coach
```
Email: john@coach.com
Password: admin123
```

### Client
```
Email: jane@client.com
Password: admin123
```

## Common Workflows

### Workflow 1: Create a New Coach (Admin)

1. Sign in as admin
2. Get the admin token
3. Use it to call:
```bash
curl -X POST http://localhost:5000/admin/dashboard/add-coach \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Coach",
    "email": "sarah@coach.com",
    "password": "password123"
  }'
```

### Workflow 2: Assign Diet to Client (Coach)

1. Sign in as coach
2. Get the coach token
3. Call:
```bash
curl -X POST http://localhost:5000/coach/dashboard/add-diet \
  -H "Authorization: Bearer COACH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_1",
    "dietPlan": {
      "breakfast": "500 cal - Oats with eggs",
      "lunch": "700 cal - Grilled chicken with rice",
      "dinner": "500 cal - Fish with vegetables",
      "snacks": "300 cal - Protein shake"
    }
  }'
```

### Workflow 3: Client Subscribe to Plan (Client)

1. Sign in as client
2. Get the client token
3. Select a plan:
```bash
curl -X POST http://localhost:5000/client/dashboard/subscription/select-plan \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_1",
    "method": "gym"
  }'
```

4. Make payment:
```bash
curl -X POST http://localhost:5000/client/dashboard/subscription/payment \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_1",
    "paymentMethod": "credit_card",
    "paymentDetails": {
      "cardNumber": "1234",
      "method": "gym"
    }
  }'
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change it in `.env`:
```
PORT=5001
```

### Token Invalid
- Tokens expire after 7 days (set in `.env` as `JWT_EXPIRE=7d`)
- Always include `Authorization: Bearer TOKEN` header
- Make sure the token is correct (copy-paste carefully)

### Role Access Denied
- Make sure you're logged in with the correct user role
- Coaches can't access admin endpoints
- Clients can't access coach endpoints

### Database Reset
To reset all data, simply restart the server. The mock database is in-memory.

## Next Steps

1. **Connect to a real database** - Replace the mock database in `models/database.js` with MongoDB, PostgreSQL, or MySQL
2. **Add email notifications** - Send reset links and confirmations via email
3. **Implement payment gateway** - Use Stripe or PayPal for real payments
4. **Add frontend** - Create REST client endpoints for web/mobile apps
5. **Deploy** - Use Heroku, AWS, DigitalOcean, or similar platforms

## API Documentation

For detailed API documentation, see [README.md](./README.md)
