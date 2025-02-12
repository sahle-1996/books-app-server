import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    console.log(process.env.JWT_SECRET);
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = verified.userId; // Attach userId to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
