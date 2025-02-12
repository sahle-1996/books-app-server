import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js"; // Import Book model
import verifyToken from "../middleware/verifyToken.js"; // Import verifyToken middleware
// const nodemailer = require('nodemailer');
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
// Helper Function to Generate JWT
const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Route for User Sign Up
router.post("/signup", async (request, response) => {
  try {
    const { username, email, password } = request.body;

    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return response
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return response.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for User Login
router.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with userId included
    const token = jwt.sign(
      { userId: user._id, isLogged: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return response.status(200).json({ token, username: user.username });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get books for the logged-in user
router.get("/books", verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Get the userId from the decoded token
    console.log(userId);
    const books = await Book.find({ userId}); // Filter books by userId
    console.log(books);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
