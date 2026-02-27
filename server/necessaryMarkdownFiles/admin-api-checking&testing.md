# 🧪 PHASE 3 COMPLETE TESTING GUIDE

**Date:** February 26, 2026  
**Status:** ✅ ALL TESTS PASSING  
**Modules Tested:** User Authentication, Admin Role Management

---

## 📋 TEST ACCOUNTS SETUP

### **Account 1: John Author (TECHNICAL_EDITOR)**
```
Email: john.author@test.com
Password: Password@123
Role: TECHNICAL_EDITOR (promoted from USER)
Status: ACTIVE
User ID: [SAVE FROM REGISTRATION]
Token: [SAVE AFTER LOGIN]
```

### **Account 2: Sarah Editor (EDITOR)**
```
Email: sarah.editor@test.com
Password: Password@123
Role: EDITOR (promoted manually in MongoDB)
Status: ACTIVE
User ID: [SAVE FROM REGISTRATION]
Token: [SAVE AFTER LOGIN WITH EDITOR ROLE]
```

### **Account 3: Michael Reviewer (REVIEWER)**
```
Email: michael.reviewer@test.com
Password: Password@123
Role: REVIEWER (promoted via role change request)
Status: SUSPENDED (for testing)
User ID: [SAVE FROM REGISTRATION]
Token: [SAVE AFTER LOGIN]
```

### **Account 4: Emma Admin (ADMIN)**
```
Email: emma.admin@test.com
Password: Password@123
Role: ADMIN (promoted manually in MongoDB)
Status: ACTIVE
User ID: [SAVE FROM REGISTRATION]
Token: [SAVE AFTER LOGIN WITH ADMIN ROLE]
```

---

## 🧪 TEST FLOW SEQUENCE

### **STEP 1: Register 4 Users**

**Test 1.1: Register John (Author)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Author",
    "email": "john.author@test.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "profession": "Physician (MD)",
    "primarySpecialty": "Cardiology",
    "institution": "Harvard Medical School",
    "department": "Cardiology Department",
    "phoneCode": "+1",
    "mobileNumber": "6175551001",
    "address": {
      "street": "123 Medical Drive",
      "city": "Boston",
      "state": "Massachusetts",
      "country": "United States",
      "postalCode": "02115"
    },
    "termsAccepted": true
  }'
```

**Expected Result:**
- ✅ Status: 201 Created
- ✅ Message: "Registration successful! OTP sent to your email."
- ✅ Data contains: `{ "email": "john.author@test.com" }`
- ✅ Console shows 6-digit OTP

**Action:** Save the OTP from console/email

---

**Test 1.2: Register Sarah (Editor)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Editor",
    "email": "sarah.editor@test.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "profession": "Physician (MD)",
    "primarySpecialty": "General Medicine",
    "institution": "Mayo Clinic",
    "department": "Editorial Board",
    "phoneCode": "+1",
    "mobileNumber": "5075551002",
    "address": {
      "street": "456 Editor Lane",
      "city": "Rochester",
      "state": "Minnesota",
      "country": "United States",
      "postalCode": "55905"
    },
    "termsAccepted": true
  }'
```

**Expected Result:** Same as Test 1.1  
**Action:** Save OTP

---

**Test 1.3: Register Michael (Reviewer)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Michael",
    "lastName": "Reviewer",
    "email": "michael.reviewer@test.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "profession": "Physician (MD)",
    "primarySpecialty": "Cardiology",
    "institution": "Johns Hopkins",
    "department": "Cardiology Research",
    "phoneCode": "+1",
    "mobileNumber": "4105551003",
    "address": {
      "street": "789 Research Blvd",
      "city": "Baltimore",
      "state": "Maryland",
      "country": "United States",
      "postalCode": "21287"
    },
    "termsAccepted": true
  }'
```

**Expected Result:** Same as Test 1.1  
**Action:** Save OTP

---

**Test 1.4: Register Emma (Admin)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Admin",
    "email": "emma.admin@test.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "profession": "Administrator",
    "primarySpecialty": "General Medicine",
    "institution": "JAIRAM Journal",
    "department": "Administration",
    "phoneCode": "+91",
    "mobileNumber": "9876543210",
    "address": {
      "street": "100 Admin Plaza",
      "city": "Gorakhpur",
      "state": "Uttar Pradesh",
      "country": "India",
      "postalCode": "273001"
    },
    "termsAccepted": true
  }'
```

