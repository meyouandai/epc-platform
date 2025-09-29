-- EPC Platform Database Schema
-- Run this to set up your PostgreSQL database

-- Create the database (run this separately first)
-- CREATE DATABASE epc_platform;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS billing_documents CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS assessor_postcodes CASCADE;
DROP TABLE IF EXISTS lead_assessors CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS assessors CASCADE;

-- Assessors table
CREATE TABLE assessors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    price VARCHAR(20) DEFAULT '£80',
    verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, health_risk, inactive, new
    health_risk_reasons TEXT[],
    coordinates POINT,
    stripe_customer_id VARCHAR(255),
    trust_level VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
    spending_threshold DECIMAL(10,2) DEFAULT 250.00,
    current_period_spend DECIMAL(10,2) DEFAULT 0.00,
    total_successful_payments INTEGER DEFAULT 0,
    account_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    property_type VARCHAR(50) NOT NULL, -- residential, commercial
    bedrooms INTEGER,
    timeframe VARCHAR(50) NOT NULL, -- immediate, within_week, within_month, flexible
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, quoted, completed, cancelled
    price DECIMAL(10,2) NOT NULL,
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead-Assessor junction table (many-to-many)
CREATE TABLE lead_assessors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'assigned', -- assigned, contacted, quoted, completed
    notes TEXT,
    UNIQUE(lead_id, assessor_id)
);

-- Assessor postcodes (coverage areas)
CREATE TABLE assessor_postcodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
    postcode VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, inactive
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessor_id, postcode)
);

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- card, bank_account
    last4 VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Billing documents (invoices, credit notes, refunds)
CREATE TABLE billing_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
    document_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- invoice, credit, refund
    period_start DATE,
    period_end DATE,
    amount DECIMAL(10,2) NOT NULL,
    lead_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, issued, applied, refunded
    payment_date DATE,
    payment_method VARCHAR(255),
    related_document_id UUID REFERENCES billing_documents(id),
    applied_to_document_id UUID REFERENCES billing_documents(id),
    credits_applied DECIMAL(10,2) DEFAULT 0.00,
    reason TEXT,
    refund_date DATE,
    stripe_invoice_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_assessors_email ON assessors(email);
CREATE INDEX idx_assessors_status ON assessors(status);
CREATE INDEX idx_assessors_coordinates ON assessors USING GIST(coordinates);
CREATE INDEX idx_leads_postcode ON leads(postcode);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_coordinates ON leads USING GIST(coordinates);
CREATE INDEX idx_lead_assessors_lead_id ON lead_assessors(lead_id);
CREATE INDEX idx_lead_assessors_assessor_id ON lead_assessors(assessor_id);
CREATE INDEX idx_assessor_postcodes_assessor_id ON assessor_postcodes(assessor_id);
CREATE INDEX idx_assessor_postcodes_postcode ON assessor_postcodes(postcode);
CREATE INDEX idx_billing_documents_assessor_id ON billing_documents(assessor_id);
CREATE INDEX idx_billing_documents_type ON billing_documents(type);
CREATE INDEX idx_billing_documents_status ON billing_documents(status);

-- Insert default admin
INSERT INTO admins (name, email, password, role) VALUES (
    'Platform Administrator',
    'admin@epcplatform.com',
    '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6', -- password123
    'admin'
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessors_updated_at BEFORE UPDATE ON assessors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_documents_updated_at BEFORE UPDATE ON billing_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();