import express from "express";


import { createLoanMaster } from "../controllers/loanMasterController.js";
import { getLoanMasters } from "../controllers/loanMasterController.js";
import { getLoanMasterById } from "../controllers/loanMasterController.js";
import { updateLoanMaster } from "../controllers/loanMasterController.js";
import { getLoanMasterByCustomerId } from "../controllers/loanMasterController.js";
import { getPendingLoansByCustomerId } from "../controllers/loanMasterController.js";
import { getPendingLoansByGuarantorId} from "../controllers/loanMasterController.js";
import { getPendingLoansForGrant } from "../controllers/loanMasterController.js";


const loanMasterRouter = express.Router();


loanMasterRouter.post("/", createLoanMaster);
loanMasterRouter.get("/", getLoanMasters);
loanMasterRouter.get("/customer/:customerId", getLoanMasterByCustomerId);
loanMasterRouter.get("/pending/:customerId", getPendingLoansByCustomerId);
loanMasterRouter.get("/pending-grant", getPendingLoansForGrant);
loanMasterRouter.get("/guarantor/:customerId", getPendingLoansByGuarantorId);
loanMasterRouter.get("/:loanMasterId", getLoanMasterById);
loanMasterRouter.put("/:loanMasterId", updateLoanMaster);


export default loanMasterRouter;