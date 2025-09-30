// Mock data for development and testing without PostgreSQL

// Mock assessors data
const mockAssessors = [
  {
    id: 'asm_001',
    name: 'John Smith',
    company: 'Smith Energy Assessments',
    email: 'john@smithenergy.co.uk',
    password: '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6', // password123
    phone: '07123456789',
    rating: 5.0,
    review_count: 47,
    price: '£85',
    verified: true,
    status: 'active',
    trust_level: 'silver',
    spending_threshold: 500.00,
    current_period_spend: 225.50,
    total_successful_payments: 12,
    account_paused: false,
    created_at: new Date('2024-12-01T09:00:00Z'),
    approved_at: new Date('2024-12-02T10:00:00Z')
  },
  {
    id: 'asm_002',
    name: 'Sarah Johnson',
    company: 'Green Home Surveys',
    email: 'sarah@greenhome.co.uk',
    password: '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6', // password123
    phone: '07234567890',
    rating: 4.8,
    review_count: 32,
    price: '£75',
    verified: true,
    status: 'active',
    trust_level: 'bronze',
    spending_threshold: 250.00,
    current_period_spend: 180.25,
    total_successful_payments: 8,
    account_paused: false,
    created_at: new Date('2024-12-15T14:30:00Z'),
    approved_at: new Date('2024-12-16T11:00:00Z')
  },
  {
    id: 'asm_003',
    name: 'Mike Williams',
    company: 'Eco Property Assessments',
    email: 'mike@ecoproperty.co.uk',
    password: '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6', // password123
    phone: '07345678901',
    rating: 4.9,
    review_count: 89,
    price: '£90',
    verified: false,
    status: 'pending',
    trust_level: 'bronze',
    spending_threshold: 250.00,
    current_period_spend: 95.00,
    total_successful_payments: 3,
    account_paused: false,
    created_at: new Date('2025-09-05T11:15:00Z')
  }
];

// Mock admins data
const mockAdmins = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@epcplatform.com',
    password: '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6', // password123
    name: 'Platform Administrator',
    role: 'admin',
    created_at: new Date('2025-01-01')
  }
];

// Mock leads data
const mockLeads = [
  {
    id: 'lead_001',
    customer_name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '07111222333',
    address: '10 Downing Street',
    postcode: 'SW1A 1AA',
    property_type: 'residential',
    bedrooms: 3,
    timeframe: 'within_week',
    additional_info: 'Urgent assessment needed',
    status: 'new',
    price: 4.00,
    created_at: new Date('2025-09-25T10:30:00Z'),
    updated_at: new Date('2025-09-25T10:30:00Z')
  },
  {
    id: 'lead_002',
    customer_name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '07222333444',
    address: '123 Business Park',
    postcode: 'SW1P 2BB',
    property_type: 'commercial',
    bedrooms: null,
    timeframe: 'immediate',
    additional_info: 'Commercial property assessment',
    status: 'contacted',
    price: 3.50,
    created_at: new Date('2025-09-26T14:20:00Z'),
    updated_at: new Date('2025-09-26T15:00:00Z')
  },
  {
    id: 'lead_003',
    customer_name: 'Carol Williams',
    email: 'carol@example.com',
    phone: '07333444555',
    address: '456 Residential Road',
    postcode: 'B1 1CC',
    property_type: 'residential',
    bedrooms: 2,
    timeframe: 'within_month',
    additional_info: 'Flexible on timing',
    status: 'new',
    price: 3.00,
    created_at: new Date('2025-09-27T09:15:00Z'),
    updated_at: new Date('2025-09-27T09:15:00Z')
  }
];

// Mock lead-assessor assignments
const mockLeadAssessors = [
  {
    id: 'la_001',
    lead_id: 'lead_001',
    assessor_id: 'asm_001',
    assigned_at: new Date('2025-09-25T10:35:00Z'),
    status: 'assigned'
  },
  {
    id: 'la_002',
    lead_id: 'lead_001',
    assessor_id: 'asm_002',
    assigned_at: new Date('2025-09-25T10:35:00Z'),
    status: 'assigned'
  },
  {
    id: 'la_003',
    lead_id: 'lead_002',
    assessor_id: 'asm_001',
    assigned_at: new Date('2025-09-26T14:25:00Z'),
    status: 'contacted'
  }
];

// Mock postcode assignments
const mockPostcodes = [
  { id: 'pc_001', assessor_id: 'asm_001', postcode: 'SW1A', price: 4.00, status: 'active', added_at: new Date() },
  { id: 'pc_002', assessor_id: 'asm_001', postcode: 'SW1P', price: 3.50, status: 'active', added_at: new Date() },
  { id: 'pc_003', assessor_id: 'asm_001', postcode: 'SW1V', price: 4.50, status: 'paused', added_at: new Date() },
  { id: 'pc_004', assessor_id: 'asm_002', postcode: 'SW1A', price: 4.00, status: 'active', added_at: new Date() },
  { id: 'pc_005', assessor_id: 'asm_002', postcode: 'B1', price: 3.00, status: 'active', added_at: new Date() },
  { id: 'pc_006', assessor_id: 'asm_002', postcode: 'CV1', price: 3.50, status: 'active', added_at: new Date() }
];

// Mock billing documents
const mockBillingDocuments = [
  {
    id: 'bill_001',
    assessor_id: 'asm_001',
    document_number: 'INV-2025-001',
    type: 'invoice',
    amount: 225.50,
    status: 'paid',
    period_start: new Date('2025-09-01'),
    period_end: new Date('2025-09-30'),
    payment_date: new Date('2025-09-28'),
    lead_count: 15,
    created_at: new Date('2025-09-01T00:00:00Z')
  },
  {
    id: 'bill_002',
    assessor_id: 'asm_001',
    document_number: 'CR-2025-001',
    type: 'credit',
    amount: -12.00,
    status: 'applied',
    reason: 'Duplicate lead refund',
    applied_to_document_id: 'bill_001',
    created_at: new Date('2025-09-15T00:00:00Z')
  },
  {
    id: 'bill_003',
    assessor_id: 'asm_002',
    document_number: 'INV-2025-002',
    type: 'invoice',
    amount: 180.25,
    status: 'paid',
    period_start: new Date('2025-09-01'),
    period_end: new Date('2025-09-30'),
    payment_date: new Date('2025-09-29'),
    lead_count: 12,
    created_at: new Date('2025-09-01T00:00:00Z')
  }
];

module.exports = {
  mockAssessors,
  mockAdmins,
  mockLeads,
  mockLeadAssessors,
  mockPostcodes,
  mockBillingDocuments
};