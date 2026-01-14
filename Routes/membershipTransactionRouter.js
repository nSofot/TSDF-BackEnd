import express from "express";

import { 
    createMembershipTransaction,
    getMembershipTransactionsByMemberId,
    getAllMembershipTransactions
} from "../controllers/membershipTransactionController.js";

const membershipTransactionRouter = express.Router();

membershipTransactionRouter.post("/create", createMembershipTransaction);
membershipTransactionRouter.get("/transactions/:customerId", getMembershipTransactionsByMemberId);
membershipTransactionRouter.get("/all", getAllMembershipTransactions);

export default membershipTransactionRouter;
