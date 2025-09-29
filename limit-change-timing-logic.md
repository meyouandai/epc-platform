# Spending Limit Change - Timing Logic

## Overview
When users change their spending limits, the system applies changes based on simple logic to avoid forcing immediate charges while maximizing user convenience.

## Core Logic

### Immediate Effect
Changes take effect immediately when:
1. **Limit increases** (always safe)
2. **Limit decreases** where `currentSpend < newLimit` (no forced charge)

### Next Billing Cycle Effect
Changes take effect after next payment when:
- **Limit decreases** where `currentSpend >= newLimit` (would force immediate charge)

## Implementation

```javascript
function canApplyImmediately(currentSpend, newLimit, currentLimit) {
    return newLimit > currentLimit || currentSpend < newLimit;
}

function getTimingMessage(currentSpend, newLimit, currentLimit) {
    if (newLimit > currentLimit) {
        return "Your new limit is active immediately.";
    } else if (currentSpend < newLimit) {
        return "Your new limit is active immediately.";
    } else {
        return `Your new limit will apply after your next payment as you've already spent £${currentSpend} this period.`;
    }
}
```

## User Messaging Examples

### Immediate Changes
- **Increase**: "Your billing limit will change from £100 to £250.\n\nYour new limit is active immediately. You'll be charged automatically when you reach £250."
- **Decrease (safe)**: "Your billing limit will change from £500 to £250.\n\nYour new limit is active immediately. You'll be charged automatically when you reach £250."

### Delayed Changes
- **Decrease (over limit)**: "Your billing limit will change from £500 to £250.\n\nYour new limit will apply after your next payment as you've already spent £400 this period."

## Backend Requirements

### Database Fields
- `current_limit` - Active spending limit
- `pending_limit` - Limit to apply next cycle (if different from current)
- `pending_limit_reason` - Why change is delayed
- `current_period_spend` - Accumulated spend in current billing period
- `limit_change_timestamp` - When change was requested

### API Endpoints

#### POST /api/billing/limit/change
```json
{
  "newLimit": 250,
  "currentSpend": 400,
  "currentLimit": 500
}
```

Response:
```json
{
  "success": true,
  "effectiveImmediately": false,
  "message": "Your new limit will apply after your next payment as you've already spent £400 this period.",
  "currentLimit": 500,
  "pendingLimit": 250,
  "nextBillingDate": "2025-02-15"
}
```

### Business Logic
1. Calculate if change can be immediate using core logic
2. If immediate: Update `current_limit`, clear `pending_limit`
3. If delayed: Set `pending_limit`, keep `current_limit` unchanged
4. On next billing cycle: Apply any `pending_limit` changes
5. Return appropriate user messaging

## Edge Cases

### Multiple Changes
- If user makes multiple changes before next billing cycle, only latest pending change applies
- Previous pending changes are overridden

### Account Level Changes
- Limit changes do NOT affect account level (Bronze/Silver/Gold)
- Account levels are based on total historical spend
- Only the spending limit threshold changes

## Integration Notes

- Frontend confirmation modal uses same logic for messaging
- Email confirmations should include timing explanation
- Billing system must check for pending limit changes each cycle
- Admin panel should show both current and pending limits