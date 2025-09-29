# Account Progression System - Complete Design

## Core Philosophy
A purpose-built platform that respects user autonomy while managing risk. No forced changes, no manipulation - just smart defaults and clear pathways.

---

## System Architecture Overview

```
RISK MANAGEMENT LAYER
├── £50 start (maximum fraud exposure)
├── 2-payment progression gates
└── User-controlled limit increases

PROGRESSION LAYER
├── Bronze: £50 → £100 → £150 → £250 → £500
├── Auto-upgrade to Silver at £500 (2 payments)
├── Silver: £500 → £750 → £1000
└── Auto-upgrade to Gold at £1000 (2 payments)

NOTIFICATION LAYER
├── Email (primary channel)
├── Billing page banner (persistent reminder)
├── Account card indicator (visual confirmation)
└── Dashboard message (first login only)

USER CONTROL LAYER
├── All limit changes user-initiated
├── Downgrade always available
├── Learn More always accessible
└── No forced upgrades
```

---

## Bronze Account Progression

### Starting Point
- **£50 limit** - All new users start here
- Maximum fraud exposure capped at £50
- "Try before commit" experience

### Bronze Limit Tiers
After **2 successful payments** at current limit, next tier becomes available:

| Current Limit | Payments Required | Unlocks Access To |
|--------------|-------------------|-------------------|
| £50          | 2 payments        | £100             |
| £100         | 2 payments        | £150             |
| £150         | 2 payments        | £250             |
| £250         | 2 payments        | £500             |
| £500         | 2 payments        | Auto-Silver upgrade |

### Key Features
- **No automatic limit increases** - User stays at chosen limit
- **Can skip tiers** - Jump from £100 to £250 if eligible
- **Always reversible** - Can downgrade to any previous limit
- **Progressive disclosure** - "Manage Limit" only appears when options exist

---

## Automatic Silver Upgrade

### The Trigger
When user completes **2 payments at £500** while Bronze:
- Account automatically upgrades to Silver
- **Limit remains unchanged** (stays at £500)
- No disruption to payment flow

### What Changes
**Before:**
```
Account Level: Bronze
£500 limit
✓ Silver benefits available
```

**After (Automatic):**
```
Account Level: Silver
£500 limit
✓ £750 limit available
```

### Why This Works
- **No friction** - Nothing user needs to do
- **Pure recognition** - Rewards good behavior
- **No disruption** - Limit stays the same
- **Future options** - Can explore £600+ when ready

---

## Silver Account Progression

### Entry Point
- Automatic upgrade from Bronze at £500
- User stays at £500 limit initially

### Silver Limit Tiers
After **2 successful payments** at current limit:

| Current Limit | Payments Required | Unlocks Access To |
|--------------|-------------------|-------------------|
| £500         | Already at Silver | £750 available   |
| £750         | 2 payments        | £1000            |
| £1000        | 2 payments        | Auto-Gold upgrade |

### Silver → Gold Eligibility
- **Requirement:** 2 successful payments at £1000
- **Unlocks:** Gold account level (automatic)

---

## Gold Account Options

### Two Pathways

#### Option A: Pay-as-you-go (Higher Limits)
- £1000, £1250, £1500 limits available
- Same automatic payment system
- Instant charge when limit reached
- Good for: Users who prefer automatic billing

#### Option B: Monthly Invoicing
- NET 30 payment terms
- Up to £1500 credit limit
- Monthly invoice instead of automatic charges
- Good for: Professional cash flow management

### Gold Benefits
- Maximum flexibility
- Professional invoicing options
- Highest available limits
- Choice of payment methods

---

## Notification Strategy

### 1. Email Notification (Primary)
**When:** Immediately after automatic Silver upgrade
```
Subject: Your account has been upgraded to Silver!

Hi [Name],

Great news! Based on your excellent payment history,
your account has been automatically upgraded to Silver status.

What's changed:
✓ Your limit remains at £500 (no disruption)
✓ You can now access limits up to £1000 when ready
✓ Your account badge now shows Silver

No action needed - keep using the platform as normal.

[View Account]
```

### 2. Billing Page Banner
**When:** Next visit to billing page after upgrade
```
[Dismissible Banner]
🎉 Your account was upgraded to Silver on [Date]
Your limit remains at £500 - upgrade when ready.
[Dismiss] [Learn More]
```

