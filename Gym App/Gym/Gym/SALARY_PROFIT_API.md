# Admin Financial Management API

## Overview
The services folder contains business logic for:
1. **Profit Calculation** - Revenue after taxes and coach salaries
2. **Coach Salary Management** - Setting and tracking coach salaries

**Authentication**: All endpoints require admin role and Bearer token authentication.

---

## Profit Management Endpoints

### 1. Get Profit Detail Report
**Endpoint**: `GET /dashboard/profits/detail`

**Description**: Get detailed profit breakdown including revenue, taxes, coach salaries, and net profit.

**Query Parameters**:
- `taxPercentage` (optional): Tax percentage (default: 20%)

**Response**:
```json
{
  "status": "success",
  "message": "Detailed profit report",
  "data": {
    "totalRevenue": 1500,
    "totalTax": 300,
    "taxPercentage": 20,
    "totalCoachSalaries": 500,
    "profitAfterTaxes": 700,
    "profitMargin": "46.67",
    "breakdown": {
      "revenue": 1500,
      "taxes": 300,
      "coachSalaries": 500,
      "netProfit": 700
    }
  }
}
```

### 2. Get Profit Report
**Endpoint**: `GET /dashboard/profits`

**Description**: Get comprehensive profit report with monthly breakdown.

**Query Parameters**:
- `taxPercentage` (optional): Tax percentage (default: 20%)

**Response**:
```json
{
  "status": "success",
  "message": "Profit report generated",
  "report": {
    "overall": {
      "totalRevenue": 1500,
      "totalTax": 300,
      "taxPercentage": 20,
      "totalCoachSalaries": 500,
      "profitAfterTaxes": 700,
      "profitMargin": "46.67",
      "breakdown": { ... }
    },
    "monthly": {
      "revenue": 500,
      "tax": 100,
      "taxPercentage": 20,
      "profit": 0
    },
    "timestamp": "2026-02-08T10:30:00.000Z"
  }
}
```

---

## Coach Salary Management Endpoints

### 3. Set Coach Salary
**Endpoint**: `POST /dashboard/salary/set`

**Description**: Set or update a coach's salary.

**Request Body**:
```json
{
  "coachId": "coach_123",
  "amount": 1000,
  "description": "Monthly base salary"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Salary set successfully",
  "salary": {
    "coachId": "coach_123",
    "coachName": "John Coach",
    "amount": 1000,
    "description": "Monthly base salary",
    "setAt": "2026-02-08T10:30:00.000Z"
  }
}
```

### 4. Get All Coach Salaries
**Endpoint**: `GET /dashboard/salary/all`

**Description**: Get all coaches with their current salaries and total payout information.

**Response**:
```json
{
  "status": "success",
  "message": "Coach salaries retrieved",
  "data": {
    "salaries": [
      {
        "id": "salary_1707394200000",
        "coachId": "coach_123",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "coachStatus": "active",
        "amount": 1000,
        "description": "Monthly base salary",
        "createdAt": "2026-02-08T10:30:00.000Z",
        "updatedAt": "2026-02-08T10:30:00.000Z"
      }
    ],
    "totalMonthlyPayout": 1000,
    "coachCount": 1,
    "averageSalary": 1000
  }
}
```

### 5. Get Single Coach Salary
**Endpoint**: `GET /dashboard/salary/:coachId`

**Description**: Get salary information for a specific coach.

**Path Parameters**:
- `coachId`: The ID of the coach

**Response**:
```json
{
  "status": "success",
  "message": "Coach salary retrieved",
  "data": {
    "id": "salary_1707394200000",
    "coachId": "coach_123",
    "coachName": "John Coach",
    "amount": 1000,
    "description": "Monthly base salary",
    "createdAt": "2026-02-08T10:30:00.000Z",
    "updatedAt": "2026-02-08T10:30:00.000Z"
  }
}
```

### 6. Pay Coach Salary
**Endpoint**: `POST /dashboard/salary/pay`

**Description**: Record a salary payment to a coach.

**Request Body**:
```json
{
  "coachId": "coach_123",
  "amount": 1000,
  "notes": "Monthly salary for February"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Salary paid successfully to John Coach",
  "payment": {
    "paymentId": "salary_payment_1707394200000",
    "coachId": "coach_123",
    "coachName": "John Coach",
    "amount": 1000,
    "paidAt": "2026-02-08T10:31:00.000Z",
    "notes": "Monthly salary for February"
  }
}
```

### 7. Get Coach Payment History
**Endpoint**: `GET /dashboard/salary/history/:coachId`

**Description**: Get payment history for a specific coach.

