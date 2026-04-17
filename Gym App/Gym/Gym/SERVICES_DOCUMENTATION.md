# Services Documentation

## Overview

The `services/` folder contains reusable business logic for financial calculations and coach salary management.

### Services Included
1. **profitService.js** - Profit and revenue calculations
2. **coachSalaryService.js** - Coach salary and payment management

---

## profitService.js

### Functions

#### calculateTotalRevenue()
**Purpose**: Calculate total revenue from all completed payments.

**Parameters**: None

**Returns**: `number` - Total revenue amount

**Example**:
```javascript
const profitService = require('../services/profitService');

const totalRevenue = profitService.calculateTotalRevenue();
console.log(totalRevenue); // 1500
```

---

#### calculateTax(revenue, taxPercentage = 20)
**Purpose**: Calculate tax amount based on revenue.

**Parameters**:
- `revenue` (number): The revenue amount
- `taxPercentage` (number, optional): Tax percentage (default: 20%)

**Returns**: `number` - Tax amount

**Example**:
```javascript
const tax = profitService.calculateTax(1000, 15);
console.log(tax); // 150
```

---

#### calculateTotalCoachSalaries()
**Purpose**: Calculate total monthly coach salaries.

**Parameters**: None

**Returns**: `number` - Total coach salaries

**Example**:
```javascript
const totalSalaries = profitService.calculateTotalCoachSalaries();
console.log(totalSalaries); // 2500
```

---

#### calculateProfitAfterTaxes(taxPercentage = 20)
**Purpose**: Calculate profit after deducting taxes and coach salaries.

**Parameters**:
- `taxPercentage` (number, optional): Tax percentage (default: 20%)

**Returns**: `object` - Profit breakdown object

**Response Structure**:
```javascript
{
  totalRevenue: 1500,          // Total revenue from payments
  totalTax: 300,               // Calculated tax amount
  taxPercentage: 20,           // Tax percentage used
  totalCoachSalaries: 500,     // Total coach salaries
  profitAfterTaxes: 700,       // Net profit
  profitMargin: "46.67",       // Profit margin percentage
  breakdown: {
    revenue: 1500,
    taxes: 300,
    coachSalaries: 500,
    netProfit: 700
  }
}
```

**Example**:
```javascript
const profit = profitService.calculateProfitAfterTaxes(25);
console.log(profit.profitAfterTaxes); // Net profit value
```

---

#### getRevenueByPeriod(startDate, endDate)
**Purpose**: Calculate revenue within a specific date range.

**Parameters**:
- `startDate` (Date): Start date for period
- `endDate` (Date): End date for period

**Returns**: `number` - Revenue for the period

**Example**:
```javascript
const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);

const monthlyRevenue = profitService.getRevenueByPeriod(lastMonth, new Date());
console.log(monthlyRevenue);
```

---

#### getProfitReport(taxPercentage = 20)
**Purpose**: Generate comprehensive profit report with monthly breakdown.

**Parameters**:
- `taxPercentage` (number, optional): Tax percentage (default: 20%)

**Returns**: `object` - Complete profit report

**Response Structure**:
```javascript
{
  status: "success",
  message: "Profit report generated",
  report: {
    overall: { /* full breakdown */ },
    monthly: {
      revenue: 500,
      tax: 100,
      taxPercentage: 20,
      profit: 400
    },
    timestamp: "2026-02-08T10:30:00.000Z"
  }
}
```

---

## coachSalaryService.js

### Functions

#### setCoachSalary(coachId, amount, description = '')
**Purpose**: Set or update a coach's salary.

**Parameters**:
- `coachId` (string): Coach's ID
- `amount` (number): Salary amount
- `description` (string, optional): Description of salary

**Returns**: `object` - Success response with salary details

**Throws**: Error if coach not found or amount is negative

**Example**:
```javascript
const salaryService = require('../services/coachSalaryService');

const result = salaryService.setCoachSalary('coach_123', 1000, 'Monthly salary');
```

---

#### getCoachSalary(coachId)
**Purpose**: Get salary record for a specific coach.

**Parameters**:
- `coachId` (string): Coach's ID

**Returns**: `object|null` - Salary object or null if not found

**Example**:
```javascript
const salary = salaryService.getCoachSalary('coach_123');
if (salary) {
  console.log(salary.amount);
}
```

---

#### getAllCoachSalaries()
**Purpose**: Get all coaches with their current salaries and statistics.

**Parameters**: None

**Returns**: `object` - Response with all salaries and statistics

**Response Structure**:
```javascript
{
  status: "success",
  message: "Coach salaries retrieved",
  data: {
    salaries: [
      {
        id: "salary_1707394200000",
        coachId: "coach_123",
        coachName: "John Coach",
        coachEmail: "john@coach.com",
        coachStatus: "active",
        amount: 1000,
        description: "Monthly salary",
        createdAt: "2026-02-08T10:30:00.000Z",
        updatedAt: "2026-02-08T10:30:00.000Z"
      }
    ],
    totalMonthlyPayout: 2500,
    coachCount: 2,
    averageSalary: 1250
  }
}
```

