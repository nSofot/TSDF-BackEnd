import { isAdmin } from "./userController.js";
import MemberTransaction from "../models/memberTransaction.js";

export async function createMemberTransaction(req, res) {
    try {
        const { transactionType } = req.body;

        const prefixMap = {
            payment: "PAYM-",
            receipt: "RCPT-",
            membershipFee: "MEMF-"
        };

        const prefix = prefixMap[transactionType];
        if (!prefix) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        // Generate new trxNumber
        let referenceNumber = prefix + "000001";
        const lastTransaction = await MemberTransaction
            .findOne({ transactionType })
            .sort({ createdAt: -1 });

        if (lastTransaction) {
            const match = lastTransaction.trxNumber?.match(new RegExp(`^${prefix}(\\d{6})$`));
            if (match) {
                const lastId = parseInt(match[1], 10);
                referenceNumber = prefix + String(lastId + 1).padStart(6, "0");
            }
        }

        req.body.trxNumber = referenceNumber;
        const memberTransaction = new MemberTransaction(req.body);
        await memberTransaction.save();

        res.json(memberTransaction);
    } catch (err) {
        res.status(500).json({ message: "Failed to create member transaction", error: err.message });
    }
}

export async function getMembershipTransactionsByMemberId(req, res) {
    try {
        const { memberId } = req.params;
        const transactions = await MemberTransaction.find({
            memberId,
            transactionType: { $in: ["membershipFee", "receipt"] }
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch membership transactions", error: err.message });
    }
}
