import { Request, Response, NextFunction } from "express";
import UserService from "../services/userServices";

export const getCheckoutInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Log the request to see where the token is located
    console.log("Request Object:", req);
    // Get the user ID from the request token (assuming authentication middleware is in place)
    const userId = (req as any).token?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized, no valid user ID found." });
      return;
    }
    // Fetch user data using UserService
    const user = await UserService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Prepare the required user information for checkout
    const checkoutInfo = {
    //   id: user.user_id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
    };

    // Send the response back to the client
    res.status(200).json(checkoutInfo);
  } catch (error) {
    console.error("Error fetching checkout information:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const userId = (req as any).token?.id;

    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized, no valid user ID found." });
      return;
    }

    // Extract the new address from the request body
    const { address } = req.body;

    // Validate that the address is provided
    if (!address) {
      res.status(400).json({ message: "Address is required." });
      return;
    }

    // Update the user's address using the UserService
    const updatedUser = await UserService.updateUserAddress(userId, address);

    // Respond with a success message and updated user data
    res.status(200).json({ message: "Address updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};