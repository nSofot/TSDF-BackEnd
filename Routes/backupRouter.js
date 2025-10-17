import express from "express";
import { runMongoBackup } from "../utils/autoBackup.js";

const router = express.Router();

// Secure route (admin only recommended)
router.post("/now", async (req, res) => {
  try {
    console.log("🧩 Manual backup triggered via API");
    runMongoBackup();
    res.status(200).json({ message: "Backup process started successfully" });
  } catch (err) {
    console.error("❌ Manual backup failed:", err);
    res.status(500).json({ message: "Backup failed" });
  }
});

export default router;
