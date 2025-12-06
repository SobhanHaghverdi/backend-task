import vine from "@vinejs/vine";
import mongoose from "mongoose";

const createCategorySchema = () => {
  const categorySchema = new mongoose.Schema(
    {
      parent: { ref: "Category", type: mongoose.Types.ObjectId },
      name: {
        trim: true,
        unique: true,
        type: String,
        required: true,
      },
    },
    { strict: true, versionKey: false, timestamps: false }
  );

  //* Validations
  categorySchema.statics.validateCreate = async function (requestBody) {
    return await vine.compile(schema).validate(requestBody);
  };

  return categorySchema;
};

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", createCategorySchema());

export default Category;
