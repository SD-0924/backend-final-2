export default class UserService {
  static async findUserByEmail(email: string) {
    return null;
  }

  static async createUser(user: Omit<object, "role">) {
    console.log(user);
    return user;
  }
}