### 3. Account Card Indicator
**Where:** In the billing page account card
```
Account Level: Silver ← NEW
£400 limit
✓ £600 limit available
```

### 4. Dashboard Welcome
**When:** First login after upgrade
```
Welcome back! You're now a Silver member.
[View Benefits] [Continue to Dashboard]
```

---

## Limit Management Interface

### Card Display States

#### New User (No options)
```
Account Level: Bronze
£50 limit
[Learn More]
```

#### Eligible User (Has options)
```
Account Level: Bronze
£100 limit
✓ £150 limit available
[Manage Limit] [Learn More]
```

#### Multiple Options Available
```
Account Level: Silver
£600 limit
✓ £750, £1000 limits available
[Manage Limit] [Learn More]
```

### Manage Limit Modal
When user clicks "Manage Limit":

```
Choose Your Spending Limit

Current: £500

Available Options:
○ £250 - Lower limit, more frequent payments
○ £500 - Keep current (selected)
○ £750 - Fewer payment interruptions
○ £1000 - Maximum convenience

[Cancel] [Update Limit]
```

---

## Reminder System

### Gentle Nudges (Optional & Dismissible)

#### After 3rd payment at £50
"💡 You can now increase your limit to reduce payment frequency"

#### After 5th payment at same limit
"You've made 5 payments at this limit. Higher limits available."

#### After 10+ payments at £500 Bronze
"Many assessors find Silver's higher limits reduce interruptions."

### Principles
- **Never pushy** - Always dismissible
- **Educational** - Focus on benefits
- **Infrequent** - Max once per month
- **Contextual** - Only when relevant

---

## Key Design Principles

### User Control
- Every limit change is user-initiated (except account level)
- Downgrade always available
- No forced upgrades
- Clear escape hatches

### Risk Management
- £50 maximum exposure for new users
- 2-payment gates between tiers
- Proven behavior before options unlock
- Conservative defaults

### Progressive Disclosure
- Features appear when relevant
- "Manage Limit" only with options
- Complexity hidden until needed
- Educational approach

### Professional Respect
- No gamification or badges
- No manipulative tactics
- Clear business value
- Respects user intelligence

---

## Implementation Logic

### Progression Tracking
```javascript
// Check for automatic Silver upgrade
if (accountLevel === 'Bronze' &&
    currentLimit === 500 &&
    successfulPaymentsAtCurrentLimit >= 2) {

    // Upgrade account level, keep limit
    accountLevel = 'Silver';
    sendEmailNotification('silver_upgrade');
    showBillingBanner = true;
}

// Check for automatic Gold upgrade
if (accountLevel === 'Silver' &&
    currentLimit === 1000 &&
    successfulPaymentsAtCurrentLimit >= 2) {

    // Upgrade account level, keep limit
    accountLevel = 'Gold';
    sendEmailNotification('gold_upgrade');
    showBillingBanner = true;
}

// Calculate available limits
function getAvailableLimits(accountLevel, paymentHistory) {
    // Logic based on payment count at each tier
    // Returns array of available limit options
}
```

### Display Logic
```javascript
// Show/hide Manage Limit button
const hasOptions = availableLimits.length > 0 ||
                  currentLimit > minimumLimit;

if (hasOptions) {
    showManageLimitButton = true;
}
```

---

## Why This System Works

### For the Business
- **Risk capped** at £50 per new user
- **Natural segmentation** of user types
- **Reduced support** - self-service progression
- **Higher retention** - users feel in control

### For the Users
- **No surprises** - predictable progression
- **Full control** - change limits anytime
- **Clear value** - obvious benefits at each level
- **Professional** - respects their intelligence

### For Growth
- **Scalable** - automatic progression reduces manual work
- **Sustainable** - users graduate when ready
- **Profitable** - higher limits = more revenue
- **Defensible** - hard to replicate thoughtful design

---

## Summary

This is a purpose-built system that:
1. **Protects the business** from fraud (£50 max exposure)
2. **Respects users** with full control and no manipulation
3. **Scales naturally** through automatic Silver upgrades
4. **Communicates appropriately** via email and subtle UI
5. **Grows sustainably** with users' actual needs

The system works WITH user behavior, not against it. Some will stay at £50 forever, others will reach Gold monthly billing. Both paths are valid and supported.