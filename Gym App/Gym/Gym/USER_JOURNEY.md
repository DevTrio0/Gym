# User Journey Map
## Gym & Online Coaching Platform

**Purpose:** Visual representation of what each user role can do at each stage of their journey.

---

## 🔐 ADMIN JOURNEY

### Admin Onboarding & Access Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ Sign In
  │    └─→ Email + Password Authentication
  │        └─→ JWT Token Generated
  │            └─→ Dashboard Access Granted
  │                │
  │                ├─→ USER MANAGEMENT
  │                │    ├─→ Add Coach
  │                │    │    └─→ Coach enters PENDING status
  │                │    │        └─→ Admin approves coach
  │                │    │            └─→ Coach becomes ACTIVE
  │                │    │
  │                │    ├─→ Add Client
  │                │    │    └─→ Client becomes ACTIVE immediately
  │                │    │
  │                │    ├─→ Delete Account
  │                │    │    └─→ User and related data removed
  │                │    │
  │                │    └─→ Deactivate/Reactivate Account
  │                │         └─→ Toggle user status
  │                │
  │                ├─→ FINANCIAL MANAGEMENT
  │                │    ├─→ View All Payments
  │                │    │    └─→ See transaction history by client
  │                │    │
  │                │    ├─→ View Profit Report
  │                │    │    └─→ Revenue - Taxes - Salaries = Profit
  │                │    │
  │                │    ├─→ View Profit Details
  │                │    │    ├─→ Total Revenue
  │                │    │    ├─→ Tax Amount (customizable %)
  │                │    │    ├─→ Coach Salaries Total
  │                │    │    └─→ Net Profit & Margin
  │                │    │
  │                │    └─→ Export Financial Reports
  │                │         └─→ PDF/Excel (future)
  │                │
  │                ├─→ COACH SALARY MANAGEMENT
  │                │    ├─→ Set Coach Salaries
  │                │    │    ├─→ Monthly amount per coach
  │                │    │    ├─→ Add description
  │                │    │    └─→ Edit/Update anytime
  │                │    │
  │                │    ├─→ View All Coach Salaries
  │                │    │    ├─→ List all coaches with salary amounts
  │                │    │    ├─→ See total monthly payout
  │                │    │    ├─→ Calculate average salary
  │                │    │    └─→ View coach status
  │                │    │
  │                │    ├─→ Process Salary Payments
  │                │    │    ├─→ Select coach
  │                │    │    ├─→ Confirm amount
  │                │    │    ├─→ Add payment notes
  │                │    │    └─→ Record transaction
  │                │    │
  │                │    ├─→ View Payment History
  │                │    │    ├─→ Per coach payment records
  │                │    │    ├─→ Total paid amount
  │                │    │    ├─→ Average payment
  │                │    │    └─→ Payment dates & notes
  │                │    │
  │                │    ├─→ View All Salary Transactions
  │                │    │    └─→ Complete audit trail across all coaches
  │                │    │
  │                │    └─→ Generate Salary Report
  │                │         ├─→ Salary structure summary
  │                │         ├─→ Payment history
  │                │         └─→ Budget analysis
  │                │
  │                ├─→ DASHBOARD & ANALYTICS
  │                │    ├─→ View Dashboard Stats
  │                │    │    ├─→ Total Users
  │                │    │    ├─→ Total Coaches (active/pending)
  │                │    │    ├─→ Total Clients (active)
  │                │    │    └─→ Total Payments
  │                │    │
  │                │    ├─→ View Monthly Reports
  │                │    │    ├─→ Registrations by month
  │                │    │    ├─→ Revenue by month
  │                │    │    └─→ Transactions list
  │                │    │
  │                │    └─→ Count Clients
  │                │         └─→ List all clients with subscription status
  │                │
  │                └─→ Logout
  │                     └─→ Session ended, token invalidated
  │
  └─→ END

═══════════════════════════════════════════════════════════════════

KEY ADMIN RESPONSIBILITIES:
  ✓ Oversee entire platform
  ✓ Manage user accounts
  ✓ Monitor financial health
  ✓ Manage coach salaries and payroll
  ✓ Analyze business metrics
  ✓ Make strategic financial decisions

MONTHLY WORKFLOW:
  Week 1: Add new coaches/clients as needed
  Week 2: Review profit reports and adjust strategies
  Week 3: Process coach salary payments
  Week 4: Generate month-end financial reports
