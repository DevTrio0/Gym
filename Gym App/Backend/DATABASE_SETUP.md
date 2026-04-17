# Database Integration Guide

This API currently uses a **mock in-memory database** for prototyping. When you're ready to integrate a real database, follow this guide.

## Current Mock Database

The mock database is located in [models/database.js](./models/database.js) and contains:
- Users
- Coaches
- Clients
- Subscription Plans
- Diet Plans
- Training Plans
- Client Notes
- Payments
- Reset Tokens

All data is stored in memory and will be reset when the server restarts.

## Database Options

### Option 1: MongoDB (Recommended for scalability)

#### Installation
```bash
npm install mongoose
```

#### Setup Connection
Create `config/db.js`:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Update .env
```
MONGODB_URI=mongodb://localhost:27017/gym-coaching
# Or use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-coaching
```

#### Update server.js
```javascript
const connectDB = require('./config/db');

// Connect to database
connectDB();
```

#### Create Models
Create `models/userModel.js`:
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['coach', 'client', 'admin'], required: true },
  status: { type: String, enum: ['active', 'pending', 'deactivated'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

### Option 2: MySQL/MariaDB

#### Installation
```bash
npm install mysql2 sequelize
```

#### Setup Connection
Create `config/db.js`:
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
```

#### Update .env
```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=gym_coaching
```

### Option 3: PostgreSQL

#### Installation
```bash
npm install pg sequelize
```

#### Setup Connection
Create `config/db.js`:
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
```

#### Update .env
```
DB_HOST=localhost
DB_USER=postgres
DB_PASS=password
DB_NAME=gym_coaching
DB_PORT=5432
```

## Data Schema

### Users Table
```
- id (UUID/Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- role (Enum: coach, client, admin)
- status (Enum: active, pending, deactivated)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Coaches Table
```
- id (UUID/Primary Key)
- userId (Foreign Key -> Users)
- name (String)
- email (String)
- specialization (String, Optional)
- bio (String, Optional)
- status (Enum: pending, active, deactivated)
- approvedAt (DateTime, Optional)
- clients (Array/Relationship)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Clients Table
```
- id (UUID/Primary Key)
- userId (Foreign Key -> Users)
- name (String)
- email (String)
- coachId (Foreign Key -> Coaches, Optional)
- status (Enum: active, deactivated)
- dietProgress (String)
- workoutProgress (String)
- notes (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### SubscriptionPlans Table
```
- id (UUID/Primary Key)
- name (String)
- price (Decimal)
- duration (Integer - days)
- type (Enum: gym, online, hybrid)
- description (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Subscriptions Table
```
- id (UUID/Primary Key)
- clientId (Foreign Key -> Clients)
- planId (Foreign Key -> SubscriptionPlans)
- method (Enum: gym, online)
- startDate (DateTime)
- endDate (DateTime)
- status (Enum: active, expired, cancelled)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### DietPlans Table
```
- id (UUID/Primary Key)
- clientId (Foreign Key -> Clients)
- coachId (Foreign Key -> Coaches)
- plan (JSON/Object)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### TrainingPlans Table
```
- id (UUID/Primary Key)
- clientId (Foreign Key -> Clients)
- coachId (Foreign Key -> Coaches)
- weekNumber (Integer)
- plan (JSON/Object)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### ClientNotes Table
```
- id (UUID/Primary Key)
- clientId (Foreign Key -> Clients)
- coachId (Foreign Key -> Coaches)
- note (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Payments Table
```
- id (UUID/Primary Key)
- clientId (Foreign Key -> Clients)
- planId (Foreign Key -> SubscriptionPlans)
- amount (Decimal)
- method (String)
- status (Enum: pending, completed, failed)
- date (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### ResetTokens Table
```
- id (UUID/Primary Key)
- email (String)
- token (String, Unique)
- expiresAt (DateTime)
- createdAt (DateTime)
```

## Migration Path

### Step 1: Set up database connection
1. Install database driver
2. Create connection file
3. Update .env with credentials
4. Connect in server.js

### Step 2: Create models/schemas
Replace mock database functions with model queries

### Step 3: Update controllers
Replace `mockDatabase.users.find()` with `User.findById()`

### Step 4: Test each endpoint
- Start with authentication
- Move to dashboard features
- Finally test payments

### Step 5: Data migration
- Export mock data from current database
- Import into production database
- Run migrations

## Example: Converting One Controller

### Mock (Current)
```javascript
const { mockDatabase, findUserById } = require('../models/database');

const getClients = (req, res) => {
  const coachId = req.user.id;
  const coach = mockDatabase.coaches.find(c => c.userId === coachId);
  const clients = mockDatabase.clients.filter(c => c.coachId === coach.id);
  
  res.json({ status: 'success', clients });
};
```

### MongoDB
```javascript
const Coach = require('../models/coachModel');
const Client = require('../models/clientModel');

const getClients = async (req, res) => {
  try {
    const coachId = req.user.id;
    const coach = await Coach.findOne({ userId: coachId });
    
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach not found' });
    }
    
    const clients = await Client.find({ coachId: coach._id });
    
    res.json({ status: 'success', clients });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
```

## Best Practices

1. **Use Transactions** - For operations affecting multiple tables
2. **Add Indexes** - On frequently queried fields (email, userId, coachId)
3. **Use Soft Deletes** - Set status instead of deleting
4. **Cache Results** - Use Redis for dashboard queries
5. **Connection Pooling** - For better performance
6. **Backups** - Regular database backups
7. **Migrations** - Use tools like Knex or TypeORM for version control

## Testing with Different Databases

### Local Development
```bash
# Using MongoDB locally
mongod  # Start MongoDB service

# Using MySQL locally
mysql -u root -p  # Enter MySQL

# Using PostgreSQL locally
psql postgres
```

### Docker Setup
```bash
# MongoDB
docker run -d -p 27017:27017 --name gym-mongodb mongo

# MySQL
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password --name gym-mysql mysql

# PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password --name gym-postgres postgres
```

## Recommended Approach

For a **production gym platform**, I recommend:

1. **Database**: **MongoDB** or **PostgreSQL**
   - MongoDB: Better for flexible schema (workouts, diet plans stored as JSON)
   - PostgreSQL: Better for relational data with strict schemas

2. **ORM**: **Mongoose** (MongoDB) or **Sequelize** (SQL)

3. **Caching**: **Redis** for session management and frequently accessed data

4. **Backup**: Daily automated backups to cloud storage

5. **Scaling**: Consider database replication and load balancing

## Support Resources

- [MongoDB Docs](https://docs.mongodb.com/)
- [Sequelize Docs](https://sequelize.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MySQL Docs](https://dev.mysql.com/doc/)

When ready to migrate, start with one table and test thoroughly before moving to production.