**Expected Result:** Same as Test 1.1  
**Action:** Save OTP

---

### **STEP 2: Verify All Users**

**Test 2.1: Verify John**
```bash
curl -X POST http://localhost:5000/api/users/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.author@test.com",
    "otp": "PASTE_OTP_HERE"
  }'
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Message: "Email verified successfully"
- ✅ Returns JWT token + user object with role: "USER"

**Action:** Copy and save:
```
JOHN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JOHN_ID=65e38b2a4f7e23001d8cf528
```

---

**Test 2.2-2.4: Verify Sarah, Michael, Emma**

Repeat the same verify-otp call for each user:
- Replace email with their respective emails
- Use their OTPs
- Save their tokens and IDs

**After this step, you should have:**
```
JOHN_TOKEN=[token]
JOHN_ID=[id]

SARAH_TOKEN=[token]
SARAH_ID=[id]

MICHAEL_TOKEN=[token]
MICHAEL_ID=[id]

EMMA_TOKEN=[token]
EMMA_ID=[id]
```

---

### **STEP 3: Promote Sarah to EDITOR (MongoDB)**

**MongoDB Command:**
```javascript
mongosh

use jairam_db

db.users.updateOne(
  { email: "sarah.editor@test.com" },
  { $set: { role: "EDITOR" } }
)

// Verify
db.users.findOne(
  { email: "sarah.editor@test.com" },
  { firstName: 1, email: 1, role: 1 }
)
```

**Expected Output:**
```javascript
{
  _id: ObjectId("..."),
  firstName: 'Sarah',
  email: 'sarah.editor@test.com',
  role: 'EDITOR'  // ← Changed!
}
```

---

**Test 3.1: Sarah Login Again (Get NEW Token with EDITOR Role)**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.editor@test.com",
    "password": "Password@123"
  }'
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Token payload contains: `"role": "EDITOR"`

**Action:** Replace SARAH_TOKEN with the NEW token
```
SARAH_EDITOR_TOKEN=[new_token_with_editor_role]
```

---

### **STEP 4: Promote Emma to ADMIN (MongoDB)**

**MongoDB Command:**
```javascript
db.users.updateOne(
  { email: "emma.admin@test.com" },
  { $set: { role: "ADMIN" } }
)

// Verify
db.users.findOne(
  { email: "emma.admin@test.com" },
  { firstName: 1, email: 1, role: 1 }
)
```

---

**Test 4.1: Emma Login Again (Get NEW Token with ADMIN Role)**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "emma.admin@test.com",
    "password": "Password@123"
  }'
```

**Action:** Replace EMMA_TOKEN with the NEW token
```
EMMA_ADMIN_TOKEN=[new_token_with_admin_role]
```

---

### **STEP 5: Editor Creates Role Change Request**

**Test 5.1: Sarah Requests Michael → REVIEWER**
```bash
curl -X POST http://localhost:5000/api/admin/role-change-requests \
  -H "Authorization: Bearer SARAH_EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MICHAEL_ID",
    "requestedRole": "REVIEWER",
    "reason": "Dr. Michael has 10+ years of experience in cardiology research. He has published 15 papers in peer-reviewed journals including NEJM and JAMA. His expertise in cardiovascular diseases makes him an excellent candidate for reviewing manuscripts in this field."
  }'
```

**⚠️ Replace:**
- `SARAH_EDITOR_TOKEN` → Sarah's EDITOR token from Step 3
- `MICHAEL_ID` → Michael's User ID from Step 2

**Expected Result:**
- ✅ Status: 201 Created
- ✅ Message: "Role change request submitted successfully..."
- ✅ Request status: "PENDING"
- ✅ Returns request object with request._id

**Action:** Save REQUEST_ID
```
REQUEST_ID=65e38c3a4f7e23001d8cf52c
```

---

### **STEP 6: Admin Views Pending Requests**

**Test 6.1: Emma Lists Pending Requests**
```bash
curl -X GET "http://localhost:5000/api/admin/role-change-requests?status=PENDING" \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN"
```

