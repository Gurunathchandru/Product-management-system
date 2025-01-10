import { loginUser, registerUser } from "./user.controller";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await registerUser(req, res, next);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.post("/login", async (req: Request, res: Response) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
