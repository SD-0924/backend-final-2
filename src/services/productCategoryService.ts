// Import the constants
import { FIELD_NAMES, PAGINATION } from '../constants'

// Import product service
import { productService } from './productService'

// Import Sequelize instance
import { sequelize } from '../config/db'
import { QueryTypes } from 'sequelize'

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
  `

    const products: any = await sequelize.query(query, {
      replacements: {
        categoryId: category_id,
        limit: PAGINATION.DEFAULT_PAGE_SIZE,
        offset: (page_number - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
      },
      type: QueryTypes.SELECT,
    })
    const result: any = {}

    if (products.length !== 0) {
      if (
        products[0][FIELD_NAMES.TOTAL_COUNT] % PAGINATION.DEFAULT_PAGE_SIZE ===
        0
      ) {
        result.number_of_pages = Math.floor(
          products[0][FIELD_NAMES.TOTAL_COUNT] / PAGINATION.DEFAULT_PAGE_SIZE
        )
      } else {
        result.number_of_pages =
          Math.floor(
            products[0][FIELD_NAMES.TOTAL_COUNT] / PAGINATION.DEFAULT_PAGE_SIZE
          ) + 1
      }
      for (const product of products) {
        productService.addDiscountInfo(product)
        await productService.addRatingInfo(product)
        delete product[FIELD_NAMES.STOCK]
        delete product[FIELD_NAMES.DESCRIPTION]
        delete product[FIELD_NAMES.MERCHANT_ID]
        delete product[FIELD_NAMES.BRAND_IMAGE_URL]
        delete product[FIELD_NAMES.CREATED_AT]
        delete product[FIELD_NAMES.UPDATED_AT]
        delete product[FIELD_NAMES.TOTAL_COUNT]
      }
      result.products = products
    }
    return result
  }
}
