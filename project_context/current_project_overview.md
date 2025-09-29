# Project: EPC Assessor Lead Generation Platform

## Overview
Building a marketplace platform connecting customers needing Energy Performance Certificates with local EPC assessors. Customers enter their postcode and see 4 available assessors in their area. Revenue model: charge assessors per qualified lead generated.

## Architecture Decisions
- Frontend: React with TypeScript for responsive customer interface
- Backend: Node.js/Express REST API
- Database: PostgreSQL for robust relational data management
- Geolocation: UK postcode to coordinates mapping with radius-based matching
- Payment: Stripe integration for assessor billing
- Hosting: Cloud deployment ready (AWS/Vercel)

## Development Phases
- [x] Project initialization and base setup ✓ 2025-09-22 21:28
- [x] Customer postcode search interface ✓ 2025-09-22 21:28
- [x] Assessor registration and profile system ✓ 2025-09-22 21:28
- [x] Geographic matching algorithm (4 assessors per postcode) ✓ 2025-09-22 21:28
- [x] Lead management and billing system ✓ 2025-09-22 21:28
- [x] Payment processing integration ✓ 2025-09-22 21:28
- [x] Testing and initial deployment ✓ 2025-09-22 21:28
- [x] Assessor authentication system ✓ 2025-09-22 21:35
- [x] Assessor dashboard with leads management ✓ 2025-09-22 21:35
- [x] Assessor registration flow ✓ 2025-09-22 21:35
- [ ] Production database setup
- [ ] Advanced features and analytics

## Current Status
**Phase:** Complete marketplace platform with full assessor dashboard

## Live Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **Status**: Running and operational

## Assessor Dashboard Features
- Secure authentication (register/login)
- Lead statistics and tracking
- Real-time billing status
- Profile management
- Payment history
- Coverage area management

## Key Features
- Postcode-based assessor discovery
- Geographic coverage management for assessors
- Automated lead distribution (max 4 per search)
- Pay-per-lead billing system
- Assessor performance tracking
- Customer contact form integration

## Business Model
- Assessors pay per qualified lead (£X per customer contact)
- Geographic exclusivity optional (premium tier)
- Performance-based ranking in search results