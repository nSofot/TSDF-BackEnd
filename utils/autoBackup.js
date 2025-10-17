import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const BACKUP_DIR = path.resolve("./backups");
const DB_NAME = process.env.DB_NAME || "fuel_station_erp";
const MONGO_URI = process.env.MONGODB_URL;
const DATE = new Date().toISOString().replace(/[:.]/g, "-");
const BACKUP_NAME = `${DB_NAME}_backup_${DATE}`;
const FULL_PATH = path.join(BACKUP_DIR, BACKUP_NAME);

// Ensure folder exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// === Backup function ===
function runMongoBackup() {
  console.log(`🚀 Starting MongoDB backup: ${BACKUP_NAME}`);

  const dumpCmd = `mongodump --uri="${MONGO_URI}" --db="${DB_NAME}" --out="${FULL_PATH}"`;

  exec(dumpCmd, (err) => {
    if (err) {
      console.error("❌ Backup failed:", err);
      return;
    }

    // Compress the backup folder
    const compressCmd = `tar -czf "${FULL_PATH}.tar.gz" -C "${BACKUP_DIR}" "${BACKUP_NAME}" && rm -rf "${FULL_PATH}"`;
    exec(compressCmd, (compressErr) => {
      if (compressErr) {
        console.error("⚠️ Compression failed:", compressErr);
      } else {
        console.log(`✅ Backup completed: ${FULL_PATH}.tar.gz`);
        cleanOldBackups();
      }
    });
  });
}

// === Delete old backups (>7 days) ===
function cleanOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  files.forEach((file) => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    if (ageInDays > 7) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Deleted old backup: ${file}`);
    }
  });
}

// === Schedule automatic backup (2 AM daily) ===
cron.schedule("0 2 * * *", () => {
  runMongoBackup();
});

console.log("⏰ MongoDB Auto Backup Scheduler initialized (runs daily at 2 AM)");

// ✅ Export the function so backupRouter.js can call it
export { runMongoBackup };
