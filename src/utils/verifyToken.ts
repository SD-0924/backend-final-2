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
    console.log("VerifyToken Middleware: Checking authorization header...");
    const authHeader = req.headers["authorization"];
    console.log("Request Headers:", req.headers);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header is missing')
      throw new Error('Please provide a valid authorization header')
    }

    //parse the token string
    console.log("VerifyToken Middleware: Parsing token...");
    const token = authHeader.replace('Bearer ', '')
    if (!token) {
       console.error("VerifyToken Error: Token is empty after parsing.");
      throw new Error('Token is empty after stripping Bearer')
    }

    //decode the token
    console.log("VerifyToken Middleware: Verifying token...");
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || ''

    ) as JwtPayload;
    // (req as CustomRequest).token = decodedToken
    // console.log("VerifyToken Middleware: Token verified successfully.");
    req.token = decodedToken;
    console.log("VerifyToken Middleware: Token verified successfully. Decoded token:", decodedToken);


    next()
  } catch (err: any) {
   if (err instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error:", err.message);
      res.status(403).json({ message: "Invalid token." });
      return;
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error("JWT Expired Error:", err.message);
      res.status(403).json({ message: "Token expired." });
      return;
    } else {
      console.error("VerifyToken Middleware: Unexpected error:", err.message);
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  }
}
