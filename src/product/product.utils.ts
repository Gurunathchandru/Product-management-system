import Joi from "joi";

/* Product validation schema */
export const productSchema = Joi.object({
  product_name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().min(1).required(),
  quantity: Joi.number().integer().positive().required(),
});
