import express from "express";
const router = express.Router();
import {
  getCountries,
  getCountryById,
  getCountryByCode,
} from "../controllers/countryController.js";

router.get("/", getCountries);
router.get("/:id", getCountryById);
router.get("/code/:code", getCountryByCode);

export default router;
