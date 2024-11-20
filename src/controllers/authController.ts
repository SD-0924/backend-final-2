import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //getting users data from  request
  const { email, password ,token} = req.body();
    let user;

    if(role === 'user'){
  //search for the user
   user = User.findOne({
    where: {
      email,
    },
  });
}
else{
    //search for the user
   user = MerchantModel.findOne({
    where: {
      email,
    },
  });
}


  //check if there's user with the given email
  if (!user) {
    throw new Error("The entered email is not register.");
  } else {
    const payload = {
      id: user.id,
      role: role
    };

    //check if the password is correct then generate token if correct
    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(payload);
      res.status(200).json({ token });
    } else {
      throw new Error("your email or password is wrong");
    }
  }
};
