import { Request, Response, NextFunction } from "express";
import UserService from "../services/userServices";
import bcrypt from "bcrypt";
import dayjs from "dayjs";


export const getUserProfile = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
  try {
    console.log("Fetching profile for authenticated user...");

    // Extract userId from token
    const userId = (req as any).token.id;

    console.log("Authenticated user ID:", userId);

    // Fetch user from database
    const user = await UserService.getUserById(userId);

    if (!user) {
       res.status(404).json({ message: "User not found." });
       return;
    }

    // Respond with user profile data
    res.status(200).json({
      id: user.user_id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user profile:", error.message);
    } else {
      console.error("Error fetching user profile:", error);
    }
    res.status(500).json({ message: "Internal server error." });
  }
};



export const updatePassword = async (
  req: Request, 
  res: Response, 
  next: NextFunction
):Promise<void> => {
  try{
    const userId = (req as any).token.id;
    const {currentPassword, newPassword, confirmPassword} = req.body;

    // Check if newPassword matches confirmPassword
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match." });
      return;
    } 
    //check if all fields are provided
    if(!currentPassword || !newPassword || !confirmPassword){
       res.status(400).json({message: "All fields are required." });
       return;
    }
    

    //fetch the user from the database
    const user = await UserService.getUserById(userId);

    if(!user){
      res.status(404).json({message: "User not found." });
      return;
    }

    

    //check if password was changed in the last 24 hours
    if(user.lastPasswordChange){
      const lastChange = dayjs(user.lastPasswordChange);
      const now = dayjs();
      if(now.diff(lastChange, 'hour')<24){
        res.status(429).json({//429 status means too many requests error
          message:"Password can only be changed once every 24 hours",
        });
        return;
      }
    }

    console.log("Current password provided:", currentPassword);
    console.log("Current user password hash:", user.password);

    //verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordValid){
      res.status(401).json({message:"Current password is incorrect."});
      return
    }
    
    //update the password in the database
    await UserService.updateUserPassword(userId, newPassword);
    
    //update the lastPasswordChange timestamp
    await UserService.updateLastPasswordChange(userId);

    //respond to the client
    res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};