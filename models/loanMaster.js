import e from "cors";
import mongoose from "mongoose";

const loanMasterSchema = new mongoose.Schema({
    loanId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: String,
        required: true 
    },
    firstGaranterId: {
        type: String,
    },
    SecondGaranterId: {
        type: String,
    },
    issuedDate: {
        type: Date,
        required: true
    },
    loanType: {
        type: String,
        required: true,
        enum: ["Daily Loan", "Welfare Loan", "Short Term Loan", "Long Term Loan", "Project Loan"]
    },
    amount: {
        type: Number,
        required: true
    },
    loanDuration: {
        type: Number,
        required: true
    },
    loanInterestRate: {
        type: Number,
        required: true
    },
    dueAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LoanMaster = mongoose.model("LoanMaster", loanMasterSchema);
export default LoanMaster;