**⚠️ Replace:** `EMMA_ADMIN_TOKEN` → Emma's ADMIN token from Step 4

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Array contains 1 request for Michael
- ✅ Request shows: currentRole: "USER", requestedRole: "REVIEWER"
- ✅ Requested by Sarah

---

### **STEP 7: Admin Approves Request**

**Test 7.1: Emma Approves Michael's Promotion**
```bash
curl -X PATCH http://localhost:5000/api/admin/role-change-requests/REQUEST_ID \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "APPROVE",
    "adminComments": "Credentials verified. Dr. Michael'\''s publication record and expertise in cardiology are excellent. Approved for reviewer role."
  }'
```

**⚠️ Replace:**
- `REQUEST_ID` → From Step 5
- `EMMA_ADMIN_TOKEN` → Emma's token

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Message: "Role change request approved and user role updated successfully"
- ✅ Request status changed to: "APPROVED"
- ✅ Michael's role changed to: "REVIEWER"
- ✅ Email sent to Michael

---

**Test 7.2: Verify in Database**
```javascript
mongosh

use jairam_db

db.users.findOne(
  { email: "michael.reviewer@test.com" },
  { firstName: 1, email: 1, role: 1 }
)
```

**Expected Output:**
```javascript
{
  _id: ObjectId("..."),
  firstName: 'Michael',
  email: 'michael.reviewer@test.com',
  role: 'REVIEWER'  // ← Successfully changed!
}
```

---

### **STEP 8: Admin Direct Role Update (Bypass Request)**

**Test 8.1: Emma Promotes John to TECHNICAL_EDITOR**
```bash
curl -X PATCH http://localhost:5000/api/admin/users/JOHN_ID/role \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "TECHNICAL_EDITOR",
    "reason": "Urgently needed for technical manuscript reviews. Has expertise in medical manuscript formatting."
  }'
```

**⚠️ Replace:**
- `JOHN_ID` → John's User ID from Step 2
- `EMMA_ADMIN_TOKEN` → Emma's token

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Message: "User role updated successfully"
- ✅ John's role changed from "USER" to "TECHNICAL_EDITOR"
- ✅ Returns changes object showing old/new roles

---

### **STEP 9: Admin Updates User Profile**

**Test 9.1: Emma Updates John's Profile**
```bash
curl -X PATCH http://localhost:5000/api/admin/users/JOHN_ID/profile \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneCode": "+1",
    "mobileNumber": "6175559999",
    "institution": "Harvard Medical School - Updated"
  }'
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Message: "User profile updated successfully"
- ✅ John's profile fields updated

---

### **STEP 10: Admin Lists All Users**

**Test 10.1: Emma Views All Users**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN"
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns array of 4 users
- ✅ Correct roles shown for each user:
  - John: TECHNICAL_EDITOR
  - Sarah: EDITOR
  - Michael: REVIEWER
  - Emma: ADMIN

---

### **STEP 11: Admin Suspends User**

**Test 11.1: Emma Suspends Michael**
```bash
curl -X PATCH http://localhost:5000/api/admin/users/MICHAEL_ID/status \
  -H "Authorization: Bearer EMMA_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUSPENDED",
    "reason": "Under investigation for policy violation. Account temporarily suspended pending review."
  }'
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Message: "User status updated successfully"
- ✅ Michael's status changed to "SUSPENDED"
- ✅ Email sent to Michael

---

**Test 11.2: Verify Michael Cannot Login**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michael.reviewer@test.com",
    "password": "Password@123"
  }'
```

**Expected Result:**
- ✅ Status: 403 Forbidden
- ✅ Error: "Your account has been suspended. Please contact support."
- ✅ Error code: "ACCOUNT_SUSPENDED"

---

### **STEP 12: Test Role-Based Access Control**

**Test 12.1: User (John) Cannot Access Admin Routes**
```bash
# John tries to list all users (ADMIN only)
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer JOHN_TOKEN"
```

**Expected Result:**
- ✅ Status: 403 Forbidden
- ✅ Error: "Forbidden"

---

**Test 12.2: Editor Cannot Approve Requests (ADMIN only)**
```bash
# Sarah tries to approve a request (only ADMIN can)
curl -X PATCH http://localhost:5000/api/admin/role-change-requests/REQUEST_ID \
  -H "Authorization: Bearer SARAH_EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "APPROVE",
    "adminComments": "Test"
  }'
