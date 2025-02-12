import express, {request, response } from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/booksRoute.js";
import userRoute from './routes/userRoute.js';
import cors from "cors";
const app = express();
app.use(express.urlencoded({extended:true}))

app.use("/uploads",express.static("uploads"))

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Allow All Origins with Default fo cors(*)
app.use(cors());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome to MERN stack");
});

// Midleware
app.use("/books", booksRoute);
app.use('/user', userRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("The Databse connected successfuly!");
    app.listen(PORT, () => {
      console.log(`App is listening on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
