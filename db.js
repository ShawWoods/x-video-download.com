const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./downloads.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE,
      download_count INTEGER DEFAULT 0,
      title TEXT
    )
  `);
});

module.exports = db;