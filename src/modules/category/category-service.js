import Category from "./category-model.js";

class CategoryService {
  #model;

  constructor() {
    this.#model = Category;
  }

  async createMany(dtos) {
    const ops = dtos.map((dto) => ({
      updateOne: {
        filter: { name: dto.name },
        update: { $setOnInsert: dto },
        upsert: true,
      },
    }));

    return await this.#model.bulkWrite(ops, { ordered: false });
  }

  async getAllByNames(names) {
    const fixedNames = names.map((name) => name?.trim());
    return await this.#model.find({ name: { $in: fixedNames } }).lean();
  }
}

export default CategoryService;
