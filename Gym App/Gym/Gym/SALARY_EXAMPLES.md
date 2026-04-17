# Salary & Profit Management - Practical Examples

## Setup
Before using these examples, make sure you have:
1. An admin user logged in
2. A valid Bearer token from the login response
3. The gym API running on `http://localhost:5000`

---

## Example 1: Setting Up Coach Salaries

### Scenario
You have 3 coaches and want to set their monthly salaries.

### Coach Data
```
- John Coach (coach_1): $1,500/month
- Sarah Trainer (coach_2): $1,200/month  
- Mike Specialist (coach_3): $1,800/month
```

### API Calls

**Step 1: Set John's Salary**
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_1",
    "amount": 1500,
    "description": "Full-time strength coach"
  }'
```

**Step 2: Set Sarah's Salary**
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_2",
    "amount": 1200,
    "description": "Part-time yoga instructor"
  }'
```

**Step 3: Set Mike's Salary**
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_3",
    "amount": 1800,
    "description": "Senior nutrition specialist"
  }'
```

---

## Example 2: Viewing All Coach Salaries

### Scenario
You want to see the salary structure and total monthly payout.

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/dashboard/salary/all
```

### Response
```json
{
  "status": "success",
  "message": "Coach salaries retrieved",
  "data": {
    "salaries": [
      {
        "id": "salary_1707394200000",
        "coachId": "coach_1",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "coachStatus": "active",
        "amount": 1500,
        "description": "Full-time strength coach",
        "createdAt": "2026-02-08T10:30:00.000Z",
        "updatedAt": "2026-02-08T10:30:00.000Z"
      },
      {
        "id": "salary_1707394201000",
        "coachId": "coach_2",
        "coachName": "Sarah Trainer",
        "coachEmail": "sarah@coach.com",
        "coachStatus": "active",
        "amount": 1200,
        "description": "Part-time yoga instructor",
        "createdAt": "2026-02-08T10:31:00.000Z",
        "updatedAt": "2026-02-08T10:31:00.000Z"
      },
      {
        "id": "salary_1707394202000",
        "coachId": "coach_3",
        "coachName": "Mike Specialist",
        "coachEmail": "mike@coach.com",
        "coachStatus": "active",
        "amount": 1800,
        "description": "Senior nutrition specialist",
        "createdAt": "2026-02-08T10:32:00.000Z",
        "updatedAt": "2026-02-08T10:32:00.000Z"
      }
    ],
    "totalMonthlyPayout": 4500,
    "coachCount": 3,
    "averageSalary": 1500
  }
}
```

### Key Insights
- **Total Monthly Payout**: $4,500 across all coaches
- **Average Salary**: $1,500 per coach
- **Active Coaches**: 3

---

## Example 3: Processing Monthly Salary Payments

### Scenario
It's the end of February and you need to pay all coaches their monthly salaries.

### API Calls

**Pay John**
```bash
curl -X POST http://localhost:5000/dashboard/salary/pay \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_1",
    "amount": 1500,
    "notes": "February 2026 salary payment"
  }'
```

**Pay Sarah**
```bash
curl -X POST http://localhost:5000/dashboard/salary/pay \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_2",
    "amount": 1200,
    "notes": "February 2026 salary payment"
  }'
```

**Pay Mike**
```bash
curl -X POST http://localhost:5000/dashboard/salary/pay \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_3",
    "amount": 1800,
    "notes": "February 2026 salary payment"
  }'
```

---

## Example 4: Checking Coach Payment History

### Scenario
You want to verify that John has been paid correctly over the past months.

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:5000/dashboard/salary/history/coach_1?limit=12"
```

### Response
```json
{
  "status": "success",
  "message": "Payment history retrieved",
  "data": {
    "coachId": "coach_1",
    "coachName": "John Coach",
    "coachEmail": "john@coach.com",
    "payments": [
      {
        "id": "salary_payment_1707394300000",
        "coachId": "coach_1",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "salaryId": "salary_1707394200000",
        "amount": 1500,
        "notes": "February 2026 salary payment",
        "status": "completed",
        "paidAt": "2026-02-08T11:00:00.000Z"
      },
      {
        "id": "salary_payment_1707394300001",
        "coachId": "coach_1",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "salaryId": "salary_1707394200000",
        "amount": 1500,
        "notes": "January 2026 salary payment",
        "status": "completed",
        "paidAt": "2026-01-07T11:00:00.000Z"
      }
    ],
    "totalPaid": 3000,
    "paymentCount": 2,
    "averagePayment": 1500
  }
}
```

---

## Example 5: Understanding Profit After Taxes

### Scenario
You have:
- Total revenue from memberships: $10,000
- You need to pay taxes: 20%
- Coach salaries: $4,500
- What's your net profit?

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:5000/dashboard/profits/detail?taxPercentage=20"
```

