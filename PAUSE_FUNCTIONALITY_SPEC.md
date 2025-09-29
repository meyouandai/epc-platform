# Pause Functionality Specification

## Overview
This document outlines the comprehensive pause functionality for the EPC assessor platform, including dynamic pricing, account benefits, and user experience flows.

## Core Principles

1. **Intent-Based Approach**: Different reasons for pausing require different solutions
2. **Market-Fair Pricing**: Holding fees reflect real demand from other assessors
3. **Account Tier Benefits**: Loyalty rewarded with tangible holding benefits
4. **Short-Term Focus**: Holding fees designed for convenience, not long-term storage
5. **Transparency**: Users see exactly why fees are what they are

## Account Status Card Design

### Visual Design
- **Neutral styling**: White background with gray border (#e5e7eb)
- **No color coding**: Professional appearance without relying on colors to convey meaning
- **Positioning**: Separate card between navigation tabs and content
- **Always visible**: Displayed regardless of active tab

### Content Structure
```
Account Status
┌─────────────────────────────────────────────┐
│ Lead Purchasing: [Active/Paused]           │
│ [Description of current state]             │
│                           [Action Button]  │
└─────────────────────────────────────────────┘
```

### States
- **Active**: "Actively acquiring leads across 12 post codes" + "Pause Purchasing" button
- **Paused**: "Purchasing suspended by user - post codes preserved" + "Resume Purchasing" button + info box

## Two-Path Strategy

### Pause Path (Low Pressure)
**Philosophy**: "They plan to return - make it easy and helpful"

- **Disclosure**: Optional at every step
- **Skip options**: Multiple opportunities to proceed quickly
- **Retention**: Focus on helpful alternatives (optimization, holiday mode)
- **Tone**: Supportive and respectful

### Cancel Path (High Pressure)
**Philosophy**: "This is permanent - worth fighting for every customer"

- **Disclosure**: Required reason (with skip option after social pressure)
- **Retention**: Aggressive offers escalating to final ultimatums
- **Confirmation**: Multi-step process with increasing urgency
- **Tone**: Loss-averse messaging with genuine value offers

## Dynamic Holding Fee System

### Pricing Structure
Holding fees calculated as: `Base Rate × Demand Multiplier × Account Discount`

#### Demand Tiers
- **FREE**: 0 assessors waiting
- **LOW**: 1-5 assessors waiting → £1-2/day
- **MEDIUM**: 6-15 assessors waiting → £3-4/day
- **HIGH**: 16-30 assessors waiting → £5-6/day
- **EXTREME**: 31+ assessors waiting → £7-8/day

#### Account Level Benefits

| Level | Free Days/Year | Additional Day Discount | Max Pause Duration |
|-------|---------------|------------------------|-------------------|
| Bronze | 0 | 0% | 30 days |
| Silver | 7 | 25% | 60 days |
| Gold | 14 | 50% | 90 days |
| Platinum | 30 | Free (up to 60 days total) | 120 days |

### Business Logic
- **Short-term premium**: Holding fees make sense for 1-2 week breaks
- **Progressive pricing**: Encourage release for longer pauses
- **Market efficiency**: High-demand areas cost more to hold
- **Loyalty rewards**: Account upgrades provide tangible benefits

### Example Calculation (Bronze User, 7-day pause)
```
M1 (47 waiting): £8/day × 7 days = £56
M2 (41 waiting): £7/day × 7 days = £49
M15 (23 waiting): £4/day × 7 days = £28
M25 (12 waiting): £2/day × 7 days = £14
M20 (4 waiting): £1/day × 7 days = £7
M3 (0 waiting): FREE × 7 days = £0
Others (low demand): £7 total

Total: £161 for 7 days
```

## Intent-Based Pause Options

### 1. Holiday/Vacation
- **Solution**: Holiday Mode with holding fees
- **Duration**: 1-2 weeks typically
- **Messaging**: "Keep your post codes while you're away"
- **Value**: Peace of mind vs. losing high-demand areas

### 2. Work Overload
- **Solution**: Smart Throttling instead of full pause
- **Options**: Daily limits, selective areas, time restrictions
- **Messaging**: "Control lead flow without losing coverage"
- **Value**: Maintain some revenue while managing workload

### 3. Cost Reduction
- **Solution**: Optimize Coverage using performance data
- **Approach**: Show data-driven area recommendations
- **Messaging**: "Reduce costs 60% with only 10% revenue impact"
- **Value**: Better ROI through smarter coverage

### 4. Extended Break
- **Solution**: Hibernation Mode with tiered pricing
- **Structure**: £10/month → £5/month → Free after 12 months
- **Messaging**: "Keep account active for uncertain return timeline"
- **Value**: Preserve account vs. complete deletion

### 5. Platform Issues
- **Solution**: Retention flow with support + offers
- **Approach**: Address root cause + incentivize staying
- **Offers**: Discounts, upgrades, credits, priority support
- **Value**: Last chance to save customer relationship

### 6. Personal Circumstances
- **Solution**: Compassionate pause (free/reduced rates)
- **Approach**: Flexible terms based on situation
- **Messaging**: "We understand life happens"
- **Value**: Build goodwill and brand loyalty

## User Experience Flows

### Modal Structure
```
Step 1: Intent Discovery
├─ "Why are you pausing?" (optional)
├─ Present 6 common scenarios
└─ Skip option available

Step 2: Tailored Solution
├─ Show appropriate option for intent
├─ Include cost/benefit analysis
└─ Alternative suggestions

Step 3: Holding Fee Calculation
├─ Dynamic pricing per post code
├─ Visual demand indicators
├─ Break-even analysis
└─ Account upgrade incentives

Step 4: Confirmation
├─ Summary of choices
├─ Expected resume date
└─ Reactivation process
```

### Post-Pause Experience
- **Status updates**: Regular check-ins during pause
- **Market alerts**: Notify when held areas become available
- **Easy reactivation**: One-click resume from profile
- **Usage tracking**: Show remaining free days for account level

## Data Requirements

### Per Post Code Tracking
- Current waitlist count (for demand pricing)
- Historical lead volume (for ROI calculations)
- User performance vs. area average
- Revenue potential calculations

### Account Level Tracking
- Free holding days used/remaining
- Historical pause frequency and duration
- Account upgrade eligibility
- Pause reason analytics

### Business Intelligence
- Pause reason distribution
- Retention rate by intervention type
- Revenue impact of holding vs. releasing areas
- Account upgrade conversion from pause scenarios

## Implementation Considerations

### Technical Requirements
- Real-time waitlist counting system
- Dynamic pricing calculation engine
- Account benefit tracking
- Automated billing for holding fees
- Scheduled reactivation system

### Business Rules
- Holding fees charged daily at pause initiation
- Account benefits reset annually
- Maximum pause durations enforced by account level
- Demand pricing updates every 24 hours
- Grace periods for accidental pauses

### Success Metrics
- Pause-to-resume conversion rate
- Average holding duration by account level
- Revenue generated from holding fees
- Account upgrade rate triggered by pause scenarios
- Customer satisfaction with pause experience

## Future Enhancements

### Advanced Features
- **Seasonal multipliers**: Higher fees during peak EPC periods
- **Predictive pricing**: ML-based demand forecasting
- **Partial holds**: Hold specific days of the week only
- **Area swapping**: Exchange held areas with other users
- **Group discounts**: Team/company pause benefits

### Integration Opportunities
- **Calendar sync**: Automatic pause for scheduled vacations
- **Weather integration**: Pause during extreme weather periods
- **Business cycle alignment**: Pause during slow seasons
- **Partner benefits**: Holding discounts for preferred suppliers

---

*This specification provides the foundation for a comprehensive pause system that balances user needs with business objectives while creating clear paths for account growth and customer retention.*