import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { tasks } from "./schema";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// Initialize the database with the tasks table
const initDb = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

initDb();