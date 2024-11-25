// Import product service
import { productService } from "./productService";

// Import Sequelize instance
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";

export class productCategoryService {
  // This function to get all products that belongs to category based on pagination
  static async getProductsBelongsToCategory(
    category_id: number,
    page_number: number
  ) {
    const query = `
    SELECT p.*, 
           (SELECT COUNT(*) FROM product_category pc WHERE pc.category_id = :categoryId) AS totalCount
    FROM product p
    JOIN product_category pc ON p.product_id = pc.product_id
    WHERE pc.category_id = :categoryId
    LIMIT :limit OFFSET :offset;
  `;

    const products: any = await sequelize.query(query, {
      replacements: {
        categoryId: category_id,
        limit: 9,
        offset: (page_number - 1) * 9,
      },
      type: QueryTypes.SELECT,
    });
    const result: any = {};

    if (products.length !== 0) {
      if (products[0].totalCount % 9 === 0) {
        result.number_of_pages = Math.floor(products[0].totalCount / 9);
      } else {
        result.number_of_pages = Math.floor(products[0].totalCount / 9) + 1;
      }
      for (const product of products) {
        productService.addDiscountInfo(product);
        await productService.addRatingInfo(product);
        delete product.stock;
        delete product.merchant_id;
        delete product.brand_name;
        delete product.brand_image_url;
        delete product.createdAt;
        delete product.updatedAt;
        delete product.totalCount;
      }
      result.products = products;
    }
    return result;
  }
}
