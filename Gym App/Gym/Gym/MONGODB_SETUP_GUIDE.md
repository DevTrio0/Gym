# MongoDB Integration Setup & Testing Guide

## ✅ What Has Been Done

### Backend Integration Complete
1. ✅ MongoDB connection setup (`/db/mongodb.js`)
2. ✅ All Mongoose schemas created (`/db/mongoModels.js`)
3. ✅ MongoDB database layer functions (`/db/mongoDatabase.js`)
4. ✅ Seed script for initial data (`/db/seed.js`)
5. ✅ Updated `server.js` to connect to MongoDB
6. ✅ Updated all three controllers:
   - `authController.js` - Authentication with MongoDB
   - `adminController.js` - Admin functions with MongoDB
   - `coachController.js` - Coach functions with MongoDB
   - `clientController.js` - Client functions with MongoDB
7. ✅ Updated `package.json` with mongoose dependency
8. ✅ Updated `.env` with MongoDB URI template

---

## 📋 Setup Instructions

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in with your account
3. Create a **new cluster** (free tier available)
4. Choose region and cluster settings
5. Wait for cluster to initialize (usually 5-10 minutes)

### Step 2: Create Database User

1. In MongoDB Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Create username and password
   - Example: `gymapp_user` / `secure_password_123`
4. Set permission to **Atlas Admin**
5. Click **Add User**

### Step 3: Get Connection String

1. Go to **Database** → **Connect**
2. Click **Connect Your Application**
3. Choose **Node.js** driver
4. Copy the connection string
5. It will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/gym_app?retryWrites=true&w=majority
```

### Step 4: Update .env File

Edit the `.env` file in `/Gym/Gym/`:

```bash
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development

# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://gymapp_user:secure_password_123@cluster0.xxxxx.mongodb.net/gym_app?retryWrites=true&w=majority
DB_NAME=gym_app
```

**IMPORTANT:** 
- Replace `gymapp_user` and `secure_password_123` with your credentials
- Replace `cluster0.xxxxx` with your actual cluster name
- Make sure to URL-encode special characters in password

### Step 5: Install Dependencies

Open terminal in the backend folder (`/Gym/Gym/`) and run:

```bash
npm install
```

This will install mongoose andall required dependencies.

### Step 6: Seed Initial Data (Optional but Recommended)

To populate the database with test data:

```bash
node db/seed.js
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📊 Database: gym_app
🔗 Connection URI: mongodb+srv://...

🌱 Starting Database Seeding...
🗑️  Clearing existing collections...
✅ Collections cleared

📋 Creating subscription plans...
✅ Created 3 subscription plans

👤 Creating admin user...
✅ Admin created: admin@gmail.com

[... more creation messages ...]

✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!

🔑 Test Credentials:
   Admin: admin@gmail.com / admin123
   Coach: john@coach.com / admin123
   Client: jane@client.com / admin123
```

---

## 🧪 Testing Guide

### 1. Start the Backend Server

```bash
cd "d:\FreeLancing\Projects\Gym App\Gym\Gym"
npm start
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📊 Database: gym_app
🔗 Connection URI: mongodb+srv://...

✅ Server is running on http://localhost:5000
📍 Coach API: http://localhost:5000/coach
📍 Admin API: http://localhost:5000/admin
📍 Client API: http://localhost:5000/client
📍 Health Check: http://localhost:5000/health
```

### 2. Test Health Check Endpoint

Open your browser or Postman and go to:
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "Server running",
  "timestamp": "2026-04-12T..."
}
```

### 3. Test Login Endpoint

**Endpoint:** `POST http://localhost:5000/auth/signin`

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Expected Response (Success):**
```json
{
  "status": "success",
  "message": "admin signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc123def456...",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "role": "admin"
  },
  "redirectTo": "/admin/dashboard"
}
```

### 4. Test Admin Dashboard Endpoint

**Endpoint:** `GET http://localhost:5000/admin/dashboard`

