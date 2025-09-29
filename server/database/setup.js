const fs = require('fs');
const path = require('path');
const { pool } = require('../models/database');

async function setupDatabase() {
  try {
    console.log('Setting up EPC Platform database...');

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('✓ Executed schema statement');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('⚠ Table already exists, skipping...');
          } else {
            console.error('Error executing statement:', error.message);
            console.error('Statement:', statement.substring(0, 100) + '...');
          }
        }
      }
    }

    // Insert sample data
    await insertSampleData();

    console.log('✅ Database setup completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@epcplatform.com / password123');
    console.log('Assessor: john@smithenergy.co.uk / password123');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

async function insertSampleData() {
  console.log('Inserting sample data...');

  try {
    // Insert sample assessors
    await pool.query(`
      INSERT INTO assessors (
        name, company, email, password, phone, rating, review_count, price,
        verified, status, coordinates, stripe_customer_id, trust_level,
        spending_threshold, current_period_spend, total_successful_payments
      ) VALUES
      (
        'John Smith', 'Smith Energy Assessments', 'john@smithenergy.co.uk',
        '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6',
        '07123456789', 5.0, 47, '£85', true, 'active',
        ST_MakePoint(-0.1419, 51.5014), 'cus_assessor_001', 'silver',
        500.00, 225.50, 12
      ),
      (
        'Sarah Johnson', 'Green Home Surveys', 'sarah@greenhome.co.uk',
        '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6',
        '07234567890', 4.8, 32, '£75', true, 'active',
        ST_MakePoint(-0.1405, 51.5012), 'cus_assessor_002', 'bronze',
        250.00, 180.25, 8
      ),
      (
        'Mike Williams', 'Eco Property Assessments', 'mike@ecoproperty.co.uk',
        '$2a$12$l/SJZ/gG.xb9uXvxXvkMIue2i7qbgaGnWGqxFUVYA09u6mQB2PBh6',
        '07345678901', 4.9, 89, '£90', true, 'pending',
        ST_MakePoint(-0.1399, 51.5009), 'cus_assessor_003', 'bronze',
        250.00, 95.00, 3
      )
      ON CONFLICT (email) DO NOTHING
    `);

    // Insert sample postcodes
    await pool.query(`
      INSERT INTO assessor_postcodes (assessor_id, postcode, price, status)
      SELECT a.id, pc.postcode, pc.price, 'active'
      FROM assessors a
      CROSS JOIN (
        VALUES
          ('SW1A', 4.00),
          ('SW1P', 3.50),
          ('SW1V', 4.50),
          ('B1', 3.00),
          ('B2', 3.00),
          ('CV1', 3.50),
          ('M1', 4.00),
          ('LS1', 3.50)
      ) AS pc(postcode, price)
      WHERE a.email IN ('john@smithenergy.co.uk', 'sarah@greenhome.co.uk')
      ON CONFLICT (assessor_id, postcode) DO NOTHING
    `);

    // Insert sample leads
    await pool.query(`
      INSERT INTO leads (
        customer_name, email, phone, address, postcode, property_type,
        bedrooms, timeframe, price, coordinates, status
      ) VALUES
      (
        'Alice Johnson', 'alice@example.com', '07111222333',
        '10 Downing Street', 'SW1A 1AA', 'residential',
        3, 'within_week', 4.00, ST_MakePoint(-0.1419, 51.5014), 'new'
      ),
      (
        'Bob Smith', 'bob@example.com', '07222333444',
        '123 Business Park', 'SW1P 2BB', 'commercial',
        null, 'immediate', 3.50, ST_MakePoint(-0.1405, 51.5012), 'new'
      ),
      (
        'Carol Williams', 'carol@example.com', '07333444555',
        '456 Residential Road', 'B1 1CC', 'residential',
        2, 'within_month', 3.00, ST_MakePoint(-1.8904, 52.4862), 'contacted'
      )
      ON CONFLICT DO NOTHING
    `);

    console.log('✓ Sample data inserted');
  } catch (error) {
    console.error('Error inserting sample data:', error.message);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };