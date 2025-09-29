# Account Level Progression System - Final Design

## Core Principle: User-Controlled Progression

**No Automatic Increases** - Users stay at their chosen limit until they actively decide to upgrade. The system offers opportunities but never forces changes.

---

## **STAGE 1: Brand New User (Day 1)**

**Display:**
```
Account Level: Bronze
£50 limit
[Learn More]
```

**What Happens:**
- User signs up and can immediately start purchasing leads
- System tracks their spending toward £50 limit
- Payment is automatically charged when £50 is reached (or at month-end, whichever first)
- **User stays at £50 limit** until they choose to change it

**Available Pathways:**
- **Only pathway:** Click "Learn More" to understand how the system works
- **No "Manage Limit"** because they haven't earned any options yet

**Business Logic:**
- Maximum risk exposure: £50 per new user
- "Try before commit" experience - users can test lead quality repeatedly at £50
- User maintains complete control over their spending limits

---

## **STAGE 2: First Eligibility Milestone**

**Display:**
```
Account Level: Bronze
£50 limit
✓ £100 limit available
[Manage Limit] [Learn More]
```

**What Happens:**
- User made their first successful £50 payment, proving they'll pay
- **User stays at £50 limit** (no automatic increase)
- They've earned eligibility for £100 (first upgrade option)
- System may show gentle reminder: "You can now increase your limit to £100 for more leads between payments"

**Available Pathways:**
1. **Manage Limit:** Choose £100 limit OR stay at £50
2. **Learn More:** Educational content about higher limits and benefits

**Business Logic:**
- First trust milestone reached - user has proven payment behavior
- "Manage Limit" appears for first time (progressive disclosure)
- User maintains control - can stick with £50 if preferred

---

## **STAGE 3: Multiple Payments, Still £50**

**Display:**
```
Account Level: Bronze
£50 limit (3 payments completed)
✓ £150 limit available
[Manage Limit] [Learn More]
```

**What Happens:**
- User has made multiple successful £50 payments
- **Still remains at £50** - no system changes without user action
- Earned higher limit eligibility through consistent payments
- Optional reminder system: "After 3 successful payments, you can now access £150 limits for fewer payment interruptions"

**Available Pathways:**
1. **Manage Limit:** Upgrade to £100, £150 OR stay at £50
2. **Learn More:** Benefits of higher limits, Silver level preview

**Business Logic:**
- Proven reliability unlocks options but doesn't force changes
- User may prefer frequent £50 payments (better cash flow for some)
- System respects user preference while offering growth opportunities

---

## **STAGE 4: Silver Eligibility Earned**

**Display:**
```
Account Level: Bronze
£50 limit (5+ payments completed)
✓ £300+ limits available
✓ Silver benefits available
[Manage Limit] [Learn More]
```

**What Happens:**
- User has demonstrated excellent payment track record with multiple £50 payments
- **Still at £50 limit** unless user chooses otherwise
- Unlocked Silver level benefits and higher limits
- Optional notification: "Congratulations! Your payment history has unlocked Silver account benefits and limits up to £300"

**Available Pathways:**
1. **Manage Limit:**
   - Stay Bronze: Choose £100, £150, £200, £300 limits while remaining Bronze
   - Upgrade to Silver: Access Silver account level
   - Stay at £50: Continue with current setup
2. **Learn More:** Compare Bronze vs Silver benefits, understand advantages

**Business Logic:**
- User has proven themselves completely reliable through multiple payments
- System offers significant upgrades but respects user's choice to stay simple
- Some users may prefer the predictability of £50 payments

---

## **User-Initiated Upgrades Only**

When a user chooses to upgrade their limit:

### **STAGE 5: User Chooses Higher Limit**

**If user selects £150:**
```
Account Level: Bronze
£150 limit
✓ £300 limit available
[Manage Limit] [Learn More]
```

**What Happens:**
- User actively chose £150 limit
- Can downgrade back to £50 or upgrade further based on earned eligibility
- System tracks spending toward new £150 threshold

### **STAGE 6: User Upgrades to Silver**

**If user chooses Silver account level:**
```
Account Level: Silver
£300 limit (user selected)
✓ £600 limit available
[Manage Limit] [Learn More]
```

**What Happens:**
- User actively chose Silver account level
- Selected their preferred limit within Silver range
- Can adjust limits or return to Bronze anytime

---

## **Reminder System (Optional)**

Instead of automatic increases, gentle reminders based on usage patterns:

**After 2nd £50 payment:**
- Subtle notification: "💡 You can now increase your limit to £100 to get more leads between payments"

**After 3rd £50 payment:**
- "You've earned £150 limit eligibility - fewer payment interruptions"

**After 5th £50 payment:**
- "Congratulations! Silver account benefits now available - higher limits and monthly billing options"

**Reminder Principles:**
- Optional and dismissible
- Educational, not pushy
- Focuses on user benefits (fewer interruptions, more convenience)
- Never forces changes

---

## **Why User-Controlled is Better**

### **Risk Management:**
- No unwanted limit increases for conservative users
- Users can't accidentally spend more than intended
- System maintains £50 maximum exposure until user explicitly agrees to more

### **User Experience:**
- Complete control over spending limits
- No surprises or unwanted changes
- Accommodates different business models and cash flow preferences
- Builds trust through respect for user preferences

### **Business Benefits:**
- Higher user satisfaction (no forced changes)
- Better retention (users feel in control)
- Natural segmentation (conservative vs growth-oriented users)
- Reduced support requests about unwanted limit changes

### **Progressive Growth:**
- Users graduate to higher limits when THEY'RE ready
- System provides clear pathways but never forces them
- Educational approach builds understanding before upgrades
- Sustainable growth based on user comfort levels

---

## **Payment Frequency Considerations**

Some users may actually PREFER frequent £50 payments because:
- **Better cash flow:** Smaller, predictable charges
- **Budget control:** Easier to track small amounts
- **Business accounting:** Simpler to categorize frequent small expenses
- **Risk aversion:** Comfortable with low exposure amounts

The system respects these preferences while offering growth paths for users who want them.

---

## **Final Account Level Progression**

**Bronze Account:** £50 - £300 limits (user controlled)
**Silver Account:** £300 - £1000 limits (user controlled)
**Gold Account:** Monthly billing with flexible credit (user controlled)

**Key Principle:** Every change is user-initiated. The system provides opportunities and education but NEVER forces upgrades or changes to user preferences.