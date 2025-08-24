import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

// Route Imports
import userRouter from "./Routes/userRouter.js";
import customerRouter from "./Routes/customerRouter.js";
import customerTransactionsRouter from "./Routes/customerTransactionsRoutes.js";
import ledgerAccountRouter from "./Routes/ledgerAccountRoutes.js";
import ledgerTransactionsRouter from "./Routes/ledgerTransactionsRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Auth middleware
app.use((req, res, next) => {
    const tokenString = req.header("Authorization");
    if (tokenString) {
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (decoded) {
                req.user = decoded;
                next();
            } else {
                res.status(403).json({ message: "Invalid token" });
            }
        });
    } else {
        next();
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to database"))
    .catch(() => console.log("Connection failed"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/customerTransactions", customerTransactionsRouter);
app.use("/api/ledgerAccounts", ledgerAccountRouter);
app.use("/api/ledgerTransactions", ledgerTransactionsRouter);


// Default 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

