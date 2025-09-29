# EPC Platform - Coverage Structure Documentation

## Overview
This document defines the geographic coverage structure used across the EPC platform, with different data exposure levels for Admin vs Assessor interfaces.

## Geographic Hierarchy

### England & Wales Coverage Structure
```
Country
├── County/Region
    ├── District/Borough (admin) / Area (assessor)
        └── Postcodes
```

## London Structure

### Regional Organization (5 separate county-level regions)
```
London (Central)
├── City of London
├── Westminster
├── Camden
├── Islington
├── Kensington & Chelsea
└── Hammersmith & Fulham

London (North)
├── Barnet
├── Enfield
├── Haringey
├── Harrow
├── Brent
├── Waltham Forest
└── Hillingdon

London (South)
├── Lambeth
├── Southwark
├── Wandsworth
├── Lewisham
├── Greenwich
├── Bromley
├── Croydon
├── Merton
└── Sutton

London (East)
├── Tower Hamlets
├── Hackney
├── Newham
├── Redbridge
├── Barking & Dagenham
└── Havering

London (West)
├── Ealing
├── Hounslow
├── Richmond upon Thames
└── Kingston upon Thames
```

### Detailed Borough Breakdown

#### Central London (5-6 boroughs)
- City of London (EC postcodes)
- Westminster (SW1*, W1*, WC* postcodes)
- Camden (NW1, NW3, NW5, N1, N7, N19)
- Islington (N1, N7, N19)
- Kensington & Chelsea (SW3, SW5, SW7, SW10, W8, W10, W11, W14)
- Hammersmith & Fulham (SW6, W6, W12) *[Borderline: Could be West London]*

#### North London (6-7 boroughs)
- Barnet (N2, N3, N11, N12, N14, N20, EN4, EN5, HA8)
- Enfield (EN1, EN2, EN3, N9, N13, N18, N21)
- Haringey (N4, N6, N8, N10, N15, N17, N22)
- Harrow (HA1, HA2, HA3, HA5, HA6, HA7)
- Brent (NW2, NW9, NW10, HA0, HA9)
- Waltham Forest (E4, E10, E11, E17) *[Borderline: Could be East London]*
- Hillingdon (UB3, UB4, UB7-UB11, HA4, HA6) *[Borderline: Could be West London]*

#### South London (8-9 boroughs)
- Lambeth (SE1, SE11, SE24, SW2, SW4, SW8, SW9, SW16)
- Southwark (SE5, SE15, SE16, SE17, SE21, SE22)
- Wandsworth (SW11, SW12, SW15, SW17, SW18)
- Lewisham (SE4, SE6, SE8, SE13, SE14, SE23)
- Greenwich (SE3, SE7, SE9, SE10, SE18)
- Bromley (BR1-BR8, SE19, SE20, SE25, SE26)
- Croydon (CR0, CR2-CR9)
- Merton (SW19, SW20, CR4)
- Sutton (SM1-SM6) *[Borderline: Could be West London]*

#### East London (6-7 boroughs)
- Tower Hamlets (E1, E2, E3, E14, E1W)
- Hackney (E5, E8, E9, N1, N16)
- Newham (E6, E7, E12, E13, E15, E16)
- Redbridge (IG1-IG8)
- Barking & Dagenham (IG11, RM8-RM10)
- Havering (RM1-RM7, RM11-RM14)
- Waltham Forest (E4, E10, E11, E17) *[Borderline: Could be North London]*

#### West London (6-7 boroughs)
- Ealing (W3, W5, W7, W13, UB1, UB2, UB5, UB6)
- Hounslow (TW3-TW8, TW14)
- Richmond upon Thames (TW1, TW2, TW9-TW13)
- Kingston upon Thames (KT1-KT6, KT9)
- Hammersmith & Fulham (SW6, W6, W12) *[Borderline: Could be Central London]*
- Hillingdon (UB3, UB4, UB7-UB11, HA4, HA6) *[Borderline: Could be North London]*
- Sutton (SM1-SM6) *[Borderline: Could be South London]*

### Regional Borderline Cases
**Flexible Borough Placement:**
- **Sutton**: Currently South London, could be West London
- **Waltham Forest**: Currently North London, could be East London
- **Hillingdon**: Currently North London, could be West London
- **Hammersmith & Fulham**: Currently West London, could be Central London

