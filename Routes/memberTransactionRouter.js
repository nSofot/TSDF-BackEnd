import express from "express";
import {
    createMemberTransaction,
    getMembershipTransactionsByMemberId // ✅ fixed name
} from "../controllers/memberTransactionController.js";

const memberTransactionRouter = express.Router();

// GET membership + receipt transactions by memberId
memberTransactionRouter.get("/membership-fee/:memberId", getMembershipTransactionsByMemberId);

// POST create new transaction
memberTransactionRouter.post("/", createMemberTransaction);

export default memberTransactionRouter;
