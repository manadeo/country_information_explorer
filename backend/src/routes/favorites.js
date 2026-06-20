import express from "express";
const router = express.Router();
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:countryId", removeFavorite);

export default router;
