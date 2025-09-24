import express from "express";
import { 
        addLoanTransaction,
        getLatestCustomerTransaction,
        getCustomerTransactionByCustomerId,
        // getCustomerPendingTransactionByCustomerId,
        getLastTransactionByCustomerId,
        updateOverdueTransactions,
        getTransactionsByTrxBookNo
    } from "../controllers/loanTransactionsController.js";

const loanTransactionsRouter = express.Router();

// loanTransactionsRouter.get("/pending/:customerId", getCustomerPendingTransactionByCustomerId);
loanTransactionsRouter.get("/customer/:customerId", getCustomerTransactionByCustomerId);
loanTransactionsRouter.get(
  "/last-trx/:customerId/:loanId/:transactionType",
  getLastTransactionByCustomerId
);
loanTransactionsRouter.get("/latest/:transactionType", getLatestCustomerTransaction);
loanTransactionsRouter.post("/", addLoanTransaction);
loanTransactionsRouter.put("/overdue/:referenceNumber/pay", updateOverdueTransactions);
loanTransactionsRouter.get("/trxbook/:trxBookNo/:transactionType", getTransactionsByTrxBookNo);

export default loanTransactionsRouter;