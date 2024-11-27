import express from "express";
import dotenv from "dotenv";
import { Admin } from "./models/AdminModel";
import { sequelize, connectToDB } from "./config/db";
import { setupAssociations } from "./models/associations";
import { productRoutes } from "./routes/productRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import { invalidRoute, invalidJSON } from "./middleware/errorHandler";
import { signUp } from "./controllers/authController";

import { imageRouter } from "./routes/uploadImageRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";

//import colors
import colors from "colors";
import { col } from "sequelize";

dotenv.config();
// dotenv.configDotenv();
export const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

app.use("/api", productRoutes);
app.use("/api/", merchantRoutes);
app.use("/api", imageRouter);
app.get("/api/wishlist", wishlistRoutes);

// Middleware to handle invalid routes
app.use(invalidRoute);

// Middleware to handle invalid JSON structure
app.use(invalidJSON);

app.listen(PORT, async () => {
  // To create the tables, you need to convert the commented lines into normal code:
  console.log(colors.blue("Connecting to DB..."));
  await connectToDB();
  console.log(colors.green("Connected to DB successfully."));
                // console.log(colors.blue("Setting up associations..."));
                // setupAssociations();
                // console.log(colors.green("Associations are set up."));
                // console.log(colors.blue("Syncing Sequelize..."));
                // await sequelize.sync({force: true});
                // console.log(colors.green("Sequelize has been synced."));
                // console.log(colors.blue("Syncing Admin model..."));
                // await Admin.sync({ force: true });
                // console.log(colors.green("Admin model has been synced."));
  console.log(colors.bold.white(`Server is running on port ${PORT}`));
});
