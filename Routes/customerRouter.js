import express from "express";
import { CreateCustomer } from "../controllers/customerController.js";
import { getCustomer } from "../controllers/customerController.js";
import { getCustomerById } from "../controllers/customerController.js";
import { deleteCustomer } from "../controllers/customerController.js";
import { updateCustomer } from "../controllers/customerController.js";
import { searchCustomers } from "../controllers/customerController.js";
import { addCustomerBalance } from "../controllers/customerController.js";
import { subtractCustomerBalance } from "../controllers/customerController.js";


const customerRouter = express.Router();


customerRouter.post("/", CreateCustomer);
customerRouter.get("/search", searchCustomers);
customerRouter.get("/", getCustomer);
customerRouter.get("/:customerId", getCustomerById);
customerRouter.delete("/:customerId", deleteCustomer);
customerRouter.put("/addBalance", addCustomerBalance);
customerRouter.put("/subtractBalance", subtractCustomerBalance);
customerRouter.put("/:customerId", updateCustomer);


export default customerRouter;