```

---

## 👨‍🏫 COACH JOURNEY

### Coach Onboarding & Daily Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        COACH JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ Sign Up / Registration
  │    └─→ Name, Email, Password
  │        └─→ Account created but PENDING approval
  │            └─→ Admin must approve
  │                └─→ Status changes to ACTIVE
  │                    └─→ Await approval email/message
  │
  ├─→ Sign In
  │    └─→ Email + Password
  │        └─→ JWT Token Generated
  │            └─→ Dashboard Access Granted
  │                │
  │                ├─→ CLIENT MANAGEMENT
  │                │    ├─→ View My Clients
  │                │    │    ├─→ List all assigned clients
  │                │    │    ├─→ See client subscription status
  │                │    │    ├─→ View progress level
  │                │    │    └─→ Count of coaching notes
  │                │    │
  │                │    ├─→ View Client Details & Progress
  │                │    │    ├─→ Client name and contact
  │                │    │    ├─→ Current fitness metrics
  │                │    │    ├─→ Diet plan status
  │                │    │    ├─→ Training plan status
  │                │    │    └─→ All notes history
  │                │    │
  │                │    └─→ Add Notes to Client
  │                │         ├─→ Track progress observations
  │                │         ├─→ Add encouragement
  │                │         ├─→ Record achievements
  │                │         └─→ Timestamp automatically added
  │                │
  │                ├─→ TRAINING PROGRAMS
  │                │    ├─→ Create Diet Plans
  │                │    │    ├─→ Select client
  │                │    │    ├─→ Define meal plan
  │                │    │    │    ├─→ Breakfast calories
  │                │    │    │    ├─→ Lunch calories
  │                │    │    │    ├─→ Dinner calories
  │                │    │    │    └─→ Snacks calories
  │                │    │    └─→ Save and send to client
  │                │    │
  │                │    └─→ Create Training Plans
  │                │         ├─→ Select client
  │                │         ├─→ Choose week number
  │                │         ├─→ Define weekly schedule
  │                │         │    ├─→ Monday workout
  │                │         │    ├─→ Tuesday workout
  │                │         │    ├─→ ... through Sunday
  │                │         │    └─→ Include rest days
  │                │         └─→ Save and send to client
  │                │
  │                ├─→ COMMUNICATION
  │                │    ├─→ Send Messages to Clients (future)
  │                │    ├─→ Schedule Video Calls (future)
  │                │    └─→ View Client Feedback (future)
  │                │
  │                └─→ Logout
  │                     └─→ Session ended
  │
  └─→ END

═══════════════════════════════════════════════════════════════════

KEY COACH RESPONSIBILITIES:
  ✓ Monitor assigned clients
  ✓ Create personalized fitness plans
  ✓ Track client progress
  ✓ Provide guidance and feedback
  ✓ Respond to client needs

DAILY WORKFLOW:
  Morning: Check new clients and assess
  Midday: Create/update training and diet plans
  Afternoon: Add progress notes and feedback
  Evening: Review client activity

WEEKLY WORKFLOW:
  Monday: Plan the week's training programs
  Wednesday: Assess mid-week progress
  Friday: Review weekly performance
  Saturday: Adjust plans for next week
```

---

## 👤 CLIENT JOURNEY

