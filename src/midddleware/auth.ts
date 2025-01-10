import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const loginMiddleware = (req: any, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication token is missing" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
      userId: string;
    };
    req._user = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default loginMiddleware;
