import express from "express";
import dotenv from "dotenv";
import { Admin } from "./models/AdminModel";
import { sequelize, connectToDB } from "./config/db";
import { setupAssociations } from "./models/associations";
import { productRoutes } from "./routes/productRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import { invalidRoute, invalidJSON } from "./middleware/errorHandler";
import { signUp } from "./controllers/authController";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes"

import { imageRouter } from "./routes/uploadImageRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";


dotenv.config();
// dotenv.configDotenv();

export const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;


app.use("/api", productRoutes);
app.use("/api/", merchantRoutes);
app.use("/api", imageRouter);
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/user', profileRoutes)
// app.use("/api", authRouter);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

app.listen(PORT, async () => {
  // To create the tables, you need to convert the commented lines into normal code:

  // console.log("Connecting to DB...");

  // await connectToDB();
  // console.log("Connected to DB successfully.");
  console.log("Setting up associations...");
  setupAssociations();
  console.log("Associations are set up.");
  // console.log("Syncing Sequelize...");
  // await sequelize.sync({alter: true});
  // console.log("Sequelize has been synced.");
  // console.log("Syncing Admin model...");

  // await Admin.sync({ force: true });
  // console.log("Admin model has been synced.");

  // console.log(`Server is running on port ${PORT}`);
});