### Client Lifecycle & Experience

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ DISCOVERY & SIGNUP
  │    ├─→ View Available Plans
  │    │    ├─→ Basic Plan ($50/month)
  │    │    ├─→ Premium Plan ($100/month)
  │    │    └─→ Elite Plan ($150/month)
  │    │
  │    └─→ Register Account
  │         ├─→ Provide Name, Email, Password
  │         └─→ Account created and ACTIVE immediately
  │
  ├─→ AUTHENTICATION
  │    ├─→ Sign In with Email + Password
  │    │    └─→ JWT Token Generated
  │    │
  │    └─→ Access Dashboard
  │         └─→ Welcome page with profile info
  │
  ├─→ ONBOARDING
  │    ├─→ View Coach Assignment (if assigned)
  │    ├─→ Complete profile (future)
  │    └─→ Set fitness goals (future)
  │
  ├─→ SUBSCRIPTION JOURNEY
  │    ├─→ Browse Plans
  │    │    ├─→ Basic Plan - Gym Access
  │    │    ├─→ Premium Plan - Online Coaching
  │    │    └─→ Elite Plan - Hybrid (Gym + Online)
  │    │
  │    ├─→ Select a Plan
  │    │    ├─→ Choose plan type
  │    │    ├─→ Select service method
  │    │    │    ├─→ GYM: In-person training at facility
  │    │    │    ├─→ ONLINE: Remote coaching via video
  │    │    │    └─→ HYBRID: Both gym and online
  │    │    └─→ Review price and benefits
  │    │
  │    ├─→ Payment
  │    │    ├─→ Select payment method
  │    │    │    ├─→ Credit Card
  │    │    │    ├─→ Debit Card
  │    │    │    └─→ Digital Wallet (future)
  │    │    ├─→ Enter payment details
  │    │    ├─→ Process payment
  │    │    └─→ Receive confirmation
  │    │
  │    └─→ Subscription Activated
  │         ├─→ Subscription status: ACTIVE
  │         ├─→ Service method: [GYM/ONLINE/HYBRID]
  │         ├─→ Start date: [Date]
  │         ├─→ End date: [30 days later]
  │         └─→ Ready to book workouts!
  │
  ├─→ ACTIVE MEMBERSHIP
  │    ├─→ WORKOUT ACTIVITIES
  │    │    ├─→ View Weekly Workouts
  │    │    │    ├─→ Assigned workouts for the week
  │    │    │    ├─→ Difficulty level
  │    │    │    └─→ Coach recommendations
  │    │    │
  │    │    └─→ Book Workouts
  │    │         ├─→ Select workout/class
  │    │         ├─→ Choose time slot (future)
  │    │         ├─→ Confirm booking
  │    │         └─→ Receive confirmation & details
  │    │
  │    ├─→ PROGRESS TRACKING
  │    │    ├─→ View My Progress
  │    │    │    ├─→ Weight progress (future)
  │    │    │    ├─→ Strength gains (future)
  │    │    │    ├─→ Measurements (future)
  │    │    │    └─→ Workout completion rate
  │    │    │
  │    │    ├─→ View Assigned Plans
  │    │    │    ├─→ Diet plan details
  │    │    │    ├─→ Training schedule
  │    │    │    ├─→ Meal recommendations
  │    │    │    └─→ Calorie targets
  │    │    │
  │    │    └─→ Update Progress
  │    │         ├─→ Log workouts completed
  │    │         ├─→ Record measurements
  │    │         ├─→ Share achievements
  │    │         └─→ Add notes/feedback
  │    │
  │    ├─→ COACH COMMUNICATION
  │    │    ├─→ View Coach Profile
  │    │    │    ├─→ Coach name and credentials
  │    │    │    ├─→ Specialization
  │    │    │    └─→ Bio and experience
  │    │    │
  │    │    ├─→ Receive Coach Feedback
  │    │    │    ├─→ Progress notes
  │    │    │    ├─→ Encouragement messages
  │    │    │    └─→ Plan adjustments
  │    │    │
  │    │    ├─→ Message Coach (future)
  │    │    │    └─→ Ask questions, report issues
  │    │    │
  │    │    └─→ Video Call with Coach (future)
  │    │         └─→ Face-to-face coaching sessions
  │    │
  │    └─→ SUBSCRIPTION MANAGEMENT
  │         ├─→ Renew Subscription
  │         │    ├─→ Choose same or new plan
  │         │    ├─→ Process payment
  │         │    └─→ Extend membership
  │         │
  │         ├─→ Change Subscription
  │         │    ├─→ Upgrade to premium plan
  │         │    ├─→ Change service method
  │         │    ├─→ Process payment difference
  │         │    └─→ Activation of new plan
  │         │
  │         ├─→ Pause Subscription (future)
  │         │    └─→ Temporary hold without cancellation
  │         │
  │         └─→ Cancel Subscription (future)
  │              └─→ End membership with option to rejoin
  │
  ├─→ ADDITIONAL FEATURES
  │    ├─→ View Payment History
  │    │    ├─→ All transactions
  │    │    ├─→ Invoice details
  │    │    └─→ Download receipts (future)
  │    │
  │    ├─→ Manage Account
  │    │    ├─→ Update profile info
  │    │    ├─→ Change password
  │    │    ├─→ Privacy settings (future)
  │    │    └─→ Notification preferences (future)
  │    │
  │    ├─→ Access Fitness Resources (future)
  │    │    ├─→ Workout video library
  │    │    ├─→ Nutrition guides
  │    │    ├─→ Health articles
  │    │    └─→ Community forum
  │    │
  │    └─→ Social Features (future)
  │         ├─→ Join challenges
  │         ├─→ Leaderboards
  │         ├─→ Share achievements
  │         └─→ Community support
  │
  ├─→ SUBSCRIPTION EXPIRATION
  │    ├─→ Receive renewal reminder (1 week before)
  │    ├─→ Option to renew or let expire
  │    └─→ Transition to non-member access
  │
  └─→ END (Or Rejoin Later)