### Response
```json
{
  "status": "success",
  "message": "Detailed profit report",
  "data": {
    "totalRevenue": 10000,
    "totalTax": 2000,
    "taxPercentage": 20,
    "totalCoachSalaries": 4500,
    "profitAfterTaxes": 3500,
    "profitMargin": "35.00",
    "breakdown": {
      "revenue": 10000,
      "taxes": 2000,
      "coachSalaries": 4500,
      "netProfit": 3500
    }
  }
}
```

### Breakdown
```
Revenue:              $10,000
Taxes (20%):          -$2,000
Coach Salaries:       -$4,500
────────────────────────────
Net Profit:           $3,500
Profit Margin:        35%
```

---

## Example 6: What If Scenario - Different Tax Rates

### Scenario
Your accountant suggests you might get a 15% tax rate with new deductions. What would your profit look like?

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:5000/dashboard/profits/detail?taxPercentage=15"
```

### Response
```json
{
  "data": {
    "totalRevenue": 10000,
    "totalTax": 1500,
    "taxPercentage": 15,
    "totalCoachSalaries": 4500,
    "profitAfterTaxes": 4000,
    "profitMargin": "40.00",
    "breakdown": {
      "revenue": 10000,
      "taxes": 1500,
      "coachSalaries": 4500,
      "netProfit": 4000
    }
  }
}
```

### Comparison
```
                20% Tax Rate    15% Tax Rate
Revenue:        $10,000         $10,000
Taxes:          -$2,000         -$1,500
Salaries:       -$4,500         -$4,500
────────────────────────────────────────
Profit:         $3,500          $4,000
Margin:         35%             40%
Difference:     +$500 extra profit
```

---

## Example 7: Generating Full Salary Report

### Scenario
It's end of month and you need a full report for your accounting department.

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/dashboard/salary/report
```

### Response
```json
{
  "status": "success",
  "message": "Salary report generated",
  "report": {
    "salaryStructure": {
      "salaries": [
        {
          "id": "salary_1707394200000",
          "coachId": "coach_1",
          "coachName": "John Coach",
          "coachEmail": "john@coach.com",
          "coachStatus": "active",
          "amount": 1500,
          "description": "Full-time strength coach",
          "createdAt": "2026-02-08T10:30:00.000Z",
          "updatedAt": "2026-02-08T10:30:00.000Z"
        },
        {
          "id": "salary_1707394201000",
          "coachId": "coach_2",
          "coachName": "Sarah Trainer",
          "coachEmail": "sarah@coach.com",
          "coachStatus": "active",
          "amount": 1200,
          "description": "Part-time yoga instructor",
          "createdAt": "2026-02-08T10:31:00.000Z",
          "updatedAt": "2026-02-08T10:31:00.000Z"
        },
        {
          "id": "salary_1707394202000",
          "coachId": "coach_3",
          "coachName": "Mike Specialist",
          "coachEmail": "mike@coach.com",
          "coachStatus": "active",
          "amount": 1800,
          "description": "Senior nutrition specialist",
          "createdAt": "2026-02-08T10:32:00.000Z",
          "updatedAt": "2026-02-08T10:32:00.000Z"
        }
      ],
      "totalMonthlyPayout": 4500,
      "coachCount": 3,
      "averageSalary": 1500
    },
    "paymentHistory": {
      "payments": [
        {
          "id": "salary_payment_1707394300000",
          "coachId": "coach_1",
          "coachName": "John Coach",
          "coachEmail": "john@coach.com",
          "salaryId": "salary_1707394200000",
          "amount": 1500,
          "notes": "February 2026 salary payment",
          "status": "completed",
          "paidAt": "2026-02-08T11:00:00.000Z"
        },
        {
          "id": "salary_payment_1707394300002",
          "coachId": "coach_2",
          "coachName": "Sarah Trainer",
          "coachEmail": "sarah@coach.com",
          "salaryId": "salary_1707394201000",
          "amount": 1200,
          "notes": "February 2026 salary payment",
          "status": "completed",
          "paidAt": "2026-02-08T11:05:00.000Z"
        },
        {
          "id": "salary_payment_1707394300004",
          "coachId": "coach_3",
          "coachName": "Mike Specialist",
          "coachEmail": "mike@coach.com",
          "salaryId": "salary_1707394202000",
          "amount": 1800,
          "notes": "February 2026 salary payment",
          "status": "completed",
          "paidAt": "2026-02-08T11:10:00.000Z"
        }
      ],
      "totalPaid": 4500,
      "paymentCount": 3,
      "uniqueCoaches": 3
    },
    "summary": {
      "totalMonthlyBudget": 4500,
      "totalPaidOut": 4500,
      "activeCoaches": 3,
      "pendingCoaches": 0,
      "generatedAt": "2026-02-08T11:15:00.000Z"
    }
  }
}
```

