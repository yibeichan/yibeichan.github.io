import { PublicationDB } from './database.js';
import fs from 'fs/promises';
import path from 'path';

async function migrateJsonToDatabase() {
  console.log('Migrating publications from JSON to SQLite database...');
  
  try {
    // Read existing JSON data
    const jsonPath = path.join(process.cwd(), 'src/data/publications.json');
    const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    
    console.log(`Found ${jsonData.length} publications in JSON file`);
    
    // Initialize database
    const db = new PublicationDB();
    
    // Migrate each publication
    let migrated = 0;
    for (const publication of jsonData) {
      try {
        db.upsertPublication(publication);
        migrated++;
        console.log(`✓ Migrated: ${publication.title}`);
      } catch (error) {
        console.error(`✗ Failed to migrate: ${publication.title}`, error.message);
      }
    }
    
    // Show statistics
    const stats = db.getStats();
    console.log('\n=== Migration Complete ===');
    console.log(`Successfully migrated: ${migrated}/${jsonData.length} publications`);
    console.log(`Database statistics:`, stats);
    
    // Create backup of JSON file
    const backupPath = path.join(process.cwd(), `src/data/publications.json.backup.${Date.now()}`);
    await fs.copyFile(jsonPath, backupPath);
    console.log(`JSON backup created: ${backupPath}`);
    
    db.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateJsonToDatabase();