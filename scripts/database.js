import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'publications.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Database schema
const SCHEMA = {
  publications: `
    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      journal TEXT,
      year TEXT,
      url TEXT,
      doi TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(title, year)
    )
  `,
  
  authors: `
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  tags: `
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  publication_authors: `
    CREATE TABLE IF NOT EXISTS publication_authors (
      publication_id INTEGER,
      author_id INTEGER,
      author_order INTEGER,
      PRIMARY KEY (publication_id, author_id),
      FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
    )
  `,
  
  publication_tags: `
    CREATE TABLE IF NOT EXISTS publication_tags (
      publication_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (publication_id, tag_id),
      FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `
};

// Initialize database tables
function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Create tables
    Object.entries(SCHEMA).forEach(([tableName, sql]) => {
      db.exec(sql);
      console.log(`✓ Created table: ${tableName}`);
    });
    
    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
      CREATE INDEX IF NOT EXISTS idx_publications_doi ON publications(doi);
      CREATE INDEX IF NOT EXISTS idx_publication_authors_order ON publication_authors(publication_id, author_order);
      CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
      CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
      CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
    `);
    
    console.log('✓ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Database operations
class PublicationDB {
  constructor() {
    this.db = db;
  }

  // Insert or update a publication
  upsertPublication(publicationData) {
    const transaction = this.db.transaction((data) => {
      // Insert or get publication
      const insertPub = this.db.prepare(`
        INSERT OR REPLACE INTO publications (title, journal, year, url, doi, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const result = insertPub.run(
        data.title,
        data.journal,
        data.year,
        data.url,
        data.doi
      );
      
      const publicationId = result.lastInsertRowid;
      
      // Clear existing relationships
      this.db.prepare('DELETE FROM publication_authors WHERE publication_id = ?').run(publicationId);
      this.db.prepare('DELETE FROM publication_tags WHERE publication_id = ?').run(publicationId);
      
      // Insert authors
      if (data.authors && data.authors.length > 0) {
        const insertAuthor = this.db.prepare('INSERT OR IGNORE INTO authors (name) VALUES (?)');
        const getAuthorId = this.db.prepare('SELECT id FROM authors WHERE name = ?');
        const linkAuthor = this.db.prepare('INSERT INTO publication_authors (publication_id, author_id, author_order) VALUES (?, ?, ?)');
        
        data.authors.forEach((authorName, index) => {
          insertAuthor.run(authorName);
          const author = getAuthorId.get(authorName);
          linkAuthor.run(publicationId, author.id, index + 1);
        });
      }
      
      // Insert tags
      if (data.tags && data.tags.length > 0) {
        const insertTag = this.db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
        const getTagId = this.db.prepare('SELECT id FROM tags WHERE name = ?');
        const linkTag = this.db.prepare('INSERT INTO publication_tags (publication_id, tag_id) VALUES (?, ?)');
        
        data.tags.forEach((tagName) => {
          insertTag.run(tagName);
          const tag = getTagId.get(tagName);
          linkTag.run(publicationId, tag.id);
        });
      }
      
      return publicationId;
    });
    
    return transaction(publicationData);
  }

  // Get all publications with authors and tags
  getAllPublications() {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT a.name ORDER BY pa.author_order) as authors,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM publications p
      LEFT JOIN publication_authors pa ON p.id = pa.publication_id
      LEFT JOIN authors a ON pa.author_id = a.id
      LEFT JOIN publication_tags pt ON p.id = pt.publication_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.year DESC, p.title
    `;
    
    const results = this.db.prepare(query).all();
    
    return results.map(row => ({
      ...row,
      authors: row.authors ? row.authors.split(',') : [],
      tags: row.tags ? row.tags.split(',') : []
    }));
  }

  // Get publications by year
  getPublicationsByYear(year) {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT a.name ORDER BY pa.author_order) as authors,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM publications p
      LEFT JOIN publication_authors pa ON p.id = pa.publication_id
      LEFT JOIN authors a ON pa.author_id = a.id
      LEFT JOIN publication_tags pt ON p.id = pt.publication_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.year = ?
      GROUP BY p.id
      ORDER BY p.title
    `;
    
    const results = this.db.prepare(query).all(year);
    
    return results.map(row => ({
      ...row,
      authors: row.authors ? row.authors.split(',') : [],
      tags: row.tags ? row.tags.split(',') : []
    }));
  }

  // Search publications
  searchPublications(searchTerm, tags = []) {
    let query = `
      SELECT DISTINCT
        p.*,
        GROUP_CONCAT(DISTINCT a.name ORDER BY pa.author_order) as authors,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM publications p
      LEFT JOIN publication_authors pa ON p.id = pa.publication_id
      LEFT JOIN authors a ON pa.author_id = a.id
      LEFT JOIN publication_tags pt ON p.id = pt.publication_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (searchTerm) {
      query += ` AND (p.title LIKE ? OR a.name LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    if (tags.length > 0) {
      const tagPlaceholders = tags.map(() => '?').join(',');
      query += ` AND p.id IN (
        SELECT pt2.publication_id 
        FROM publication_tags pt2 
        JOIN tags t2 ON pt2.tag_id = t2.id 
        WHERE t2.name IN (${tagPlaceholders})
        GROUP BY pt2.publication_id 
        HAVING COUNT(DISTINCT t2.name) = ?
      )`;
      params.push(...tags, tags.length);
    }
    
    query += ` GROUP BY p.id ORDER BY p.year DESC, p.title`;
    
    const results = this.db.prepare(query).all(...params);
    
    return results.map(row => ({
      ...row,
      authors: row.authors ? row.authors.split(',') : [],
      tags: row.tags ? row.tags.split(',') : []
    }));
  }

  // Get all unique tags
  getAllTags() {
    return this.db.prepare('SELECT name FROM tags ORDER BY name').all().map(row => row.name);
  }

  // Get publication statistics
  getStats() {
    const totalPubs = this.db.prepare('SELECT COUNT(*) as count FROM publications').get();
    const totalAuthors = this.db.prepare('SELECT COUNT(*) as count FROM authors').get();
    const totalTags = this.db.prepare('SELECT COUNT(*) as count FROM tags').get();
    const yearRange = this.db.prepare('SELECT MIN(year) as min_year, MAX(year) as max_year FROM publications').get();
    
    return {
      publications: totalPubs.count,
      authors: totalAuthors.count,
      tags: totalTags.count,
      yearRange: yearRange
    };
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

export { PublicationDB, initializeDatabase, DB_PATH };