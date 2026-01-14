import express from "express";

import { 
    createSharesTransaction,
    getSharesTransactionsByMemberId,
    getAllSharesTransactions
} from "../controllers/sharesTransactionController.js";

const sharesTransactionRouter = express.Router();

sharesTransactionRouter.post("/create", createSharesTransaction);
sharesTransactionRouter.get("/transactions/:customerId", getSharesTransactionsByMemberId);
sharesTransactionRouter.get("/all", getAllSharesTransactions);

export default sharesTransactionRouter;