**Path Parameters**:
- `coachId`: The ID of the coach

**Query Parameters**:
- `limit` (optional): Number of records to return (default: 12)

**Response**:
```json
{
  "status": "success",
  "message": "Payment history retrieved",
  "data": {
    "coachId": "coach_123",
    "coachName": "John Coach",
    "coachEmail": "john@coach.com",
    "payments": [
      {
        "id": "salary_payment_1707394200000",
        "coachId": "coach_123",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "salaryId": "salary_1707394200000",
        "amount": 1000,
        "notes": "Monthly salary for February",
        "status": "completed",
        "paidAt": "2026-02-08T10:31:00.000Z"
      }
    ],
    "totalPaid": 1000,
    "paymentCount": 1,
    "averagePayment": 1000
  }
}
```

### 8. Get All Salary Payments
**Endpoint**: `GET /dashboard/salary-payments/all`

**Description**: Get all salary payment transactions across all coaches.

**Query Parameters**:
- `limit` (optional): Number of records to return

**Response**:
```json
{
  "status": "success",
  "message": "All salary payments retrieved",
  "data": {
    "payments": [
      {
        "id": "salary_payment_1707394200000",
        "coachId": "coach_123",
        "coachName": "John Coach",
        "coachEmail": "john@coach.com",
        "salaryId": "salary_1707394200000",
        "amount": 1000,
        "notes": "Monthly salary for February",
        "status": "completed",
        "paidAt": "2026-02-08T10:31:00.000Z"
      }
    ],
    "totalPaid": 1000,
    "paymentCount": 1,
    "uniqueCoaches": 1
  }
}
```

### 9. Generate Salary Report
**Endpoint**: `GET /dashboard/salary/report`

**Description**: Generate comprehensive salary report with all structures and payment history.

**Response**:
```json
{
  "status": "success",
  "message": "Salary report generated",
  "report": {
    "salaryStructure": {
      "salaries": [...],
      "totalMonthlyPayout": 1000,
      "coachCount": 1,
      "averageSalary": 1000
    },
    "paymentHistory": {
      "payments": [...],
      "totalPaid": 1000,
      "paymentCount": 1,
      "uniqueCoaches": 1
    },
    "summary": {
      "totalMonthlyBudget": 1000,
      "totalPaidOut": 1000,
      "activeCoaches": 1,
      "pendingCoaches": 0,
      "generatedAt": "2026-02-08T10:32:00.000Z"
    }
  }
}
```

---

## Authentication

All endpoints require:
- **Header**: `Authorization: Bearer <token>`
- **Role**: `admin`

Example:
```bash
curl -H "Authorization: Bearer your_token_here" \
  http://localhost:5000/dashboard/salary/all
```

---

## Error Responses

### 401 - Unauthorized
```json
{
  "status": "error",
  "message": "Access token required"
}
```

### 403 - Forbidden
```json
{
  "status": "error",
  "message": "Access denied. admin role required"
}
```

### 400 - Bad Request
```json
{
  "status": "error",
  "message": "coachId and amount are required"
}
```

### 404 - Not Found
```json
{
  "status": "error",
  "message": "Coach not found"
}
```

---

## Usage Examples

### Set salary for a coach
```bash
curl -X POST http://localhost:5000/dashboard/salary/set \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_123",
    "amount": 1000,
    "description": "Monthly salary"
  }'
```

### Get all salaries
```bash
curl -H "Authorization: Bearer your_token" \
  http://localhost:5000/dashboard/salary/all
```

### Pay a coach
```bash
curl -X POST http://localhost:5000/dashboard/salary/pay \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "coachId": "coach_123",
    "amount": 1000,
    "notes": "February salary"
  }'
```

### Get profit report with 25% tax
```bash
curl -H "Authorization: Bearer your_token" \
  "http://localhost:5000/dashboard/profits/detail?taxPercentage=25"
```

---

## Business Logic

### Profit Calculation Formula
```
Total Revenue = Sum of all completed payments
Taxes = Total Revenue × Tax Percentage
Coach Salaries = Sum of all coach salaries
Net Profit = Total Revenue - Taxes - Coach Salaries
Profit Margin = (Net Profit / Total Revenue) × 100%
```

### Security
- ✅ All endpoints require admin authentication
- ✅ Non-admin users cannot access salary or profit data
- ✅ All requests are validated before processing
- ✅ Admin-only endpoints are explicitly protected

---

## Notes
- Only admins can view, modify, and manage coach salaries and profit data
- Coaches cannot see their own salary information through the API
- All monetary amounts are in the default currency (USD)
- Timestamps are in ISO 8601 format
