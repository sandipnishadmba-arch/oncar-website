const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join('data', 'database.db');
const db = new Database(dbPath);

console.log("=== Services Table ===");
const services = db.prepare("SELECT * FROM services").all();
for (const s of services) {
  console.log(`ID: ${s.id}, Name: ${s.name}`);
  console.log(`Description: ${s.description}`);
  console.log("------------------------");
}
