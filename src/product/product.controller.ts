import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Product from "./product.model";
import createError from "http-errors";
import { productSchema } from "./product.utils";

/* create product */
export const createProduct = async (req: any, res: Response) => {
  const { product_name, description, price, category, quantity } = req.body;

  const user = req._user;
  const { error } = productSchema.validate(req.body, user);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  try {
    const existingProduct = await Product.findOne({ product_name, user });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists!" });
    }
    const newProduct = new Product({
      product_name,
      description,
      price,
      category,
      quantity,
      user,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(JSON.stringify({ msg: "Error during registration", error }));
    res.status(500).json({ message: "Server error" });
  }
};

/* view product */
export const viewProduct = async (req: any, res: Response) => {
  const { product_name } = req.query as { product_name?: string }; // Optional query parameter
  const user = req._user;
  try {
    if (product_name) {
      const product = await Product.findOne(
        { product_name, user },
        { _id: 0 },
        { __v: 0 },
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with name "${product_name}" not found.` });
      }
      return res.status(200).json({ product });
    }
    const products = await Product.find(
      { user },
      { _id: 0, __v: 0 },
      { sort: { updated_at: -1 } },
    );
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(JSON.stringify({ msg: "Error in product display", error }));
    res.status(500).json({ message: "Server error." });
  }
};

/* update existing product */
export const updateProduct = async (req: any, res: Response) => {
  const { product_id } = req.params;
  const { updatedFields } = req.body;
  const user = req._user;
  try {
    const result = await Product.findOneAndUpdate(
      { product_id, user },
      { $set: { ...updatedFields, updated_at: new Date() } },
      { new: true },
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: `Product with ID ${product_id} not found.` });
    }

    res.status(200).json({
      message: "Product updated successfully.",
      updatedProduct: result,
    });
  } catch (error) {
    console.error(
      JSON.stringify({ msg: "Error during product updation", error }),
    );
    res.status(500).json({ message: "Server error." });
  }
};

/* delete product */
export const deleteProduct = async (req: any, res: Response) => {
  const { product_id } = req.params;
  const user = req._user;
  try {
    const result = await Product.findOneAndDelete({ product_id, user });

    if (!result) {
      return res
        .status(404)
        .json({ message: `Product with ID ${product_id} not found.` });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
      deletedProduct: result,
    });
  } catch (error) {
    console.error(
      JSON.stringify({ msg: "Error during product deletion", error }),
    );
    res.status(500).json({ message: "Server error." });
  }
};
