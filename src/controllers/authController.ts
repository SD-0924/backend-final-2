import { Request, Response, NextFunction } from 'express'
import UserService from '../services/userServices'
import generateToken from '../utils/generateToken'
import { configDotenv } from 'dotenv'
import {
  validateUserSignUp,
  validateMerchantSignUp,
  validateLoginUser,
} from '../utils/validateUser'
import MerchantService from '../services/merchantService'
import bcrypt from 'bcrypt'

configDotenv()
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result: any //mercahnt or user object

    if (req.body.role === 'user') {
      //validation logic

      const { value, error } = validateUserSignUp(req.body)

      if (error) {
        res.status(400).send(error + '')
        return
      }

      //make sure user does not exist
      if (await UserService.findUserByEmail(value.email)) {
        res.status(400).json({
          success: false,
          message: 'User already exists, please login.',
        })
        return
      }
      //create user
      const user = await UserService.createUser(value)
      if (!user) {
        throw new Error('Internal server Error')
      }
      result = user
    }

    if (req.body.role === 'merchant') {
      //validation logic

      const { value, error } = validateMerchantSignUp(req.body)
      if (error) {
        res.status(400).send(error + '')
        return
      }
      //make sure merchant does not exist
      if (await MerchantService.findMerchantByEmail(value.email)) {
        res.status(400).json({
          success: false,
          message: 'User already exists, please login.',
        })
        return
      }
      const merchant = await MerchantService.createUser(value)
      if (!merchant) {
        throw new Error('Internal server Error')
      }
      result = merchant
    }
    //generate token
    const token = generateToken({
      id: result.user_id || result.merchant_id,
      role: req.body.role,
    })
    //send back to the user
    res.status(201).json({
      success: true,
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 HEAD

  const{value,error} = validateLoginUser(req.body);

  if (error) {
    res.status(400).send(error + '')

    return
  }

  const user = await UserService.findUserByEmail(value.email)

  if (!user) {
    res.status(404).send('your email or password ')
  } else {
    const payload = {

      id: user.dataValues?.user_id,
      role: value.role,
    }

    //check if the password is correct
    if (await bcrypt.compare(value.password, user.dataValues?.password)) {

      const token = generateToken(payload)
      res.status(200).json({ token })
    } else {
      res.status(404).json({
        message: 'your password is wrong',
      })
    }
  }
}