---

#### payCoachSalary(coachId, amount, notes = '')
**Purpose**: Record a salary payment transaction.

**Parameters**:
- `coachId` (string): Coach's ID
- `amount` (number): Payment amount
- `notes` (string, optional): Payment notes

**Returns**: `object` - Payment confirmation

**Throws**: Error if coach not found, salary not set, or amount invalid

**Example**:
```javascript
const payment = salaryService.payCoachSalary('coach_123', 1000, 'February salary');
```

---

#### getCoachPaymentHistory(coachId, limit = 12)
**Purpose**: Get payment history for a specific coach.

**Parameters**:
- `coachId` (string): Coach's ID
- `limit` (number, optional): Number of records to return (default: 12)

**Returns**: `object` - Payment history with statistics

**Response Structure**:
```javascript
{
  status: "success",
  message: "Payment history retrieved",
  data: {
    coachId: "coach_123",
    coachName: "John Coach",
    coachEmail: "john@coach.com",
    payments: [
      {
        id: "salary_payment_1707394200000",
        coachId: "coach_123",
        coachName: "John Coach",
        coachEmail: "john@coach.com",
        salaryId: "salary_1707394200000",
        amount: 1000,
        notes: "February salary",
        status: "completed",
        paidAt: "2026-02-08T10:31:00.000Z"
      }
    ],
    totalPaid: 5000,
    paymentCount: 5,
    averagePayment: 1000
  }
}
```

---

#### getAllSalaryPayments(limit = null)
**Purpose**: Get all salary payment transactions across all coaches.

**Parameters**:
- `limit` (number, optional): Number of records to return

**Returns**: `object` - All payments with statistics

---

#### generateSalaryReport()
**Purpose**: Generate comprehensive salary report.

**Parameters**: None

**Returns**: `object` - Complete salary report including structure and history

**Response Structure**:
```javascript
{
  status: "success",
  message: "Salary report generated",
  report: {
    salaryStructure: { /* all salaries */ },
    paymentHistory: { /* all payments */ },
    summary: {
      totalMonthlyBudget: 2500,
      totalPaidOut: 5000,
      activeCoaches: 2,
      pendingCoaches: 0,
      generatedAt: "2026-02-08T10:32:00.000Z"
    }
  }
}
```

---

## Using Services in Controllers

### Example Controller Usage

```javascript
// In adminController.js
const profitService = require('../services/profitService');
const coachSalaryService = require('../services/coachSalaryService');

const getProfitReport = (req, res) => {
  try {
    const report = profitService.getProfitReport(20);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const setCoachSalary = (req, res) => {
  const { coachId, amount } = req.body;
  
  try {
    const result = coachSalaryService.setCoachSalary(coachId, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
```

---

## Database Integration

Both services use the mock database:

```javascript
const { mockDatabase, findCoachById } = require('../models/database');
```

The services automatically initialize required database structures:
- `mockDatabase.coachSalaries[]` - Stores salary records
- `mockDatabase.salaryPayments[]` - Stores payment transactions
- `mockDatabase.payments[]` - Used for revenue calculations
- `mockDatabase.coaches[].salary` - Updated with salary amount

---

## Error Handling

Services throw errors with descriptive messages:

```javascript
try {
  coachSalaryService.setCoachSalary(invalidId, -100);
} catch (error) {
  console.error(error.message); // "Salary amount cannot be negative"
}
```

Controllers should catch these errors and return appropriate HTTP status codes.

---

## Security & Access Control

- Services are **business logic only** - no authentication checks
- **Controllers** handle authentication via middleware (`verifyBearerToken`, `checkRole('admin')`)
- Only admins can access these endpoints
- Services can be reused in other controllers if needed

---

## Migration to Real Database

To migrate these services to a real database (MongoDB, PostgreSQL, etc.):

1. Replace `mockDatabase` operations with database queries
2. Update all functions to use async/await
3. Keep the same function signatures and return structures
4. Controllers require minimal changes

Example:
```javascript
// Before (mock)
const getAllCoachSalaries = () => {
  const salaries = mockDatabase.coachSalaries.find(...);
  return { status: 'success', data: { salaries, ... } };
};

// After (real DB)
const getAllCoachSalaries = async () => {
  const salaries = await CoachSalary.find();
  return { status: 'success', data: { salaries, ... } };
};
```

Then update controller to use `await`:
```javascript
const result = await coachSalaryService.getAllCoachSalaries();
```

---

## Notes

- All timestamps are in ISO 8601 format
- Monetary values are numbers (in the default currency unit)
- Services initialize their own database structures on first use
- No external API calls required
- Services are stateless and reusable
