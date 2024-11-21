// Import product model
import { Product } from "../models/ProductModel";

// Import rating model
import { Rating } from "../models/RatingModel";

// Import Sequelize and Op from sequelize module
import { Sequelize, Op } from "sequelize";

export class productService {
  // This method to add discount information to product information
  static addDiscountInfo(productInfo: any) {
    if (productInfo.discount_percentage === 0) {
      productInfo.price_after_discount = null;
      return;
    }
    const discountValue =
      productInfo.price * (productInfo.discount_percentage / 100);
    productInfo.price_after_discount = productInfo.price - discountValue;
    productInfo.price_after_discount = parseFloat(
      productInfo.price_after_discount.toFixed(2)
    );
  }
  // This method to get new arrivals products
  static async getNewArrivalsProducts() {
    const currentMonth: number = new Date().getMonth() + 1;
    let targetMonth: number = 0;
    if (currentMonth === 1) {
      targetMonth = 10;
    } else if (currentMonth === 2) {
      targetMonth = 11;
    } else if (currentMonth === 3) {
      targetMonth = 12;
    } else {
      targetMonth = currentMonth - 3;
    }
    const products: any = await Product.findAll({
      where: Sequelize.where(
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        targetMonth
      ),
      raw: true,
    });
    for (const product of products) {
      this.addDiscountInfo(product);
      delete product.stock;
      delete product.merchant_id;
      delete product.brand_name;
      delete product.createdAt;
      delete product.updatedAt;
    }
    return products;
  }
  // This method to add rating information to product information
  static async addRatingInfo(productInfo: any) {
    const ratingInfo: any = await Rating.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "number_of_ratings"],
        [Sequelize.fn("AVG", Sequelize.col("rating")), "average_rating"],
      ],
      where: {
        product_id: productInfo.product_id,
      },
      raw: true,
    });
    productInfo.number_of_ratings = ratingInfo[0].number_of_ratings;
    if (ratingInfo[0].average_rating !== null) {
      productInfo.average_rating = parseFloat(
        Number(ratingInfo[0].average_rating).toFixed(2)
      );
    } else {
      productInfo.average_rating = ratingInfo[0].average_rating;
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
    });
    for (const product of products) {
      this.addDiscountInfo(product);
      await this.addRatingInfo(product);
      delete product.stock;
      delete product.merchant_id;
      delete product.brand_name;
      delete product.createdAt;
      delete product.updatedAt;
    }
    return products;
  }
}
