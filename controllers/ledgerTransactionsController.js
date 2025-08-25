import { isAdmin } from "./userController.js";
import LedgerTransactions from "../models/ledgerTransactions.js";


export async function getLedgerTransactions(req, res) {
    // if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    try {
        const accountTransactions = await LedgerTransactions.find();
        res.json(accountTransactions);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch account transactions", error: err.message });
    }
}


export async function getLedgerTransactionById(req, res) {
    // if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    try {
        const { accountId } = req.params;
        const accountTransaction = await LedgerTransactions.find({ accountId });
        if (!accountTransaction) {
            return res.status(404).json({ message: "Account transaction not found" });
        }
        res.json(accountTransaction);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch account transaction", error: err.message });
    }
}


    export async function createLedgerTransaction(req, res) {      
        try {
            const admin = await isAdmin(req);
            if (!admin) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const { trxId, accountId, trxDate, description, transactionType, trxType, trxAmount } = req.body;

            if (!trxId || !accountId || !trxDate || !description || !trxType || trxAmount == null) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Convert trxDate string to Date object if necessary
            const trxDateObj = new Date(trxDate);
            if (isNaN(trxDateObj)) {
                return res.status(400).json({ message: "Invalid transaction date" });
            }

            // Check for duplicate trxId
            // const existing = await AccountTransactions.findOne({ trxId });
            // if (existing) {
            //     return res.status(409).json({ message: "Transaction ID already exists" });
            // }

            const accountTransaction = new LedgerTransactions({
                trxId,
                accountId,
                trxDate: trxDateObj,
                transactionType,
                accountId,
                description,
                trxType,
                trxAmount,
                createdBy: req.user?.id || "system", // add user id if available
            });

            await accountTransaction.save();

            res.status(201).json({
            message: "Account transaction created",
            transaction: accountTransaction,
            });
        } catch (err) {
            console.error("Error creating account transaction:", err);
            res.status(500).json({
            message: "Failed to create account transaction",
            error: err.message,
            });
        }
    }
 

export async function updateLedgerTransaction(req, res) {
    if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    try {
        const { transactionId } = req.params;
        const updated = await LedgerTransactions.findByIdAndUpdate(transactionId, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Account transaction not found" });
        }

        res.json({ message: "Account transaction updated successfully", updated });
    } catch (err) {
        res.status(500).json({ message: "Failed to update account transaction", error: err.message });
    }
}

export async function deleteLedgerTransaction(req, res) {
    if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    try {
        const { transactionId } = req.params;
        const deleted = await LedgerTransactions.findByIdAndDelete(transactionId);

        if (!deleted) {
            return res.status(404).json({ message: "Account transaction not found" });
        }

        res.json({ message: "Account transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete account transaction", error: err.message });
    }
}
