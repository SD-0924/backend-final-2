import { Request, Response, NextFunction } from "express";
import UserService from "../services/userServices";
import generateToken from "../utils/generateToken";
import { configDotenv } from "dotenv";
import Joi from "Joi";
configDotenv();
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validation logic
    console.log("this is body,", req.body);
    const schema = Joi.object({
      firstName: Joi.string().alphanum().min(2).max(15).required(),
      lastName: Joi.string().alphanum().min(2).max(15).required(),
      address: Joi.string().min(20).max(100).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org", "io"] },
        })
        .required(),
      role: Joi.string().valid("user", "merchant").required(),
      phone: Joi.string()
        .required()
        .pattern(/^\+?[1-9]\d{1,14}$/),

      dateOfBirth: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(6)
        .max(30)
        .required(),
    });
    console.log(req.body);
    const { value, error } = schema.validate(req.body);
    console.log(error);
    console.log(value);
    if (error) {
      res.status(400).send(error + "");
      return;
      // throw error;rs
    }
    //check if email does not exist then email is in database
    const userd = await UserService.findUserByEmail(value.email);
    console.log("this is suserdddd", userd);
    if (userd) {
      res.status(400).json({
        success: false,
        message: "User already exists, please login.",
      });
      return;
    }
    const user = await UserService.createUser(value);
    if (!user) {
      throw new Error("Internal server Error");
    }
    //generate token

    const token = generateToken(
      { id: req.body.id, role: req.body.role },
      process.env.JWT_SECRET || ""
    );

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
