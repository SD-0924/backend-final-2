import {Request,Response, NextFunction } from "express";
import jwt, { JwtPayload}from "jsonwebtoken";


export interface CustomRequest extends Request {
    token ?: string | JwtPayload;
}



export const verifyToken = async(req : CustomRequest , res : Response , next: NextFunction)=>{
    try{
        const authHeader = req.header("Authorization");

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            console.log('Authorization header is missing');
            throw new Error('Please provide a valid authorization header');
        }


        const token = authHeader.replace('Bearer ','')
    }
}