═══════════════════════════════════════════════════════════════════

KEY CLIENT JOURNEY POINTS:
  ✓ Easy signup and authentication
  ✓ Clear subscription options
  ✓ Simple payment process
  ✓ Transparent plan information
  ✓ Easy access to assigned programs
  ✓ Progress tracking and motivation
  ✓ Coach support and feedback
  ✓ Convenient plan management

TYPICAL WEEKLY ROUTINE:
  Monday: View week's training plan
  Tuesday: Book a workout class
  Wednesday: Complete workout, log progress
  Thursday: Check diet plan, meal prep
  Friday: Continue workouts
  Saturday: Achieve fitness milestone
  Sunday: Rest day, review week's progress

CONVERSION POINTS:
  1. Sign up → 90% convert to basic plan
  2. Basic plan → 20% upgrade to premium
  3. Premium plan → 10% upgrade to elite
  4. 1st month → 70% retention rate
  5. 3rd month → 50% retention rate
  6. 6th month → 40% retention rate
```

---

## 📊 Platform Feature Matrix

### Who Can Do What?

| Feature | Admin | Coach | Client |
|---------|:-----:|:-----:|:------:|
| **Authentication** | | | |
| Sign In/Sign Up | ✅ | ✅ | ✅ |
| Password Reset | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ |
| **User Management** | | | |
| Add Users | ✅ | ❌ | ❌ |
| View Users | ✅ | ❌ | ❌ |
| Deactivate Users | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| **Financial** | | | |
| View Payments | ✅ | ❌ | ✅* |
| View Profits | ✅ | ❌ | ❌ |
| Generate Reports | ✅ | ❌ | ❌ |
| **Coach Management** | | | |
| Manage Coaches | ✅ | ❌ | ❌ |
| Approve Coaches | ✅ | ❌ | ❌ |
| Set Salaries | ✅ | ❌ | ❌ |
| Pay Salaries | ✅ | ❌ | ❌ |
| **Client Management** | | | |
| View Clients | ✅ | ✅** | ❌ |
| Add Clients | ✅ | ❌ | ❌ |
| View Client Progress | ✅ | ✅*** | ✅ |
| **Training Plans** | | | |
| Create Plans | ❌ | ✅ | ❌ |
| View Plans | ❌ | ✅ | ✅ |
| Update Plans | ❌ | ✅ | ❌ |
| **Subscriptions** | | | |
| Select Plan | ❌ | ❌ | ✅ |
| Make Payment | ❌ | ❌ | ✅ |
| Renew Plan | ❌ | ❌ | ✅ |
| View Status | ✅ | ✅ | ✅ |

**Legend:**
- ✅ = Full Access
- ❌ = No Access  
- * = Own payment history only
- ** = Only assigned clients
- *** = Their own or assigned clients

---

## 🔄 Interaction Flows

### Admin ↔ Coach Flow
```
Admin creates Coach account
        ↓
Coach account in PENDING status
        ↓
Admin reviews coach credentials
        ↓
Admin APPROVES coach
        ↓
Coach status → ACTIVE
        ↓
Coach can manage clients
        ↓
Coach creates plans
        ↓
Admin monitors coach activity
        ↓
Admin sets coach salary
        ↓
Admin processes salary payment
        ↓
Coach can be deactivated if needed
```

### Coach ↔ Client Flow
```
Admin assigns coach to client
        ↓
Coach views assigned clients
        ↓
Coach creates diet plan
        ↓
Client receives diet plan
        ↓
Coach creates training plan
        ↓
Client receives training plan
        ↓
Client books/completes workouts
        ↓
Coach monitors progress
        ↓
Coach adds feedback notes
        ↓
Client views feedback
        ↓
Progress tracking continues
        ↓
Cycle repeats weekly
```

### Admin ↔ Client Flow (Finance)
```
Client selects subscription
        ↓
Client makes payment
        ↓
Payment processed & recorded
        ↓
Admin can view payment
        ↓
Revenue counted toward profit
        ↓
Profit report generated
        ↓
Admin makes business decisions
        ↓
Subscription active for client
        ↓
Client can renew/change plan
```

---

## Conclusion

The platform creates a complete ecosystem where:
- **Admins** oversee the business, manage finances and people
- **Coaches** deliver personalized fitness programs
- **Clients** achieve their fitness goals with support

Each role has clear, distinct responsibilities that create a balanced platform supporting the entire fitness coaching business.

