# Subscription System Testing Guide

## ✅ Implementation Status

### Backend (Completed)
- ✅ Database schema updated with quota tracking fields
- ✅ Subscription plan configuration (`shared/subscription-plans.ts`)
- ✅ Quota enforcement for job posting
- ✅ Automatic job expiration (30 days for all plans)
- ✅ Featured and Urgent job quota checking
- ✅ Test accounts created for all 4 tiers

### Frontend (Requires Implementation)
- ⚠️ Verified badge display needs UI updates
- ⚠️ Dashboard quota display needs implementation
- ⚠️ Job posting form needs to show/hide features based on plan
- ⚠️ Upgrade prompts need UI implementation
- ⚠️ Analytics access control needs frontend gates
- ⚠️ CV database access control needs implementation

## 🔑 Test Account Credentials

### Free Plan
- **Email:** free@testcompany.com
- **Password:** Test123!
- **Company:** Free Test Company
- **Quotas:** 3 jobs, 0 featured, 0 urgent
- **Verified:** No
- **Duration:** 30 days

### Starter Plan  
- **Email:** starter@testcompany.com
- **Password:** Test123!
- **Company:** Starter Test Company
- **Quotas:** 10 jobs, 3 featured, 0 urgent
- **Verified:** Yes (Blue Badge ✓)
- **Duration:** 30 days

### Professional Plan
- **Email:** professional@testcompany.com
- **Password:** Test123!
- **Company:** Professional Test Company
- **Quotas:** 30 jobs, unlimited featured, unlimited urgent
- **Verified:** Yes (Blue Badge ✓)
- **Duration:** 30 days
- **Extras:** Advanced Analytics, CV Database (100 downloads)

### Enterprise Plan
- **Email:** enterprise@testcompany.com
- **Password:** Test123!
- **Company:** Enterprise Test Company
- **Quotas:** All unlimited
- **Verified:** Yes (Blue Badge ✓)
- **Duration:** 30 days
- **Extras:** Advanced Analytics, Unlimited CV downloads, Dedicated Manager

## 🧪 Backend Testing (Currently Available)

### Test 1: Job Posting Quota Enforcement

**Free Account (3 jobs limit):**
```bash
# Login as free@testcompany.com
# Try to post 4 jobs via API
# Expected: 3rd job succeeds, 4th job fails with "Quota habis! Upgrade ke Starter (Rp 199k)"
```

**Starter Account (10 jobs limit):**
```bash
# Login as starter@testcompany.com
# Try to post 11 jobs via API
# Expected: 10th job succeeds, 11th job fails with "Quota habis! Upgrade ke Professional"
```

### Test 2: Featured Job Quota Enforcement

**Free Account:**
```bash
# Try to post a featured job
# Expected: Fails with "Feature not available in your plan"
```

**Starter Account (3 featured limit):**
```bash
# Post 3 featured jobs - should succeed
# Try 4th featured job
# Expected: Fails with "Quota habis! Upgrade ke Professional"
```

**Professional Account:**
```bash
# Post unlimited featured jobs
# Expected: All succeed, no quota limit
```

### Test 3: Urgent Job Feature

**Free & Starter Accounts:**
```bash
# Try to post urgent job
# Expected: Fails with "Feature not available in your plan"
```

**Professional & Enterprise Accounts:**
```bash
# Post unlimited urgent jobs
# Expected: All succeed
```

### Test 4: Job Expiration

**All Accounts:**
```bash
# Post a job
# Check expiresAt field
# Expected: Set to exactly 30 days from creation (not 45, not custom)
```

## 📊 Subscription Plan Configuration

Located in `shared/subscription-plans.ts`:

### Plan Comparison

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| Job Postings | 3 | 10 | 30 | Unlimited |
| Featured Jobs | 0 | 3 | Unlimited | Unlimited |
| Urgent Jobs | 0 | 0 | Unlimited | Unlimited |
| Job Duration | 30 days | 30 days | 30 days | 30 days |
| Verified Badge | ❌ | ✓ Blue | ✓ Blue | ✓ Blue |
| Basic Analytics | ❌ | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| CV Database | ❌ | ❌ | 100 downloads | Unlimited |
| Support | Basic | Standard | Priority | Dedicated |

## 🔧 API Endpoints

### Check Subscription Status
```
GET /api/employer/company
Returns company info including:
- subscriptionPlan
- jobPostingCount
- featuredJobCount  
- urgentJobCount
- cvDownloadCount
```

### Post Job with Quota Check
```
POST /api/jobs
Body: {
  title: "...",
  description: "...",
  isFeatured: boolean,
  isUrgent: boolean,
  ...
}

Responses:
- 201: Job created successfully
- 403: Quota exceeded with upgrade message
```

## 🎨 Frontend Implementation Needed

### 1. Verified Badge Component
```typescript
// Should display on company name when verificationStatus === "verified"
// Color: #1DA1F2 (Twitter blue)
// Icon: ✓
```

### 2. Dashboard Quota Display
```typescript
// Example display for Starter plan:
"Job: 5/10, Featured: 2/3"

// Example display for Professional plan:
"Job: 15/30, Featured: ∞, Urgent: ∞, CV: 45/100"
```

### 3. Job Posting Form
```typescript
// Featured checkbox should be:
// - Disabled for Free plan (with tooltip: "Not available in your plan")
// - Disabled if quota reached (with tooltip: "Quota habis! Upgrade to Professional")
// - Enabled for Professional/Enterprise or if quota available

// Urgent checkbox should be:
// - Hidden for Free and Starter plans
// - Enabled for Professional and Enterprise
```

### 4. Upgrade Prompts
```typescript
// When quota exceeded:
{
  title: "Quota Habis!",
  message: "Upgrade ke {next_plan} untuk posting lebih banyak",
  action: "Upgrade Now",
  link: "/plans"
}
```

## 🗄️ Database Schema Changes

### Companies Table (Added Fields)
```typescript
jobPostingCount: integer, default: 0
featuredJobCount: integer, default: 0  
urgentJobCount: integer, default: 0
cvDownloadCount: integer, default: 0
quotaResetDate: timestamp
```

### Jobs Table (Added Fields)
```typescript
isUrgent: boolean, default: false
expiresAt: timestamp (set to +30 days)
```

## 🚀 Testing Workflow

1. **Login** with one of the test accounts
2. **Navigate** to job posting page
3. **Attempt** to create jobs based on plan limits
4. **Verify** quota enforcement messages
5. **Check** that jobs have correct expiration dates
6. **Test** featured/urgent toggle availability
7. **Repeat** for each subscription tier

## 📝 Notes

- All job postings automatically expire after 30 days (consistent across all plans)
- Quota counters increment on successful job creation
- Quota checks happen before job creation (fail-fast approach)
- Verified badge should only show for Starter+ plans
- Analytics access should be gated by subscription level
- CV database should enforce download limits

## 🔄 Next Steps for Complete Implementation

1. Update employer dashboard to show quota usage
2. Implement verified badge display throughout UI
3. Update job posting form with conditional feature display
4. Add upgrade prompts on quota exceeded errors
5. Implement analytics access control
6. Add CV download tracking and limits
7. Create automated tests for all subscription features

## 🆘 Troubleshooting

**Problem: Job quota not enforcing**
- Check company.jobPostingCount value
- Verify subscription plan is set correctly
- Check incrementCompanyQuota is being called

**Problem: Featured/Urgent not working**
- Verify isFeatured/isUrgent flags in request
- Check quota values for plan in subscription-plans.ts
- Confirm middleware is checking correctly

**Problem: Expiration not set**
- Check job.expiresAt field after creation
- Should be exactly 30 days from createdAt
- Verify expiresAt is being set in job creation route
