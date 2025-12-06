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
      const searchRegex = new RegExp(`${search}`);

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
            {
              $project: {
                description: 0,
              },
            },
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
