# Complete Testing Checklist

## Phase 1: MongoDB Connection Testing ✅

- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user (gymapp_user)
- [ ] Copied connection string from Atlas
- [ ] Updated `.env` with correct MONGODB_URI
- [ ] Added current IP to Network Access whitelist
- [ ] Installed npm dependencies: `npm install`
- [ ] Backend connects to MongoDB: `npm start`
  - Check for "✅ MongoDB Connected Successfully" message
  - No Connection timeout/refused errors
- [ ] Seeded database: `node db/seed.js`
  - Check for "✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!"

## Phase 2: Backend API Testing ✅

### Health Check
- [ ] `GET http://localhost:5000/health`
  - Response: `{"status": "Server running", "timestamp": "..."}`

### Authentication Endpoints
- [ ] `POST /auth/signin`
  - Email: `admin@gmail.com`
  - Password: `admin123`
  - Expected: JWT token in response

- [ ] `POST /auth/login-check`
  - Email: `admin@gmail.com`
  - Expected: `{"exists": true, "role": "admin"}`

### Admin Endpoints (use Bearer token from login)
- [ ] `GET /admin/dashboard`
  - Header: `Authorization: Bearer <token>`
  - Expected: `{"status": "success", "message": "Admin dashboard access granted"}`

- [ ] `GET /admin/stats/users`
  - Expected: Returns count of users

- [ ] `GET /admin/stats/coaches`
  - Expected: Returns count of coaches

- [ ] `GET /admin/stats/clients`
  - Expected: Returns count of clients

### Coach Endpoints (login with john@coach.com)
- [ ] `GET /coach/dashboard`
  - Expected: Coach dashboard access

- [ ] `GET /coach/clients`
  - Expected: List of coach's clients

### Client Endpoints (login with jane@client.com)
- [ ] `GET /client/dashboard`
  - Expected: Client dashboard access

- [ ] `GET /client/welcome`
  - Expected: Welcome page with user info

## Phase 3: Frontend Integration Testing

### Environment Setup
- [ ] Created `/Frontend/Gym - Copy - Copy - Copy/.env.local`
  - Content: `VITE_API_URL=http://localhost:5000`

### Login Page Integration
- [ ] Updated `LoginPage.tsx` to call backend API
  - Removed hardcoded navigation
  - Implement actual API call to `/auth/signin`
  - Store JWT token in localStorage
  - Redirect based on role

- [ ] Test login with credentials:
  - admin@gmail.com / admin123 → should redirect to `/admin/dashboard`
  - john@coach.com / admin123 → should redirect to `/coach/dashboard`
  - jane@client.com / admin123 → should redirect to `/client/welcome`

### Dashboard Pages Integration
- [ ] Admin Dashboard
  - [ ] Fetch and display user stats
  - [ ] Show coaches list
  - [ ] Show clients list
  - [ ] Display payments/reports

- [ ] Coach Dashboard
  - [ ] Display list of assigned clients
  - [ ] Add diet plan functionality
  - [ ] Add training plan functionality
  - [ ] View client progress

- [ ] Client Dashboard
  - [ ] Display welcome message
  - [ ] Show subscription status
  - [ ] Browse subscription plans
  - [ ] Make payment and update subscription
  - [ ] View workout schedule
  - [ ] Update progress tracking

## Phase 4: Complete End-to-End Testing

### User Journey 1: Admin Functions
```
1. Login as admin@gmail.com
2. View dashboard stats (are they correct?)
3. Add new coach
4. Add new client
5. Approve pending coach
6. View payments/profits
7. Generate reports
```

### User Journey 2: Coach Flow
```
1. Login as john@coach.com
2. View assigned clients
3. Add diet plan for client
4. Add training plan for week 1
5. Add progress notes for client
6. View client progress (should show all plans and notes)
```

### User Journey 3: Client Flow
```
1. Login as jane@client.com
2. View welcome page
3. Browse subscription plans
4. Select a plan (e.g., "Basic Plan" - $50)
5. Complete payment
6. Verify subscription is active
7. View assigned workout plans
8. Update own progress (diet, workout)
9. Verify progress is saved
```

### User Journey 4: Authentication Flow
```
1. Logout from any account
2. Try logging in with invalid credentials
3. Should see error message
4. Try registering new coach account
5. Should get "pending approval" message
```

## Phase 5: Data Verification

### MongoDB Atlas UI Verification
- [ ] Login to MongoDB Atlas
- [ ] Navigate to `Database` → `Collections` → `gym_app`
- [ ] Verify collections exist:
  - [ ] `users` (should have 3+ documents)
  - [ ] `coaches` (should have 1+ documents)
  - [ ] `clients` (should have 1+ documents)
  - [ ] `subscriptionplans` (should have 3 documents)
  - [ ] `payments` (documents added after test payments)

- [ ] Sample documents:
  - [ ] Admin user has role: "admin", status: "active"
  - [ ] Coach user has role: "coach", status: "active"
  - [ ] Client user has role: "client", status: "active"
  - [ ] Client has subscription with status: "active"

## Phase 6: Error Handling Testing

### Test Error Scenarios
- [ ] Submit empty login form
  - Expected: Error message "Email and password required"

- [ ] Login with non-existent email
  - Expected: Error message "Invalid credentials"

- [ ] Login with wrong password
  - Expected: Error message "Invalid credentials"

- [ ] Access admin endpoint without token
  - Expected: 401 Unauthorized

- [ ] Access admin endpoint with invalid token
  - Expected: 403 Forbidden

- [ ] Create user with duplicate email
  - Expected: Error "Email already registered"

- [ ] Request with missing required fields
  - Expected: Appropriate error messages

## Phase 7: Performance & Load Testing

- [ ] Server response times are under 1 second
- [ ] No console errors in browser DevTools
- [ ] No console errors in terminal
- [ ] Database queries are efficient
- [ ] No memory leaks
- [ ] Handles multiple simultaneous requests

## Phase 8: Security Testing

- [ ] JWT tokens expire after 7 days
- [ ] Passwords are properly hashed
- [ ] User cannot access other users' data
- [ ] Coaches can only access their assigned clients
- [ ] Admins have full access
- [ ] No sensitive data exposed in API responses
- [ ] CORS is properly configured

---

## Testing Tools

### Recommended Tools
- **Postman**: API testing with collections
- **Thunder Client**: Lightweight REST client
- **Browser DevTools**: Network inspection, localStorage
- **MongoDB Atlas UI**: Direct database verification
- **VS Code REST Client**: Built-in HTTP testing

### Quick Test Command
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

---

## Success Criteria

### All tests pass when:
✅ Backend connects to MongoDB successfully
✅ All API endpoints respond correctly
✅ Frontend makes API calls instead of mocked data
✅ Authentication works end-to-end
✅ Data persists in MongoDB
✅ No errors in console
✅ User roles/permissions work correctly
✅ All CRUD operations work

---

## Next Steps After Testing

1. [ ] Deploy backend to production (Heroku, Railway, etc.)
2. [ ] Deploy frontend to hosting (Vercel, Netlify, etc.)
3. [ ] Update API URLs for production
4. [ ] Set up monitoring and logging
5. [ ] Configure backups for MongoDB Atlas
6. [ ] Implement additional features (email verification, etc.)
7. [ ] Add payment integration (Stripe, PayPal)
8. [ ] Set up automated testing (Jest, Cypress)

---

**Ready to test? Start with Phase 1 above! 🚀**
