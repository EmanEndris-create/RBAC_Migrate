const {migrate} = require('postgres-migrations');
const pool = require('./config/db');
const path = require('path');
async function runMigration() {
  let client;
  const migrationsPath = path.join(__dirname, 'migrations');
  try {
    client = await pool.connect();
    await migrate({client}, migrationsPath);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = { runMigration };