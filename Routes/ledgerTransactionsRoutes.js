import express from "express";
import { getLedgerTransactions } from "../controllers/ledgerTransactionsController.js";
import { createLedgerTransaction } from "../controllers/ledgerTransactionsController.js";
import { updateLedgerTransaction } from "../controllers/ledgerTransactionsController.js";
import { deleteLedgerTransaction } from "../controllers/ledgerTransactionsController.js";
import { getLedgerTransactionById } from "../controllers/ledgerTransactionsController.js";


const ledgerTransactionsRouter = express.Router();


ledgerTransactionsRouter.get("/:accountId", getLedgerTransactionById);
ledgerTransactionsRouter.post("/", createLedgerTransaction);
ledgerTransactionsRouter.put("/:transactionId", updateLedgerTransaction);
ledgerTransactionsRouter.delete("/:transactionId", deleteLedgerTransaction);



export default ledgerTransactionsRouter;
