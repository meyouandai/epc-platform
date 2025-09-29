# Assessor Dashboard - Payment & Billing Display

## Overview
This document outlines how payment information should be displayed to assessors, focusing on motivational messaging rather than punitive language.

## Payment Status Messaging

### Auto-Charge Assessors (Default for New Users)

#### Active/Accumulating
```
Current Period: £225 / £450
15 leads received this period
Automatic payment when threshold reached
```

#### Payment Processing
```
Processing payment... ⏳
Your service continues uninterrupted
```

#### Payment Failed
```
⚠️ Payment Required
Update payment method to continue receiving leads
[Update Payment Method] [Contact Support]
```

#### Payment Successful
```
✓ Payment Successful
Thank you! New billing period started.
```

### Post-Pay Assessors (Trusted Users Only)

#### Active Period
```
Current Period: £320 / £450
21 leads received
Invoice will be sent at £450 or month end
```

#### Invoice Due (Days 1-30)
```
💳 Payment Required
Invoice: INV-2024-101
Amount: £450
Days remaining: 28
[Pay Now] [Download Invoice]
```

#### Grace Period (Days 31-37)
```
⚠️ Payment Needed to Maintain Service
3 days grace period remaining
15 new leads waiting for you
[Pay Now to Resume]
```

#### Service Paused (Days 38-59)
```
🔴 Service Paused
Pay £450 to resume receiving leads
Missed opportunities: 32 leads (£480 value)
[Pay & Resume Service]
```

#### Legal Warning (Day 60+)
```
⚠️ Final Notice
Automatic legal proceedings will begin in 48 hours
Amount due: £450 plus £25 court fees
[Pay Now to Avoid Legal Action]
```

## Motivational Elements

### Show Opportunity Cost
- "23 leads waiting for you (worth ~£345)"
- "You're missing 5-7 leads daily"
- "Other assessors in your area received 45 leads this week"

### Positive Reinforcement
- "Excellent payment history - 12 on time!"
- "Gold member - Eligible for £600 threshold"
- "Thank you for your continued partnership"

### Progress Indicators
```
Trust Level Progress:
[████████░░] 8/10 payments to Platinum
Current: Gold | Next: £600 threshold available
```

## Interface Elements

### Payment Card
```
┌─────────────────────────────────┐
│ 💳 Billing & Payments           │
├─────────────────────────────────┤
│ Current Period                   │
│ £225 / £450 (50%)               │
│ ████████░░░░░░░░ 15 leads       │
│                                  │
│ Next charge: ~3 days             │
│ Payment method: •••• 4532        │
│                                  │
│ [View History] [Update Card]     │
└─────────────────────────────────┘
```

### Outstanding Invoices (Post-Pay)
```
┌─────────────────────────────────┐
│ 📄 Outstanding Invoices         │
├─────────────────────────────────┤
│ INV-2024-101 | £450 | Due in 15d│
│ INV-2024-098 | £300 | Due in 3d │
│                                  │
│ Total Due: £750                  │
│ [Pay All] [Pay Individual]       │
└─────────────────────────────────┘
```

## Language Guidelines

### DO Use:
- "Payment required"
- "Update needed"
- "Action required"
- "Continue receiving leads"
- "Unlock waiting leads"
- "Resume service"

### DON'T Use:
- "Overdue"
- "Failed"
- "Delinquent"
- "Suspended" (until day 38+)
- "Debt"
- "Outstanding balance"

## Automated Communications

### Email Templates

#### Day 1 (Threshold Reached)
Subject: "Your invoice is ready - £450"
Body: Positive, focus on leads delivered and value provided

#### Day 25 (Reminder)
Subject: "Payment reminder - 5 days remaining"
Body: Friendly reminder with easy payment link

#### Day 31 (Grace Period)
Subject: "Important: Maintain your lead flow"
Body: Emphasize opportunity cost, waiting leads

#### Day 60 (Legal)
Subject: "Final Notice - Legal Action Pending"
Body: Clear, factual, with exact consequences

## Technical Implementation Notes

### Status Mapping
```javascript
// Internal Status → Assessor Display
'overdue' → 'Payment Required'
'failed' → 'Update Payment Method'
'disputed' → 'Under Review'
'active' → 'Current Period'
'paid' → 'Paid - Thank You!'
```

### Grace Period Logic
```javascript
if (daysSinceInvoice <= 30) {
  show('Payment Required - X days remaining');
} else if (daysSinceInvoice <= 37) {
  show('Grace Period - Service continues');
} else if (daysSinceInvoice < 60) {
  show('Service Paused - Pay to Resume');
} else {
  show('Legal Action Pending');
}
```

## Mobile App Considerations

- Push notifications for payment reminders
- One-tap payment from notification
- Show leads waiting as badge count
- Celebrate successful payments with animation

## A/B Testing Opportunities

1. Test "X leads waiting" vs "£X value waiting"
2. Test grace period lengths (3 vs 7 days)
3. Test positive vs urgent messaging
4. Test showing peer comparisons

## Success Metrics

- Payment velocity (days to payment)
- Failed payment recovery rate
- Voluntary threshold upgrades
- Customer satisfaction scores
- Churn rate by payment method

---

## Notes

This approach prioritizes maintaining positive relationships while ensuring payment compliance. The escalation is gradual, giving assessors multiple opportunities to resolve issues before severe consequences.

Remember: The goal is to keep assessors active and paying, not to punish them. Every paused account is lost revenue for both parties.