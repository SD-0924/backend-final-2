import { User } from "../models/UserModel";

export default class UserService {
  static async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  static async createUser(user: Omit<object, "role">) {
    const result = await User.create(user);
    return result;
  }
}
