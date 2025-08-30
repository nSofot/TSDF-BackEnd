import express from "express";
import { 
        addLoanTransaction,
        getLatestCustomerTransaction,
        getCustomerTransactionByCustomerId,
        getCustomerPendingTransactionByCustomerId,
        updateOverdueTransactions
    } from "../controllers/loanTransactionsController.js";

const loanTransactionsRouter = express.Router();

loanTransactionsRouter.get("/pending/:customerId", getCustomerPendingTransactionByCustomerId);
loanTransactionsRouter.get("/customer/:customerId", getCustomerTransactionByCustomerId);
loanTransactionsRouter.get("/latest/:transactionType", getLatestCustomerTransaction);
loanTransactionsRouter.post("/", addLoanTransaction);
loanTransactionsRouter.put("/overdue/:referenceNumber/pay", updateOverdueTransactions);

export default loanTransactionsRouter;