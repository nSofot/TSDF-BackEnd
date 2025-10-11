import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Customer from "../models/customer.js";
import MembershipTransactions from "../models/membershipTransaction.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp folder for uploaded files

// POST /api/import-customers
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1️⃣ Read uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    // 2️⃣ Process each row
    let updatedCount = 0;

    for (const row of rows) {
      const customerId = row["Member No"];
      const numericAmount = Number(row["Profit"]) || 0;
      const transactionDate = row["Date"] ? new Date(row["Date"]) : null;
      const remark = row["Remark"] || "";

      if (!customerId) continue; // skip invalid rows

      const updateResult = await Customer.updateOne(
        { customerId },
        {
          $inc: { shares: Math.abs(numericAmount) }, // increment shares
          $set: { updatedAt: new Date() },
        }
      );

      if (updateResult.modifiedCount > 0) updatedCount++;

      // (optional) add a membership transaction record
      await MembershipTransactions.create({
        trxNumber: "PRFT-",
        trxBookNo: "",
        customerId,
        transactionType: "profit",
        transactionDate: new Date(),
        trxAmount: Math.abs(numericAmount),
        isCredit: false,
        description: remark,
      });
    }

    // 3️⃣ Cleanup temp file
    fs.unlinkSync(req.file.path);

    // 4️⃣ Send response
    res.json({
      success: true,
      updated: updatedCount,
      totalRows: rows.length,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
