import { initializeDatabase } from './database.js';

console.log('Initializing SQLite database for publications...');

if (initializeDatabase()) {
  console.log('Database initialization completed successfully!');
  process.exit(0);
} else {
  console.error('Database initialization failed!');
  process.exit(1);
}