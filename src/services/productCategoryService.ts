// Import productCategory model
import { ProductCategory } from "../models/ProductCategoryModel";

export class productCategoryService {
  // This function to get all products that belongs to category
  static async getProductsBelongsToCategory(category_id: number) {
    return await ProductCategory.findAll({
      where: {
        category_id,
      },
      raw: true,
    });
  }
}
