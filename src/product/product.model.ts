import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  product_name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  user: { type: String, required: true },
  created_at: { type: Date },
  updated_at: { type: Date },
});

ProductSchema.pre("save", function (next) {
  if (!this.product_id) {
    this.product_id = this._id;
  }
  next();
});

ProductSchema.index(
  { user: 1, product_name: 1 },
  { unique: true, name: "user_product_unique_index" },
);

ProductSchema.index(
  { user: 1, updated_at: -1 },
  { name: "product_updated_at_sort" },
);

export default mongoose.model("Product", ProductSchema);