**Headers:**
```
Authorization: Bearer <YOUR_TOKEN_FROM_LOGIN>
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Admin dashboard access granted"
}
```

### 5. Test Statistics Endpoints

Try these endpoints with your token:

- `GET /admin/stats/users` - Total users
- `GET /admin/stats/coaches` - Total coaches
- `GET /admin/stats/clients` - Total clients
- `GET /admin/stats/payments` - Total payments

**Expected Response:**
```json
{
  "status": "success",
  "totalUsers": 3
}
```

### 6. API Testing with Postman/Thunder Client

Import the API examples file located at:
```
d:\FreeLancing\Projects\Gym App\Gym\Gym\API_EXAMPLES.http
```

This file contains pre-configured requests for all API endpoints.

---

## 🎨 Frontend Updates

### Update Frontend Environment Variables

Create or update `.env.local` in the frontend folder:
```
VITE_API_URL=http://localhost:5000
```

 Update API calls in frontend pages (currently have TODO comments):

Files to update:
- `/Frontend/Gym - Copy - Copy - Copy/src/pages/auth/LoginPage.tsx`
- `/Frontend/Gym - Copy - Copy - Copy/src/pages/auth/RegisterPage.tsx`
- All dashboard pages in the pages folder

**Example Update for LoginPage.tsx:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    // Call backend API
    const response = await fetch('http://localhost:5000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token
    localStorage.setItem('token', data.token);
    
    // Redirect to dashboard
    navigate(data.redirectTo || '/client/welcome');
  } catch (err) {
    setError(err instanceof Error ? err.message : "Invalid credentials");
    setIsLoading(false);
  }
};
```

---

## 📱 Frontend + Backend Integration Testing

### Test Complete Auth Flow

1. **Start Backend:**
   ```bash
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Login Flow:**
   - Go to `http://localhost:5173/login` (or your frontend dev URL)
   - Enter credentials: `admin@gmail.com` / `admin123`
   - Should login successfully and redirect to dashboard
   - Token should be stored in localStorage

4. **Test API Calls from Frontend:**
   - Check browser DevTools (F12) → Network tab
   - Verify API calls are going to `http://localhost:5000`
   - Check responses are successful (200 status codes)

---

## 🚑 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Check MongoDB Atlas cluster is running
- Verify connection string in `.env` is correct
- Check username/password are correct
- Ensure IP whitelist allows your IP (in Atlas → Network Access)

### Authorization Error

**Error:** `401 Unauthorized` or `Invalid token`

**Solution:**
- Make sure you're including Bearer token in Authorization header
- Token format: `Authorization: Bearer <token>`
- Token may have expired (default 7 days)
- Request new token by logging in again

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- CORS is already enabled in server.js
- Check frontend is using correct API URL
- Check if any proxy is interfering

### Database Empty

**Solution:**
- Run the seed script: `node db/seed.js`
- Or manually create test users through the API:
  ```bash
  POST /auth/register
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "client"
  }
  ```

---

## 📊 Database Verification

You can verify your MongoDB data directly:

1. Go to MongoDB Atlas
2. Click Database → Collections
3. Select `gym_app` database
4. View collections:
   - `users` - All user accounts
   - `coaches` - Coach profiles
   - `clients` - Client profiles
   - `subscriptionplans` - Plans
   - `dietplans` - Diet plans
   - `trainingplans` - Training plans
   - `clientnotes` - Coach notes
   - `payments` - Payment records

---

## ✨ What's Next

After testing:

1. **Update all frontend API calls** to use the backend API
2. **Implement token persistence** in localStorage
3. **Add protected routes** with token validation
4. **Configure proxy** for production deployment
5. **Set up error handling** for API failures
6. **Add loading states** during API calls

---

## 📞 Support & Documentation

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [API Documentation](./README.md)

---

**Backend is now MongoDB-ready. Happy testing! 🚀**
