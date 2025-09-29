# EPC Platform Trust Level System Design

## Overview
A progressive threshold system for assessors that balances risk management with user experience. Users start at £50 and can automatically progress to higher limits based on payment history.

## Core Design Principles

### Risk Management First
- **£50 Starting Threshold**: Optimal balance between accessibility and fraud protection
- **Maximum Fraud Exposure**: Limited to £50 per new user
- **Pre-authorization Option**: Available but not required for onboarding

### User Experience Priority
- **Try Before Commit**: Users can test the system without immediate charges
- **Automatic Progression**: No manual applications or credit checks required
- **Full Control**: Users can increase, decrease, or maintain their current threshold anytime
- **Transparent Pricing**: Same per-lead cost regardless of threshold level

## Trust Level Structure

### Bronze Level
**Starting Point**: £50 threshold
**Progression**: Automatic increases based on successful payments
**Available Thresholds**: £50, £100, £150, £200, £300, £450, £500

**Eligibility Logic**:
- 2 successful payments → £150 eligible
- 3 successful payments → £300 eligible
- 5 successful payments → £500 eligible
- Perfect payment record → Silver level eligible

### Silver Level
**Entry Requirement**: Consistent Bronze performance
**Available Thresholds**: £600, £750, £900, £1000
**Benefits**: Higher spending limits for busy periods

### Gold Level
**Entry Requirement**: Established Silver performance
**Primary Feature**: Monthly billing option instead of threshold payments
**Benefits**: Better cash flow management, professional invoicing

## Card Interface Design

### Information Hierarchy
1. **Trust Level**: Bronze/Silver/Gold with color coding
2. **Current Status**: Threshold amount and key metrics
3. **Eligibility**: Available upgrade options (when applicable)
4. **Actions**: Manage Limit and Learn More buttons

### Button Logic
- **Manage Limit**: Shown when user has upgrade/downgrade options
- **Learn More**: Always available for educational content
- **No Pressure**: Educational approach over sales pressure

### What NOT to Show
- Lead count estimates (pricing varies by area)
- Payment history counts (if already eligible)
- Unnecessary complexity or technical jargon

## Key Messaging Strategies

### For New Users
- **Safety Focus**: "You control your spending"
- **No Risk**: "Try it and run if unhappy"
- **Clear Benefits**: "Room for X leads before charge"

### For Established Users
- **Practical Benefits**: Focus on convenience over features
- **Cash Flow**: "Fewer payment interruptions during busy periods"
- **No Extra Costs**: "Same pricing, just higher runway"

### For Growing Businesses
- **Professional Features**: Monthly billing, better bookkeeping
- **Flexibility**: "Switch back anytime"
- **Business Benefits**: Multiple invoices, dedicated support

## Technical Implementation

### Core Component Structure
```tsx
// Trust Level Card in AssessorBilling.tsx
<div className="period-stat-card">
  <div className="stat-label">Trust Level</div>
  <div className="stat-value-large">{trustInfo.name}</div>
  <div className="stat-sublabel">
    {formatCurrency(currentBilling.threshold)} threshold
  </div>
  <div className="trust-progress">
    {currentBilling.maxEligibleThreshold > currentBilling.threshold && (
      <>✓ Eligible for {formatCurrency(currentBilling.maxEligibleThreshold)} limit</>
    )}
  </div>
  <div className="trust-actions">
    {hasOptions && <button>Manage Limit</button>}
    <button>Learn More</button>
  </div>
</div>
```

### Layout Structure
- **Three-card layout**: Spending, Leads, Trust Level
- **Responsive design**: Cards stack on mobile
- **Visual hierarchy**: Clear information flow
- **Consistent spacing**: 24px gaps, proper padding

## User Testing Insights

### What Users Actually Want
1. **Current State**: How much can I spend? How much have I spent?
2. **Available Actions**: What can I upgrade/downgrade to?
3. **Practical Benefits**: How does this help my business?

### What Users Don't Care About
- Historical payment counts (if already eligible)
- Lead count estimates (due to variable pricing)
- Abstract "trust building" concepts
- Complex feature explanations

## Risk Management Benefits

### Fraud Protection
- **Limited Exposure**: Maximum £50 loss per fraudulent user
- **Quick Detection**: Issues surface within first threshold
- **Easy Recovery**: Small amounts, manageable disputes

### Legitimate User Benefits
- **Fast Progression**: Good users reach higher limits quickly
- **No Barriers**: No credit checks or lengthy applications
- **Immediate Value**: Can start using service right away

## Business Benefits

### For EPC Platform
- **Reduced Risk**: Minimal fraud exposure
- **Higher Conversion**: Low barrier to entry
- **Better Retention**: Users invested in their progression
- **Scalable System**: Automatic progression reduces manual work

### For Assessors
- **Cash Flow Management**: Predictable spending limits
- **Professional Setup**: Monthly billing for established users
- **Growth Support**: System grows with their business
- **Full Control**: Complete autonomy over their limits

## Implementation Status

### Completed
- ✅ Basic trust level card design
- ✅ Three-card billing layout
- ✅ Progressive threshold logic
- ✅ Risk management framework
- ✅ User experience principles

### Next Steps
1. **Payment Methods Tab**: User testing simulation
2. **Onboarding Content**: Educational materials for new users
3. **Modal Interfaces**: Limit management workflows
4. **Level Transition**: Smooth progression between Bronze/Silver/Gold

## Design Validation

This system has been validated through:
- **Persona Analysis**: Different user types and needs
- **Risk Assessment**: Fraud protection vs user experience
- **User Testing Concepts**: Simulated assessor interactions
- **Business Case**: Revenue protection and growth potential

The £50 starting threshold emerged as the optimal balance point, providing meaningful protection against fraud while removing barriers for legitimate users to begin their assessment business journey.