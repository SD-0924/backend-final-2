import { Request, Response, NextFunction } from "express";
import UserService from "../services/userServices";
import generateToken from "../utils/generateToken";
import { configDotenv } from "dotenv";
import {
  validateUserSignUp,
  validateMerchantSignUp,
} from "../utils/validateUser";
import MerchantService from "../services/merchantService";

configDotenv();
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result: any; //mercahnt or user object

    if (req.body.role === "user") {
      //validation logic

      const { value, error } = validateUserSignUp(req.body);

      if (error) {
        res.status(400).send(error + "");
        return;
      }

      //make sure user does not exist
      if (await UserService.findUserByEmail(value.email)) {
        res.status(400).json({
          success: false,
          message: "User already exists, please login.",
        });
        return;
      }
      //create user
      const user = await UserService.createUser(value);
      if (!user) {
        throw new Error("Internal server Error");
      }
      result = user;
    }

    if (req.body.role === "merchant") {
      //validation logic

      const { value, error } = validateMerchantSignUp(req.body);
      if (error) {
        res.status(400).send(error + "");
        return;
      }
      //make sure merchant does not exist
      if (await MerchantService.findMerchantByEmail(value.email)) {
        res.status(400).json({
          success: false,
          message: "User already exists, please login.",
        });
        return;
      }
      const merchant = await MerchantService.createUser(value);
      if (!merchant) {
        throw new Error("Internal server Error");
      }
      result = merchant;
    }
    //generate token
    const token = generateToken({
      id: result.user_id || result.merchant_id,
      role: req.body.role,
    });
    //send back to the user
    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
