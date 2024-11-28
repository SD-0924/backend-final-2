import express from "express";
import { login, signUp } from "../controllers/authController";


export const authRouter = express.Router();

authRouter.post('/sign-up/', signUp);
authRouter.post('/login/', login);