// Import the constants
import { CONSTANTS, FIELD_NAMES, RATING } from '../constants'

// Import product model
import { Product } from '../models/ProductModel'

// Import rating service
import { ratingService } from '../services/ratingService'

// Import category service
import { categoryService } from '../services/categoryService'

// Import productCategory service
import { productCategoryService } from '../services/productCategoryService'

// Import Sequelize and Op from sequelize module
import { Sequelize, Op } from 'sequelize'

export class productService {
  // This method to add discount information to product information
  static addDiscountInfo(productInfo: any) {
    if (productInfo.discount_percentage === CONSTANTS.DISCOUNT_ZERO) {
      productInfo.price_after_discount = null
      return
    }
    const discountValue =
      productInfo.price * (productInfo.discount_percentage / 100)
    productInfo.price_after_discount = productInfo.price - discountValue
    productInfo.price_after_discount = parseFloat(
      productInfo.price_after_discount.toFixed(CONSTANTS.DISCOUNT_PRECISION)
    )
  }
  // This method to get new arrivals products
  static async getNewArrivalsProducts() {
    const currentMonth: number = new Date().getMonth() + 1
    let targetMonth: number = 0
    if (currentMonth >= 4 && currentMonth <= 12) {
      targetMonth = currentMonth - 3
    } else {
      targetMonth = CONSTANTS.MONTH_MAPPING[currentMonth]
    }
    const products: any = await Product.findAll({
      where: Sequelize.where(
        Sequelize.fn('MONTH', Sequelize.col('createdAt')),
        targetMonth
      ),
      raw: true,
    })
    for (const product of products) {
      this.addDiscountInfo(product)
      delete product[FIELD_NAMES.STOCK]
      delete product[FIELD_NAMES.MERCHANT_ID]
      delete product[FIELD_NAMES.DESCRIPTION]
      delete product[FIELD_NAMES.CREATED_AT]
      delete product[FIELD_NAMES.UPDATED_AT]
      delete product[FIELD_NAMES.BRAND_IMAGE_URL]
    }
    return products
  }
  // This method to add rating information to product information
  static async addRatingInfo(productInfo: any) {
    const ratingInfo: any = await ratingService.getProductRating(
      productInfo[FIELD_NAMES.PRODUCT_ID]
    )
    productInfo.number_of_ratings = ratingInfo[0].number_of_ratings
    if (ratingInfo[0].average_rating !== RATING.DEFAULT_RATING) {
      productInfo.average_rating = parseFloat(
        Number(ratingInfo[0].average_rating).toFixed(RATING.PRECISION)
      )
    } else {
      productInfo.average_rating = ratingInfo[0].average_rating
    }
  }
  // This method to get all products that matched user search
  static async findProductsByText(text: string) {
    const products: any = await Product.findAll({
      where: {
        [Op.or]: [
          {
            brand_name: {
              [Op.like]: `%${text}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${text}%`,
            },
          },
        ],
      },
      raw: true,
    })
    for (const product of products) {
      this.addDiscountInfo(product)
      await this.addRatingInfo(product)
      delete product[FIELD_NAMES.STOCK]
      delete product[FIELD_NAMES.DESCRIPTION]
      delete product[FIELD_NAMES.MERCHANT_ID]
      delete product[FIELD_NAMES.CREATED_AT]
      delete product[FIELD_NAMES.UPDATED_AT]
      delete product[FIELD_NAMES.BRAND_IMAGE_URL]
    }
    return products
  }
  // This method to get a specific product based on id
  static async findProductById(product_id: number) {
    const product: any = await Product.findByPk(product_id, {
      raw: true,
    })
    if (product === null) {
      return {}
    }
    this.addDiscountInfo(product)
    await this.addRatingInfo(product)
    delete product[FIELD_NAMES.PRODUCT_ID]
    delete product[FIELD_NAMES.MERCHANT_ID]
    delete product[FIELD_NAMES.CREATED_AT]
    delete product[FIELD_NAMES.UPDATED_AT]
    delete product[FIELD_NAMES.BRAND_IMAGE_URL]
    return product
  }
  // This method to get all products that belongs to category
  static async findProductsByCategory(
    categoryName: string,
    pageNumber: number
  ) {
    const categoryInfo: any =
      await categoryService.getCategoryByName(categoryName)
    if (!categoryInfo) {
      return {}
    }
    const products: any =
      await productCategoryService.getProductsBelongsToCategory(
        categoryInfo.category_id,
        pageNumber
      )
    return products
  }

  // This method to get all brands
  static async getBrandsService() {
    const brands = await Product.findAll({
      attributes: ['brand_image_url', 'brand_name'],
      group: ['brand_name', 'brand_image_url'],
    })
    console.log(brands)
    return brands.map((e) => e.dataValues)
  }
}

export const getProductByBrand = async (brand: string) => {
  try {
    const products = await Product.findAll({
      where: {
        brand_name: brand,
      },
    })
    if (products.length === 0) {
      return { status: 404, response: 'No products found' }
    }
    return { status: 200, response: products }
  } catch (error) {
    return { status: 500, response: error }
  }
}

export const createProduct = async (product: any) => {
  try {
    const newProduct = await Product.create(product)
    return { status: 201, response: newProduct }
  } catch (error) {
    return { status: 500, response: error }
  }
}
