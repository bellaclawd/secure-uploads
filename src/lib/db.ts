import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "secure-uploads.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  fs.mkdirSync(DB_DIR, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      storage_key TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      downloaded_at INTEGER,
      deleted_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_files_slug ON files(slug);
    CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files(expires_at);
  `);

  return db;
}

export interface FileRecord {
  id: number;
  slug: string;
  original_name: string;
  mime_type: string;
  size: number;
  storage_key: string;
  expires_at: number;
  created_at: number;
  downloaded_at: number | null;
  deleted_at: number | null;
}

export function insertFile(
  slug: string,
  originalName: string,
  mimeType: string,
  size: number,
  storageKey: string,
  expiresAt: number
): FileRecord {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO files (slug, original_name, mime_type, size, storage_key, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(slug, originalName, mimeType, size, storageKey, expiresAt);
  return getFileBySlug(slug)!;
}

export function getFileBySlug(slug: string): FileRecord | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT * FROM files WHERE slug = ? AND deleted_at IS NULL AND expires_at > unixepoch()"
    )
    .get(slug) as FileRecord | undefined;
  return row ?? null;
}

export function slugExists(slug: string): boolean {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT 1 FROM files WHERE slug = ? AND deleted_at IS NULL AND expires_at > unixepoch()"
    )
    .get(slug);
  return !!row;
}

export function markDownloaded(slug: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE files SET downloaded_at = unixepoch() WHERE slug = ? AND downloaded_at IS NULL"
  ).run(slug);
}

export function softDelete(slug: string): void {
  const db = getDb();
  db.prepare("UPDATE files SET deleted_at = unixepoch() WHERE slug = ?").run(
    slug
  );
}

export function getCleanableFiles(): FileRecord[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM files
       WHERE deleted_at IS NOT NULL
       OR expires_at <= unixepoch()
       OR downloaded_at IS NOT NULL`
    )
    .all() as FileRecord[];
}

export function hardDeleteFile(id: number): void {
  const db = getDb();
  db.prepare("DELETE FROM files WHERE id = ?").run(id);
}
