// Import rating model
import { Rating } from '../models/RatingModel'

// Import Sequelize and Op from sequelize module
import { Sequelize } from 'sequelize'
import { RatingObject } from '../controllers/ratingController'
export class ratingService {
  // This function to get number of persons that rating the product and average rating
  static async getProductRating(product_id: number) {
    return await Rating.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('rating')), 'number_of_ratings'],
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'average_rating'],
      ],
      where: {
        product_id,
      },
      raw: true,
    })
  }

  static async addRating({
    user_id,
    product_id,
    rating,
    review,
  }: RatingObject) {
    const newRating = await Rating.create({
      user_id,
      product_id,
      rating,
      review,
    })
    return newRating
  }

  static async updateRating({
    user_id,
    product_id,
    rating,
    review,
  }: RatingObject) {
    const [affectedRowsCount] = await Rating.update(
      {
        rating,
        review,
      },
      { where: { user_id, product_id } }
    )
    return affectedRowsCount
  }
}
