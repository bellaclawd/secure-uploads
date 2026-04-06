import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

function ensureDir() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function saveFile(storageKey: string, data: Buffer): void {
  ensureDir();
  fs.writeFileSync(path.join(UPLOADS_DIR, storageKey), data);
}

export function readFile(storageKey: string): Buffer | null {
  const filePath = path.join(UPLOADS_DIR, storageKey);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export function deleteFile(storageKey: string): void {
  const filePath = path.join(UPLOADS_DIR, storageKey);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
