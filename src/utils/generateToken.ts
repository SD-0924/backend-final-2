import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "superSecret";
export default function generateToken(payload: any) {
  console.log(payload);
  if (payload.role === "user" || (payload.role === "merchant" && payload.id)) {
    const token = jwt.sign(payload, secret);
    return token;
  } else {
    throw new Error("Role required in the payload");
  }
}
