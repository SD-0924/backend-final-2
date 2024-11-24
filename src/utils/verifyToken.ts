import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.configDotenv()

export interface CustomRequest extends Request {
  token?: string | JwtPayload
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header is missing')
      throw new Error('Please provide a valid authorization header')
    }

    //parse the token string
    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      throw new Error('Token is empty after stripping Bearer')
    }

    //decode the token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || ''
    ) as JwtPayload;
    (req as CustomRequest).token = decodedToken

    next()
  } catch (err) {
    next(err)
  }
}
