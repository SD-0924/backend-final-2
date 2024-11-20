import jwt from "jsonwebtoken";

export default function generateToken(payload: any, secret: string) {
  if (payload.role === "user" || (payload.role === "merchent" && payload.id)) {
    const token = jwt.sign(payload, secret);
    return token;
  } else {
    throw new Error("Role required in the payload");
  }
}
