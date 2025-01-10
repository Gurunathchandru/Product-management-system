import express from "express";
import dotenv from "dotenv";
import userRouter from "./user/user.routes";
import connectDB from "./config/db";
// import { authMiddleware } from "./midddleware/auth";
import productRouter from "./product/product.routes";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
