import { Request, Response } from 'express'
import { ratingService } from '../services/ratingService'
import Joi from 'joi'

export interface RatingObject {
  user_id: number
  product_id: number
  rating: number
  review: string
}
const schema = Joi.object({
  rating: Joi.number().max(5).min(1).required(),
  user_id: Joi.number().required(),
  review: Joi.string().min(5).max(500).required(),
  product_id: Joi.number().required(),
})
export const addRating = async (req: Request, res: Response) => {
  try {
    const rating = req.body

    const { error, value } = schema.validate(req.body)
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0],
      })
      return
    }

    const newRating = await ratingService.addRating(rating as RatingObject)

    res.status(201).json(newRating)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const updateRating = async (req: Request, res: Response) => {
  try {
    const { error, value } = schema.validate(req.body)
    if (error) {
      res.status(400).json({
        success: false,
        message: error,
      })
      return
    }
    const updatedRowCount = await ratingService.updateRating(
      req.body as RatingObject
    )
    if (updatedRowCount) {
      res.status(201).json({
        ...value,
      })
      return
    }
    res.status(400).json({
      success: false,
      message: 'Please provide an updated rating value or review',
    })
    return
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}