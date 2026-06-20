import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import countryRoutes from "./routes/countries.js";
import favoriteRoutes from "./routes/favorites.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/countries", countryRoutes);
app.use("/api/favorites", favoriteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
});
