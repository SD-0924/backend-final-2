import { Merchant } from "../models/MerchantModel";

export default class MerchantService {
  static async findMerchantByEmail(email: string) {
    const user = await Merchant.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  static async createUser(user: Omit<object, "role">) {
    const result = await Merchant.create(user);
    return result;
  }
}
