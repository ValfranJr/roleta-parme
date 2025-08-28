import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Use this for NeonDB if you encounter SSL issues, or true if your environment supports it.
  },
});

async function connectDb() {
  try {
    await client.connect();
    console.log('Connected to NeonDB');
    await createTable();
  } catch (error) {
    console.error('Failed to connect to NeonDB or create table:', error);
  }
}

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS coupon_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL UNIQUE,
      coupon_won VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await client.query(createTableQuery);
    console.log('Table coupon_users ensured to exist.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Connect to DB when this module is imported
connectDb();

export { client };