**Search Functionality Benefits:**
- Assessors can find boroughs regardless of regional placement
- Auto-expansion handles geographic disagreements
- Flexible mental models accommodated by search

## Other Major Regions

### Birmingham & West Midlands
- Birmingham Central (B1-B3)
- Coventry (CV1, CV2)
- Wolverhampton (WV1, WV2)
- Solihull (B90, B91)
- Walsall (WS1, WS2)
- Dudley (DY1, DY2)

### Greater Manchester
- Manchester Central (M1, M2)
- Stockport (SK1, SK2)
- Bolton (BL1, BL2)
- Oldham (OL1, OL2)
- Rochdale (OL10, OL11)

### Yorkshire
- Leeds (LS1, LS2)
- Sheffield (S1, S2)
- Bradford (BD1, BD2)
- York (YO1, YO10)
- Hull (HU1, HU2)

### Wales
- Cardiff & South Wales (CF10, CF11, CF14)
- Swansea & West Wales (SA1, SA2)
- Newport & Gwent (NP19, NP20)
- Wrexham & North Wales (LL11, LL12)
- Bangor & Anglesey (LL57, LL58)
- Aberystwyth & Mid Wales (SY23, SY24)

## Data Models

### Admin Interface Data Structure
```typescript
interface CountyData {
  id: string;
  name: string;
  assessorCount: number;
  districtCount: number;
  totalPostcodes: number;
  activePostcodes: number;
  districts: DistrictData[];
}

interface DistrictData {
  id: string;
  name: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days: number;
  postcodes: PostcodeData[];
}

interface PostcodeData {
  code: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days: number;
}
```

### Assessor Interface Data Structure
```typescript
interface AssessorCoverageArea {
  id: string;
  name: string;
  regions: AssessorRegion[];
}

interface AssessorRegion {
  id: string;
  name: string; // e.g., "London (North)", "London (South)"
  boroughs: AssessorBorough[];
}

interface AssessorBorough {
  id: string;
  name: string; // e.g., "Haringey", "Westminster"
  postcodes: AssessorPostcode[];
}

interface AssessorPostcode {
  code: string;
  available: boolean;
  assessorCount: number;
  maxAssessors: number; // Always 4
  currentlySelected: boolean; // User's current coverage
  onWaitlist: boolean; // User is on waitlist for this postcode
  waitlistCount?: number; // Total assessors waiting (optional visibility)
}
```

## Business Rules

### Assessor Capacity
- **Maximum 4 assessors per postcode**
- **No minimum** - postcodes can have 0 assessors
- **First-come-first-served** for postcode selection

### Coverage Selection
- Assessors can select any available postcode
- Cannot select postcodes at capacity (4/4)
- Can remove their coverage at any time
- Can add coverage if under their subscription limit

### Waitlist System
- **For full postcodes**: "Notify When Available" button
- **Queue system**: First-come-first-served when spots open
- **Email notifications**: Automatic alerts when capacity becomes available
- **Interest tracking**: Admin can see demand for full areas
- **Waitlist management**: Assessors can view/cancel their waitlists

### Data Visibility

#### Admin Interface (Internal)
- **Full business intelligence**: Lead counts, trends, capacity metrics
- **Strategic overview**: Regional performance, growth areas
- **Operational data**: Assessor distribution, demand vs supply
- **Financial metrics**: Revenue potential, coverage gaps

#### Assessor Interface (Customer-facing)
- **Geographic structure**: Regions, boroughs, postcodes
- **Availability status**: Available, full, currently covered
- **Coverage management**: Add/remove postcodes from coverage
- **Waitlist functionality**: "Notify When Available" for full areas
- **No business metrics**: No lead counts, demand data, or competitor information

## Search Functionality

### Auto-expansion Rules
- Searching postcode (e.g., "SW1") expands relevant county/region/borough
- Searching borough (e.g., "Camden") expands relevant county/region
- Searching region (e.g., "North London") expands relevant county
- Clear search collapses all expanded sections

### Search Matching
- **Counties/Regions/Boroughs**: `startsWith()` matching
- **Postcodes**: `startsWith()` matching
- **Case insensitive** for all searches

## Implementation Notes

### Admin Interface Priorities
- **High Priority**: Areas with high leads, low assessor count
- **Color coding**: Red (0-1 assessors), Orange (2-3 assessors), Green (4 assessors)
- **Trend indicators**: SVG icons with percentage changes
- **Filtering**: Low coverage, coverage gaps filters

### Assessor Interface Priorities
- **Simplicity**: Just show available areas
- **Coverage status**: Clear indicators of availability
- **No competitive data**: Hide lead counts and demand metrics
- **Easy selection**: Simple add/remove functionality

## Future Considerations

### Potential Expansions
- **Scotland**: Would require additional regional structure
- **Northern Ireland**: Separate coverage area
- **Channel Islands/IoM**: Special handling required

### Business Model Evolution
- **Dynamic pricing**: Different rates per postcode
- **Assessor tiers**: Premium assessors get priority selection
- **Subscription limits**: Max postcodes per assessor tier

## Advanced Business Model Features

### Coverage Gap Solutions

#### Silent Extended Coverage (Launch Phase)
- **Automatic nearby coverage**: Assessors receive leads from uncovered postcodes within 10-mile radius
- **Zero additional cost**: Free leads during market validation phase
- **Transparent communication**: Email/SMS notification explaining process to assessors
- **Future transition**: Convert high-demand areas to paid coverage after 3-6 months

#### Database Requirements
```typescript
interface AssessorSettings {
  nearbyCoverage: {
    enabled: boolean; // Auto-enabled for launch phase assessors
    radius: number; // Default 10 miles
    notifiedAt: Date; // When assessor was informed of feature
  };
}
```

### Dynamic Pricing Strategy

#### Market-Responsive Pricing
- **High coverage areas (4/4)**: Standard per-lead pricing
- **Medium coverage (2-3/4)**: Reduced per-lead rates to encourage expansion
- **Low coverage (0-1/4)**: Alternative pricing models
  - Monthly retainer (£50/month for priority access)
  - Hybrid model (£20/month + reduced per-lead)
  - Performance bonuses (free month after 10 completions)
- **Strategic areas**: Risk-sharing models, revenue share options

#### Pricing Intelligence
- **Market signals**: Price differences indicate supply/demand imbalances
- **Recruitment targeting**: "Special rates available in your area"
- **Competitive positioning**: Undercut competitors in undersupplied markets

### Lead Quality Protection

#### Real-time Validation
- **Phone verification**: API validation against telecom databases
  - Invalid numbers blocked immediately
  - Landlines redirected to mobile requirement
  - VoIP/disposable numbers rejected
- **Email verification**: Instant domain/syntax validation
  - Disposable email detection
  - Typo correction suggestions (gmial.com → gmail.com)
- **Address validation**: Postcode verification and property existence checks

#### Fraud Prevention System
```typescript
interface FraudDetection {
  riskScore: number; // 0-100
  patterns: {
    multiplePostcodes: boolean; // Same contact, different locations
    rapidSubmissions: boolean; // Multiple requests within short timeframe
    suspiciousDetails: boolean; // Invalid property information
    knownFraudPatterns: boolean; // Machine learning identified patterns
  };
  action: 'allow' | 'review' | 'block';
}
```

#### Pattern Monitoring
- **Contact abuse**: Same phone/email across multiple postcodes
- **Sequential accounts**: Pattern detection for related email addresses
- **Geographic anomalies**: Requests from non-existent or suspicious locations
- **Behavioral analysis**: Machine learning adaptation from confirmed fraud cases

#### Quality Assurance
- **Dispute system**: Easy "Report Lead Issue" functionality
- **Automatic refunds**: Verified false leads refunded within 48 hours
- **Quality metrics**: Track conversion rates and lead authenticity
- **Pattern learning**: System improves fraud detection over time

### Operational Intelligence

#### Coverage Analytics
- **Demand mapping**: Search frequency by uncovered postcodes
- **Recruitment priorities**: Target areas with proven customer demand
- **Market gaps**: Identify high-search, zero-coverage areas
- **Growth opportunities**: Natural expansion paths for existing assessors

#### Business Model Transitions
- **Phase 1 (Launch)**: Free extended coverage, market validation
- **Phase 2 (Growth)**: Convert proven areas to paid, maintain free trials for new areas
- **Phase 3 (Maturity)**: Standard pricing model with proven demand coverage

---

*This advanced structure creates a self-improving platform that optimizes coverage, prevents fraud, and adapts pricing to market conditions while maintaining seamless user experiences for both assessors and customers.*