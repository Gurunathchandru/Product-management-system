import {
  createProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import express, { Request, Response, NextFunction } from "express";
import loginMiddleware from "../midddleware/auth";

const router = express.Router();

router.post(
  "/createProduct",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      await createProduct(req, res);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get(
  "/viewProduct",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      await viewProduct(req, res);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.put(
  "/updateProduct/:product_id",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      await updateProduct(req, res);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.delete(
  "/deleteProduct/:product_id",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      await deleteProduct(req, res);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

export default router;
