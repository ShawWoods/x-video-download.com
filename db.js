// db.js
import { createClient } from '@vercel/sqlite';

const db = createClient();

async function initializeDatabase() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT UNIQUE,
        download_count INTEGER DEFAULT 0,
        title TEXT
      )
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 初始化数据库
initializeDatabase();

export default db;
