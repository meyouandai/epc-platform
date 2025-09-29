# EPC Assessor Lead Generation Platform

A marketplace platform connecting customers needing Energy Performance Certificates with local EPC assessors. Customers enter their postcode and see up to 4 available assessors in their area. Assessors pay per qualified lead generated.

## 🚀 Features

- **Postcode-based Search**: Customers find assessors by entering their postcode
- **Geographic Matching**: Smart algorithm shows 4 best assessors based on location and ratings
- **Lead Generation**: Automatic lead creation when customers contact assessors
- **Pay-per-Lead Billing**: Assessors charged £5 per qualified lead via Stripe
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live assessor availability and ratings

## 🛠 Tech Stack

- **Frontend**: React with TypeScript, responsive CSS
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL (currently using in-memory for demo)
- **Payments**: Stripe integration
- **Geolocation**: UK postcode to coordinates mapping

## 📦 Installation

1. **Clone and install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your Stripe keys and database URL
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

   Or start components separately:
   ```bash
   # Terminal 1 - Backend (port 5001)
   npm run server

   # Terminal 2 - Frontend (port 3001)
   npm run client
   ```

## 🌐 Access

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 🏗 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main app component
│   │   └── App.css         # Styling
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   ├── utils/              # Utilities (billing, etc.)
│   └── index.js            # Server entry point
├── project_context/        # Project documentation
└── problem_tracking/       # Development issue tracking
```

## 🔧 API Endpoints

### Assessors
- `GET /api/assessors/search?postcode=SW1A1AA` - Find assessors by postcode
- `POST /api/assessors/register` - Register new assessor
- `PUT /api/assessors/:id` - Update assessor profile

### Leads
- `POST /api/leads` - Create new lead (triggers billing)
- `GET /api/leads/assessor/:assessorId` - Get leads for assessor

### Payments
- `POST /api/payments/setup-payment` - Setup payment method
- `POST /api/payments/charge-lead` - Charge for lead
- `GET /api/payments/history/:assessorId` - Billing history

## 💡 Business Model

- **£5 per lead**: Assessors charged when customers make contact
- **Geographic coverage**: Assessors set their service areas
- **Performance ranking**: Better ratings = higher visibility
- **Quality leads**: Only genuine customer inquiries are charged

## 🎯 Demo Data

The platform includes 5 demo assessors covering London SW1A area:
- John Smith (Smith Energy Assessments) - £85, 5-star rating
- Sarah Johnson (Green Home Surveys) - £75, 4-star rating
- Mike Williams (Eco Property Assessments) - £90, 5-star rating
- Emma Davis (London EPC Solutions) - £80, 4-star rating
- David Brown (Capital Energy Certs) - £95, 5-star rating

## 🔐 Environment Variables

```bash
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://localhost:5432/epc_platform

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Application
DOMAIN=http://localhost:3001
LEAD_CHARGE_AMOUNT=500  # £5.00 in pence
```

## 🚀 Deployment

The platform is ready for production deployment on:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, AWS
- **Database**: PostgreSQL on Railway, AWS RDS

## 📈 Next Steps

1. **Database**: Replace in-memory storage with PostgreSQL
2. **Authentication**: Add user authentication for assessors
3. **Dashboard**: Assessor dashboard for lead management
4. **Advanced Search**: Filter by price, ratings, availability
5. **Reviews**: Customer review system
6. **Analytics**: Business intelligence dashboard

## 🛡 Security

- Rate limiting enabled
- Helmet security headers
- Input validation
- Secure payment processing via Stripe

---

**Ready to revolutionize the EPC industry with AI-powered marketplace technology.**