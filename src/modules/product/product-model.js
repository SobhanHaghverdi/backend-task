import vine from "@vinejs/vine";
import mongoose from "mongoose";
import env from "../../config/env-config.js";

const createProductSchema = () => {
  const productSchema = new mongoose.Schema(
    {
      isActive: { type: Boolean, required: true },
      amp: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 1 },
      warrantyEndDate: { type: Date, required: true },
      warrantyStartDate: { type: Date, required: true },
      description: { type: String, trim: true, maxLength: 800 },
      code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 1,
      },
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 200,
      },
      category: {
        index: true,
        required: true,
        ref: "Category",
        type: mongoose.Types.ObjectId,
      },
    },
    { strict: true, versionKey: false, timestamps: { updatedAt: false } }
  );

  //* Validations
  productSchema.statics.validateCreate = async function (requestBody) {
    const schema = vine.object({
      size: vine.number().max(env.MULTER_MAX_FILE_SIZE),
      mimetype: vine.enum([
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]),
    });

    return await vine.compile(schema).validate(requestBody);
  };

  return productSchema;
};

const Product =
  mongoose.models.Product || mongoose.model("Product", createProductSchema());

export default Product;
