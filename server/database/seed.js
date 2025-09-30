const { query } = require('../models/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Hash password for test assessors
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test assessors
    const assessors = [
      {
        name: 'John Smith',
        company: 'Smith Energy Assessments',
        email: 'john@smithenergy.com',
        phone: '020 7123 4567',
        price: '£85',
        lat: 51.5014,
        lng: -0.1419
      },
      {
        name: 'Sarah Johnson',
        company: 'Green Home Surveys',
        email: 'sarah@greenhome.com',
        phone: '020 7234 5678',
        price: '£75',
        lat: 51.5012,
        lng: -0.1405
      },
      {
        name: 'Mike Williams',
        company: 'Eco Property Assessments',
        email: 'mike@ecopropertyuk.com',
        phone: '020 7345 6789',
        price: '£90',
        lat: 51.5009,
        lng: -0.1399
      },
      {
        name: 'Emma Davis',
        company: 'London EPC Solutions',
        email: 'emma@londonepc.com',
        phone: '020 7456 7890',
        price: '£80',
        lat: 51.5018,
        lng: -0.1423
      }
    ];

    console.log('Creating assessors...');
    const createdAssessors = [];

    for (const assessor of assessors) {
      const result = await query(`
        INSERT INTO assessors (name, company, email, password, phone, price, lat, lng, status, verified, rating, review_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', true, $9, $10)
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name, company = EXCLUDED.company
        RETURNING *
      `, [
        assessor.name,
        assessor.company,
        assessor.email,
        hashedPassword,
        assessor.phone,
        assessor.price,
        assessor.lat,
        assessor.lng,
        Math.floor(Math.random() * 2) + 4, // rating 4-5
        Math.floor(Math.random() * 50) + 10 // review count 10-60
      ]);

      createdAssessors.push(result.rows[0]);
      console.log(`✓ Created ${assessor.name}`);
    }

    // Add postcodes for each assessor
    const postcodes = ['SW1A', 'SW1P', 'SW1V', 'SW1W', 'SW1X', 'SW1Y', 'W1K', 'W1J'];

    console.log('Adding postcode coverage...');
    for (const assessor of createdAssessors) {
      // Each assessor covers random postcodes
      const numPostcodes = Math.floor(Math.random() * 4) + 3; // 3-6 postcodes
      const selectedPostcodes = postcodes.slice(0, numPostcodes);

      for (const postcode of selectedPostcodes) {
        await query(`
          INSERT INTO assessor_postcodes (assessor_id, postcode, price, status)
          VALUES ($1, $2, $3, 'active')
          ON CONFLICT (assessor_id, postcode) DO NOTHING
        `, [assessor.id, postcode, parseFloat(assessor.price.replace('£', ''))]);
      }

      console.log(`✓ Added ${selectedPostcodes.length} postcodes for ${assessor.name}`);
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${createdAssessors.length} assessors with postcode coverage`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };