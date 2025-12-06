import Excel from "exceljs";
import moment from "moment-jalaali";
import Product from "./product-model.js";
import CategoryService from "../category/category-service.js";
import { success } from "../../common/utils/service-response.js";

class ProductService {
  #model;
  #categoryService;

  constructor() {
    this.#model = Product;
    this.#categoryService = new CategoryService();
  }

  async filter(query) {
    return {
      total: 0,
      data: [],
    };
  }

  async createBulk(file) {
    const rows = [];
    const workbook = new Excel.Workbook();

    await workbook.xlsx.load(file.buffer, {
      ignoreNodes: ["dataValidations", "hyperlinks", "headerFooter"],
    });

    const worksheet = workbook.worksheets[0];

    const productDtos = [];
    const categoryDtos = [];
    const subCategoryDtos = [];

    //* Prepare data for inserting
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; //* skip header
      const values = row.values.slice(4);

      const [
        name, // 0
        isActiveValue, // 1
        amp, // 2
        categoryName, // 3
        subCategoryName, // 4
        price, // 5
        startDate, // 6
        months, // 7
        code, // 8
      ] = values;

      const start = moment(startDate, "jYYYY-jMM-jDDTHH:mm:ss.SSS").utc();
      const warrantyStartDate = start.toDate();
      const warrantyEndDate = start.clone().add(months, "months").toDate();

      const dto = {
        amp,
        code,
        name,
        price,
        warrantyEndDate,
        warrantyStartDate,
        isActive: isActiveValue === "فعال",
      };

      const category = categoryName?.trim();
      const subCategory = subCategoryName?.trim();

      categoryDtos.push({ name: category });

      productDtos.push({
        ...dto,
        categoryName: category,
        subCategoryName: subCategory,
      });

      if (subCategory && category) {
        subCategoryDtos.push({
          name: subCategory,
          parentCategoryName: category,
        });
      }

      rows.push(dto);
    });

    // CATEGORY HANDLING
    const categoryResult = await this.#categoryService.createMany(categoryDtos);

    const uniqueNames = [...new Set(categoryDtos.map((c) => c.name))];
    const categories = await this.#categoryService.getAllByNames(uniqueNames);

    const categoryMap = new Map(categories.map((cat) => [cat.name, cat._id]));

    // SUBCATEGORY HANDLING
    const preparedSubCategories = subCategoryDtos
      .map((dto) => ({
        name: dto.name,
        parent: categoryMap.get(dto.parentCategoryName),
      }))
      .filter((dto) => dto.parent);

    let subCategoryResult;
    if (preparedSubCategories.length) {
      subCategoryResult = await this.#categoryService.createMany(
        preparedSubCategories
      );

      const subNames = preparedSubCategories.map((s) => s.name);
      const savedSubCategories = await this.#categoryService.getAllByNames(
        subNames
      );

      for (const sub of savedSubCategories) {
        categoryMap.set(sub.name, sub._id);
      }
    }

    // PRODUCT HANDLING
    const preparedProducts = productDtos.map((dto) => {
      const categoryId =
        categoryMap.get(dto.subCategoryName) ||
        categoryMap.get(dto.categoryName);

      return {
        updateOne: {
          filter: { code: dto.code },
          update: { $setOnInsert: { ...dto, category: categoryId } },
          upsert: true,
        },
      };
    });

    const result = await this.#model.bulkWrite(preparedProducts, {
      ordered: false,
    });

    return success({
      rows: rows.length,
      insertedProducts: result.upsertedCount,
      insertedCategories: categoryResult.upsertedCount,
      insertedSubCategories: subCategoryResult?.upsertedCount || 0,
    });
  }
}

export default ProductService;
