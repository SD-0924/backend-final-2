// Import rating model
import { Rating } from "../models/RatingModel";

// Import Sequelize and Op from sequelize module
import { Sequelize } from "sequelize";

export class ratingService {
  // This function to get number of persons that rating the product and average rating
  static async getProductRating(product_id: number) {
    return await Rating.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "number_of_ratings"],
        [Sequelize.fn("AVG", Sequelize.col("rating")), "average_rating"],
      ],
      where: {
        product_id,
      },
      raw: true,
    });
  }
}
