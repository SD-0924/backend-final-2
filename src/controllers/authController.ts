import {Request, Response, NextFunction } from "express";



export const login = async(req : Request, res : Response,next: NextFunction)=>{

    const {email,password,role} =req.body();
    
    const user = User.findOne({
        where:{
            email,
        }
    })    

    if(!user){
        res.status(404).send('your email or password ')
    }
    else{
        const payload ={
            id: user.id
        }

        //check if the password is correct 
        if(await bcrypt.compare(password,user.password)){
            const token = generateToken(payload,role);
            res.status(200).json({token});
        }
        else{
            res.status(404).json({
                message:"your email or password is wrong"
            })
        }
    }




}