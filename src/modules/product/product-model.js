import vine from "@vinejs/vine";
import mongoose from "mongoose";

const createProductSchema = () => {
  const productSchema = new mongoose.Schema(
    {
      amp: { type: Number, required: true },
      price: { type: Number, required: true },
      isActive: { type: Boolean, required: true },
      description: { type: String, trim: true },
      warrantyEndDate: { type: Date, required: true },
      warrantyStartDate: { type: Date, required: true },
      name: { type: String, required: true, trim: true },
      // parent: { ref: "Category", type: mongoose.Types.ObjectId },
      code: { type: String, required: true, unique: true, trim: true },
      // category: {
      //   index: true,
      //   required: true,
      //   ref: "Category",
      //   type: mongoose.Types.ObjectId,
      // },
    },
    { strict: true, versionKey: false, timestamps: true }
  );

  //* Validations
  productSchema.statics.validateCreate = async function (requestBody) {
    const schema = vine.object({
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
