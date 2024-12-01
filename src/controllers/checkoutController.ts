import { Request, Response, NextFunction } from 'express'

export const getPrevOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    res.status(500).json({
      //  message:error.message
    })
  }
  //get orders of the logged in user (order id , date , price , status , [completed , processing , cancelled])
  //send it back to the client
}
