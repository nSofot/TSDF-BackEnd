import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import Customer from "../models/customer.js"; // your schema

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp folder for uploaded files

// API endpoint: POST /api/import-customers
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Read uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    // 2. Transform rows → match Customer schema fields
    const customers = rows.map((row) => ({
      customerId: row["Customer ID"],  // column name in Excel
      customerType: row["Customer Type"],
      title: row["Title"] || "",
      name: row["Name"],
      address: row["Address"],
      mobile: row["Mobile"],
      phone: row["Phone"] || "",
      email: row["Email"] || "",
      balance: Number(row["Balance"] || 0),
      chequeBalance: Number(row["Cheque Balance"] || 0),
      creditLimit: Number(row["Credit Limit"] || 0),
      creditPeriod: row["Credit Period"]?.toString() || "0",
      birthDate: row["Birth Date"] ? new Date(row["Birth Date"]) : null,
      taxNumber: row["Tax Number"] || "",
      contactPerson: row["Contact Person"] || "",
      vehicleNumbers: row["Vehicle Numbers"]
        ? row["Vehicle Numbers"].split(",").map((v) => v.trim())
        : [],
      notes: row["Notes"] || "",
      isActive: "true",
      createdAt: row["Created At"] ? new Date(row["Created At"]) : new Date(),
      updatedAt: new Date(),
    }));

    // 3. Insert into MongoDB
    await Customer.insertMany(customers, { ordered: false }); // skip duplicates

    res.json({ success: true, inserted: customers.length });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;