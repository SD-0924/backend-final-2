import { User, UserCreationAttributes } from "../models/UserModel";

export default class UserService {
  static async findUserByEmail(email: string) {
    console.log("UserService: Searching for user by email:", email);

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        console.log("UserService: User found:", user.dataValues);
      } else {
        console.log("UserService: No user found with email:", email);
      }

      return user;
    } catch (error) {
      console.error("UserService: Error querying user by email:", (error as Error).message);
      throw error;
    }
  }

  static async createUser(user: Omit<UserCreationAttributes, "role">) {
    const result = await User.create(user);
    return result;
  }



  static async getUserById(id: number) {
    const user = await User.findOne({
      where: {
        user_id:id,
      },
       attributes: [
        "user_id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "dateOfBirth",
        "password",
        // "address",
         "profilePicture",
      ],
    });

    return user;
  }

  static async updateUserPassword(userId: number, newPassword: string){
    const user = await User.findOne({
      where: { 
        user_id: userId
      }
    });

    if(!user){
      throw new Error(`User with ID ${userId} not found.`);
    }

    user.password = newPassword;//assign the hashwd password directly
    await user.save(); //save the changes
  }

  
  static async updateLastPasswordChange(userId:number){
    const user = await User.findOne({
      where:{
        user_id:userId,
      },
    });

    if(!user){
      throw new Error(`User with ID ${userId} not found.`);
    }
    user.lastPasswordChange = new Date();
    await user.save();
  }
}

