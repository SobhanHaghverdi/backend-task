import Excel from "exceljs";
import moment from "moment-jalaali";
import Product from "./product-model.js";
import { success } from "../../common/utils/service-response.js";

class ProductService {
  #model;

  constructor() {
    this.#model = Product;
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
    const dtos = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; //* skip header
      const values = row.values.slice(4);

      const startJalali = moment(values[6], "jYYYY-jMM-jDDTHH:mm:ss.SSS").utc();
      const warrantyStartDate = startJalali.toDate();

      const warrantyEndDate = startJalali
        .clone()
        .add(values[7], "months")
        .toDate();

      const dto = {
        amp: values[2],
        warrantyEndDate,
        code: values[8],
        name: values[0],
        price: values[5],
        warrantyStartDate,
        isActive: values[1] === "فعال" ? true : false,
      };

      dtos.push({ insertOne: { document: dto } });
      rows.push(dto);
    });

    await this.#model.bulkWrite(dtos, { ordered: false });
    return success(rows);
  }
}

export default ProductService;