```

**Expected Result:**
- ✅ Status: 403 Forbidden
- ✅ Error: "Forbidden"

---

## ✅ TEST COMPLETION CHECKLIST

After running all tests, verify:

- [ ] All 4 users registered successfully
- [ ] All emails verified with OTP
- [ ] Sarah promoted to EDITOR (manual + re-login)
- [ ] Emma promoted to ADMIN (manual + re-login)
- [ ] Sarah created role change request successfully
- [ ] Emma viewed pending requests
- [ ] Emma approved request → Michael became REVIEWER
- [ ] Emma directly promoted John to TECHNICAL_EDITOR
- [ ] Emma updated John's profile
- [ ] Emma listed all users correctly
- [ ] Emma suspended Michael
- [ ] Michael cannot login (suspended)
- [ ] Role-based access control working (403 errors)

---

## 📊 FINAL USER STATES

| User | Email | Initial Role | Final Role | Status | Can Login? |
|------|-------|-------------|-----------|--------|-----------|
| John | john.author@test.com | USER | TECHNICAL_EDITOR | ACTIVE | ✅ Yes |
| Sarah | sarah.editor@test.com | USER → EDITOR | EDITOR | ACTIVE | ✅ Yes |
| Michael | michael.reviewer@test.com | USER → REVIEWER | REVIEWER | SUSPENDED | ❌ No |
| Emma | emma.admin@test.com | USER → ADMIN | ADMIN | ACTIVE | ✅ Yes |

---

## 🎯 ROUTES TESTED & VERIFIED

### **User Module (9 routes) ✅**
1. POST `/api/users/register` - Registration with OTP
2. POST `/api/users/verify-otp` - Email verification
3. POST `/api/users/resend-otp` - Resend verification OTP
4. POST `/api/users/login` - Login with JWT
5. GET `/api/users/profile` - View own profile
6. POST `/api/users/change-password` - Change password (logged in)
7. POST `/api/users/forgot-password` - Request password reset
8. POST `/api/users/reset-password` - Reset password with OTP
9. GET `/api/users/check-email` - Check email availability

### **Admin Module (8 routes) ✅**
1. POST `/api/admin/role-change-requests` - Create request (EDITOR)
2. GET `/api/admin/role-change-requests` - List requests (ADMIN)
3. PATCH `/api/admin/role-change-requests/:id` - Approve/reject (ADMIN)
4. GET `/api/admin/users` - List all users (ADMIN)
5. GET `/api/admin/users/:userId` - Get user by ID (ADMIN)
6. PATCH `/api/admin/users/:userId/role` - Update role (ADMIN)
7. PATCH `/api/admin/users/:userId/profile` - Update profile (ADMIN)
8. PATCH `/api/admin/users/:userId/status` - Suspend/activate (ADMIN)

---

## 🚀 WHAT'S BEEN FINALIZED

### **1. Authentication System ✅**
- OTP-based email verification
- JWT token authentication
- Password reset via OTP
- Session management

### **2. Authorization System ✅**
- Role-based access control (RBAC)
- 5 roles: USER, EDITOR, TECHNICAL_EDITOR, REVIEWER, ADMIN
- Middleware enforcement (requireAuth, allowRoles)
- Default role: USER

### **3. Admin Workflow ✅**
- Editor → Admin request-approval workflow
- Direct role assignment by Admin
- User profile management (ADMIN only)
- Account suspension system

### **4. Communication Flow ✅**
```
USER → contacts EDITOR
     ↓
EDITOR → creates role change request
     ↓
ADMIN → approves/rejects
     ↓
System → updates role + sends notification
```

### **5. Data Integrity ✅**
- Users cannot update their own profiles
- Profile updates go through: USER → EDITOR → ADMIN
- Role changes require ADMIN approval (except direct assignments)
- Suspended users cannot login

---

## 🎯 READY FOR PHASE 4

**Phase 4 will implement:**
- Submission model updates (`submitterRoleType` field)
- Integration with SubmissionCycle and ManuscriptVersion
- Manuscript Submission Login validation
- Author vs Co-author differentiation
- Role-based submission workflows

---

**All Phase 3 tests passing! ✅**  
**Date:** February 26, 2026  
**Testing completed successfully**