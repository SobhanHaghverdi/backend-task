import Excel from "exceljs";
import moment from "moment-jalaali";
import Product from "./product-model.js";
import CategoryService from "../category/category-service.js";
import { success } from "../../common/utils/service-response.js";
import ObjectIdHelper from "../../common/utils/object-id-helper.js";
import BooleanReplace from "../../common/constant/boolean-replace.js";

class ProductService {
  #model;
  #categoryService;

  constructor() {
    this.#model = Product;
    this.#categoryService = new CategoryService();
  }

  async filter(query) {
    const {
      pageNumber = 1,
      search = undefined,
      sort = "-createdAt",
      isActive = undefined,
      minPrice = undefined,
      maxPrice = undefined,
      minAmper = undefined,
      maxAmper = undefined,
      categoryIds = undefined,
      warrantyActive = undefined,
      subCategoryIds = undefined,
      warrantyStartDateFrom = undefined,
      warrantyStartDateTo = undefined,
      warrantyEndDateFrom = undefined,
      warrantyEndDateTo = undefined,
    } = query;

    const pageSize = parseInt(query.pageSize) || 20;

    const [field, direction] = sort.startsWith("-")
      ? [sort.slice(1), -1]
      : [sort, 1];

    const relationalCondition = {};
    const mainCondition = {};

    if (search) {
      const searchRegex = new RegExp(`${search.trim()}`);

      relationalCondition.$or = [
        { name: { $regex: searchRegex } },
        { code: { $regex: searchRegex } },
        { "category.name": { $regex: searchRegex } },
        { "category.parent.name": { $regex: searchRegex } },
      ];
    }

    //* Filter by main categories
    if (categoryIds?.length) {
      let fixedCategoryIds = categoryIds.split(",");

      fixedCategoryIds = fixedCategoryIds?.map((id) =>
        ObjectIdHelper.convert(id)
      );

      const expression = [
        { "category._id": { $in: fixedCategoryIds } },
        { "category.parent._id": { $in: fixedCategoryIds } },
      ];

      if (relationalCondition.$or) relationalCondition.$or.push(...expression);
      else relationalCondition.$or = expression;
    }

    //* Filter by sub categories
    if (subCategoryIds?.length) {
      let fixedSubCategoryIds = subCategoryIds.split(",");

      fixedSubCategoryIds = fixedSubCategoryIds?.map((id) =>
        ObjectIdHelper.convert(id)
      );

      mainCondition.category = { $in: fixedSubCategoryIds };
    }

    if (isActive !== undefined) {
      mainCondition.isActive = BooleanReplace[isActive];
    }

    if (warrantyActive !== undefined) {
      const operator = BooleanReplace[warrantyActive] ? "$gt" : "$lte";
      mainCondition.warrantyEndDate = { [operator]: new Date() };
    }

    //* Filter by price
    if (minPrice || maxPrice) {
      mainCondition.price = {};

      if (minPrice) mainCondition.price.$gte = parseInt(minPrice);
      if (maxPrice) mainCondition.price.$lte = parseInt(maxPrice);
    }

    //* Filter by amper
    if (minAmper || maxAmper) {
      mainCondition.amp = {};

      if (minAmper) mainCondition.amp.$gte = parseInt(minAmper);
      if (maxAmper) mainCondition.amp.$lte = parseInt(maxAmper);
    }

    //* Filter by warranty start date
    if (warrantyStartDateFrom || warrantyStartDateTo) {
      mainCondition.warrantyStartDate = {};

      if (warrantyStartDateFrom) {
        mainCondition.warrantyStartDate.$gte = new Date(warrantyStartDateFrom);
      }

      if (warrantyStartDateTo) {
        mainCondition.warrantyStartDate.$lte = new Date(warrantyStartDateTo);
      }
    }

    //* Filter by warranty end date
    if (warrantyEndDateFrom || warrantyEndDateTo) {
      mainCondition.warrantyEndDate = {};

      if (warrantyEndDateFrom) {
        mainCondition.warrantyEndDate.$gte = new Date(warrantyEndDateFrom);
      }

      if (warrantyEndDateTo) {
        mainCondition.warrantyEndDate.$lte = new Date(warrantyEndDateTo);
      }
    }

    const [result] = await this.#model.aggregate([
      { $match: mainCondition },
      {
        $lookup: {
          localField: "category",
          foreignField: "_id",
          from: "categories",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category.parent",
          foreignField: "_id",
          as: "category.parent",
        },
      },
      {
        $unwind: {
          path: "$category.parent",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: relationalCondition },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { [field]: direction } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            { $project: { description: 0 } },
          ],
        },
      },
      { $project: { data: 1, metadata: 1 } },
    ]);

    return {
      total: result?.metadata?.[0]?.total || 0,
      data: result?.data || [],
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

    const REQUIRED_HEADERS = {
      price: ["price", "قیمت"],
      amp: ["amp", "amper", "آمپر"],
      name: ["product name", "name", "نام"],
      code: ["code", "product code", "شناسه کالا"],
      isActive: ["is Active", "active", "status", "وضعیت"],
      category: ["category", "category name", "دسته اصلی"],
      subCategory: ["sub category", "sub category name", "زیردسته"],
      warrantyDurationInMonth: ["warranty months", "مدت گارانتی (ماه)"],
      warrantyStartDate: [
        "warranty_start",
        "warranty start date",
        "شروع گارانتی",
      ],
    };

    let columnMap = {};

    //* Prepare data for inserting
    worksheet.eachRow((row, rowNumber) => {
      //* Map and index headers values
      if (rowNumber === 1) {
        const headerValues = row.values.map((v) =>
          String(v).toLowerCase().trim()
        );

        for (const [key, aliases] of Object.entries(REQUIRED_HEADERS)) {
          const index = headerValues.findIndex((h) =>
            aliases.some((a) => a.toLowerCase() === h)
          );

          if (index === -1) throw new Error(`Missing required column: ${key}`);
          columnMap[key] = index;
        }

        return;
      }

      const values = row.values;

      const start = moment(
        values[columnMap.warrantyStartDate],
        "jYYYY-jMM-jDDTHH:mm:ss.SSS"
      ).utc();

      const warrantyEndDate = start
        .clone()
        .add(values[columnMap.warrantyDurationInMonth], "months")
        .toDate();

      const dto = {
        warrantyEndDate,
        amp: values[columnMap.amp],
        code: values[columnMap.code],
        name: values[columnMap.name],
        price: values[columnMap.price],
        warrantyStartDate: start.toDate(),
        isActive: values[columnMap.isActive] === "فعال",
      };

      const category = values[columnMap.category]?.trim();
      const subCategory = values[columnMap.subCategory]?.trim();

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
    const categories = await this.#categoryService.getAllByNames([
      ...new Set(categoryDtos.map((c) => c.name)),
    ]);

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

      const savedSubCategories = await this.#categoryService.getAllByNames(
        preparedSubCategories.map((s) => s.name)
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
      duplicatedProducts: rows.length - result.upsertedCount,
      insertedSubCategories: subCategoryResult?.upsertedCount || 0,
    });
  }
}

export default ProductService;
