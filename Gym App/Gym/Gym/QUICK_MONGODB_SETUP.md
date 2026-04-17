# Quick Start: Set Up MongoDB Atlas in 5 Minutes

## What You Need
- Email address
- Browser
- MongoDB Atlas account (free, no credit card required)

## Step-by-Step Setup

### 1.  Create MongoDB Atlas Account (1 minute)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Enter email, password, and create account
4. Verify your email (check spam folder!)
```

### 2. Create Free Cluster (2 minutes)
```
1. After signing in, click "Create a Deployment"
2. Select "FREE" option
3. Choose "M0 Sandbox" tier
4. Select your preferred region (closest to you)
5. Leave other settings as default
6. Click "Create Deployment"
7. Wait for cluster to initialize (5-10 minutes)
```

### 3. Create Database User (1 minute)
```
1. After cluster is created, go to left menu → "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username: gymapp_user
5. Enter password: GymApp@123456
6. Select "Built-in Role" → "Atlas Admin"
7. Click "Add User"
```

### 4. Get Connection String (1 minute)
```
1. Go to left menu → "Clusters"
2. Click your cluster "Connect"
3. Click "Drivers" (second option)
4. Select Node.js driver
5. Copy the connection string (it looks like below)
```

### 5. Update .env File (1 minute)
Edit your `.env` file and replace the MONGODB_URI:

**From:**
```
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/gym_app?retryWrites=true&w=majority
```

**To your actual URI:**
```
MONGODB_URI=mongodb+srv://gymapp_user:GymApp@123456@cluster0.xxxxx.mongodb.net/gym_app?retryWrites=true&w=majority
```

Replace:
- `cluster0.xxxxx` with your actual cluster name (from the connection string)

### 6. Allow Your IP Address (Important!)
```
1. While in MongoDB Atlas
2. Click "Network Access" on left menu
3. Click "Add IP Address"
4. Click "Add Current IP Address"
5. Click "Confirm"
```

---

## Test Connection

### Run Backend Server

```bash
cd "d:\FreeLancing\Projects\Gym App\Gym\Gym"
npm start
```

### Expected Output:
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

### If Connection Fails:
```
❌ MongoDB Connection Error:
MongoServerError: connect ECONNREFUSED

Fix:
1. Double-check password has no special characters (or properly escaped)
2. Verify IP address is whitelisted (Network Access in Atlas)
3. Wait a few minutes - cluster might still be initializing
4. Check internet connection
```

---

## Populate Database with Test Data

```bash
node db/seed.js
```

**This creates:**
- 1 Admin account: admin@gmail.com / admin123
- 1 Coach account: john@coach.com / admin123
- 1 Client account: jane@client.com / admin123
- 3 Subscription plans
- Sample diet & training plans

---

## Your Credentials Are Ready!

Once database is seeded, you can login with:

| Role   | Email               | Password  |
|--------|-------------------|-----------|
| Admin  | admin@gmail.com   | admin123  |
| Coach  | john@coach.com    | admin123  |
| Client | jane@client.com   | admin123  |

---

## Need Help?

**Connection String Issues?**
- Make sure to URL-encode special characters in password
- Use the connection string from your MongoDB Atlas, not this template

**Can't Connect?**
- Check Network Access (add your IP)
- Wait for cluster to be ready (show as green checkmark)
- Verify .env file has correct MONGODB_URI

**Database Not Seeding?**
- Make sure connection is working first
- Check console errors: `node db/seed.js`

---

**Everything Ready? Let's Test! 🚀**

Next: Run `npm start` to begin testing the API!