---

## Example 8: Monthly Profit Report

### Scenario
You want to see the monthly profit summary for your business review.

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:5000/dashboard/profits?taxPercentage=20"
```

### Response
```json
{
  "status": "success",
  "message": "Profit report generated",
  "report": {
    "overall": {
      "totalRevenue": 10000,
      "totalTax": 2000,
      "taxPercentage": 20,
      "totalCoachSalaries": 4500,
      "profitAfterTaxes": 3500,
      "profitMargin": "35.00",
      "breakdown": {
        "revenue": 10000,
        "taxes": 2000,
        "coachSalaries": 4500,
        "netProfit": 3500
      }
    },
    "monthly": {
      "revenue": 2500,
      "tax": 500,
      "taxPercentage": 20,
      "profit": -2000
    },
    "timestamp": "2026-02-08T11:20:00.000Z"
  }
}
```

---

## Example 9: All Salary Payments Transaction Report

### Scenario
You need to audit all salary payments made this month.

### API Call
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:5000/dashboard/salary-payments/all?limit=50"
```

### Use Cases
- Monthly accounting reconciliation
- Audit trail for payroll
- Financial reporting
- Coach payment verification

---

## Example 10: Error Handling

### Invalid Coach ID
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer token..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "invalid_coach_9999",
    "amount": 1000
  }'
```

**Response (404)**:
```json
{
  "status": "error",
  "message": "Coach not found"
}
```

### Negative Salary
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer token..." \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_1",
    "amount": -500
  }'
```

**Response (400)**:
```json
{
  "status": "error",
  "message": "Salary amount cannot be negative"
}
```

### Missing Authorization
```bash
curl http://localhost:5000/dashboard/salary/all
```

**Response (401)**:
```json
{
  "status": "error",
  "message": "Access token required"
}
```

### Non-Admin User
```bash
curl -H "Authorization: Bearer coach_token..." \
  http://localhost:5000/dashboard/salary/all
```

**Response (403)**:
```json
{
  "status": "error",
  "message": "Access denied. admin role required"
}
```

---

## Quick Reference

| Task | Endpoint | Method |
|------|----------|--------|
| Set salary | `/dashboard/salary/set` | POST |
| View all salaries | `/dashboard/salary/all` | GET |
| View coach salary | `/dashboard/salary/:coachId` | GET |
| Pay salary | `/dashboard/salary/pay` | POST |
| Payment history | `/dashboard/salary/history/:coachId` | GET |
| All payments | `/dashboard/salary-payments/all` | GET |
| Salary report | `/dashboard/salary/report` | GET |
| Profit detail | `/dashboard/profits/detail` | GET |
| Profit report | `/dashboard/profits` | GET |

---

## Notes
- Only admins can access these endpoints
- Include Bearer token in all requests
- All times are in ISO 8601 format
- All amounts are in USD (default currency)
- Changes are immediately reflected in subsequent requests
