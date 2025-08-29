import e from "cors";
import LoanMaster from "../models/loanMaster.js";
import { isAdmin } from "./userController.js";

export async function createLoanMaster(req, res) {
    // if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    
    try {
        let loanId = "VCHR-000001";
        const lastLoan = await LoanMaster.find().sort({ createdAt: -1 }).limit(1);
        if (lastLoan.length > 0) {
            const lastId = parseInt(lastLoan[0].loanId.replace("VCHR-", ""));
            loanId = "VCHR-" + String(lastId + 1).padStart(6, "0");
        }

        req.body.loanId = loanId;
        const loanMaster = new LoanMaster(req.body);
        await loanMaster.save();
        res.json(loanMaster);
    } catch (err) {
        res.status(500).json({ message: "Failed to create loan master", error: err.message });
    }
}

export async function getLoanMasters(req, res) {
    try {
        const loanMasters = await LoanMaster.find();
        res.json(loanMasters);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch loan masters", error: err.message });
    }
}

export async function getLoanMasterById(req, res) {
    const { loanId } = req.params;
    try {
        const loanMaster = await LoanMaster.findOne({ loanId });
        if (!loanMaster) {
            return res.status(404).json({ message: "Loan master not found" });
        }
        res.json(loanMaster);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch loan master", error: err.message });
    }
}

export async function getLoanMasterByCustomerId(req, res) {
    const { customerId } = req.params;
    try {
        const loanMaster = await LoanMaster.find({ customerId });
        if (!loanMaster) {
            return res.status(404).json({ message: "Loan master not found" });
        }
        res.json(loanMaster);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch loan master", error: err.message });
    }   
}

export async function getPendingLoansByCustomerId(req, res) {
    const { customerId } = req.params;
    try {
        const loanMaster = await LoanMaster.find({ customerId, loanDueAmount: { $gt: 0 } });
        if (!loanMaster) {
            return res.status(404).json({ message: "Loan master not found" });
        }
        res.json(loanMaster);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch loan master", error: err.message });
    }   
}   
  
export async function updateLoanMaster(req, res) {
    // if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

    const { loanId } = req.params;
    try {
        const loanMaster = await LoanMaster.findOneAndUpdate({ loanId }, req.body, { new: true });
        if (!loanMaster) {
            return res.status(404).json({ message: "Loan master not found" });
        }
        res.json(loanMaster);
    } catch (err) {
        res.status(500).json({ message: "Failed to update loan master", error: err.message });
    }
}