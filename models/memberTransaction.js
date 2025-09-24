import mongoose from "mongoose";

const memberTransactionSchema = new mongoose.Schema({
    trxNumber: { type: String, required: true, unique: true },
    memberId: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    transactionType: { type: String, enum: ['payment', 'receipt', 'membershipFee'], required: true },
    description: { type: String, default: '' },
    isCredit: { type: Boolean, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true }); // ✅ enables createdAt / updatedAt

const MemberTransaction = mongoose.model("MemberTransaction", memberTransactionSchema);
export default MemberTransaction;
