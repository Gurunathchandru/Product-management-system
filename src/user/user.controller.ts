import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model";
import createError from "http-errors";
import { userLoginSchema, userRegisterSchema } from "./user.utils";

/* user registration */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, phone } = req.body;

  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user exist, please login" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(JSON.stringify({ msg: "Error during registration", error }));
    res.status(500).json({ message: "Server error." });
  }
};

/* user login */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(JSON.stringify({ msg: "Error during registration", error }));
    res.status(500).json({ message: "Server error." });
  }
};
