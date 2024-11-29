import { Request, Response, NextFunction } from 'express'
import { ratingService } from '../src/services/ratingService'
import { addRating, updateRating } from '../src/controllers/ratingController'

let req: Partial<Request>
let res: Partial<Response>

jest.mock('../src/services/ratingService', () => ({
  addRating: jest.fn(),
  updateRating: jest.fn(),
}))
beforeEach(() => {
  jest.clearAllMocks()
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }
})
let mockValidRating = {
  rating: 1,
  user_id: 3,
  review: 'Great product!',
  product_id: 9,
}
req = {
  body: {
    rating: 1,
    user_id: 3,
    review: 'Great product!',
    product_id: 9,
  },
}

describe('Testing the addRating controller', () => {
  it('should return 201 for seccessfull creating a product', async () => {
    ;(ratingService.addRating as jest.Mock).mockResolvedValue(mockValidRating)
    await addRating(req as Request, res as Response)
    expect(res.json).toHaveBeenCalledWith({
      ...mockValidRating,
    })
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('should return 400 for invalid input < 5 characters', async () => {
    req = {
      body: {
        rating: 1,
        user_id: 3,
        product_id: 9,
        review: '123',
      },
    }

    await addRating(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 for missing input', async () => {
    req = {
      body: {
        rating: 1,
        user_id: 3,
        product_id: 9,
      },
    }

    await addRating(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 500 if rating is already made ', async () => {
    req = {
      body: {
        rating: 1,
        user_id: 3,
        review: 'Great Product',
        product_id: 9,
      },
    }
    ;(ratingService.addRating as jest.Mock).mockRejectedValue(
      new Error('validation error')
    )

    await addRating(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'validation error',
    })
  })
})

describe('Testing the updateRating controller', () => {
  it('should return 201 if rating is successfully updated ', async () => {
    req = {
      body: {
        ...mockValidRating,
        review: 'Updated',
      },
    }
    ;(ratingService.updateRating as jest.Mock).mockResolvedValue(1)

    await updateRating(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      ...mockValidRating,
      review: 'Updated',
    })
  })

  it('should return 400 if rating is not updated ', async () => {
    req = {
      body: {
        ...mockValidRating,
      },
    }
    ;(ratingService.updateRating as jest.Mock).mockResolvedValue(0)

    await updateRating(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide an updated rating value or review',
    })
  })
})
