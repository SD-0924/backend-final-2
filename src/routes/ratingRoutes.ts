import express from 'express'
import { addRating, updateRating } from '../controllers/ratingController'

export const ratingRouter = express.Router()

ratingRouter.post('/rating', addRating)
ratingRouter.put('/rating', updateRating)
