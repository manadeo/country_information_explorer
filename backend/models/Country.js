const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a country name"],
      unique: true,
      trim: true,
    },
    officialName: {
      type: String,
      trim: true,
    },
    cca2: {
      type: String,
      required: [true, "Please add the 2-letter country code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    cca3: {
      type: String,
      required: [true, "Please add the 3-letter country code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    flag: {
      type: String,
    },
    flagSvg: {
      type: String,
    },
    capital: {
      type: String,
      trim: true,
    },
    population: {
      type: Number,
      default: 0,
    },
    region: {
      type: String,
      trim: true,
    },
    subregion: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    currencies: [
      {
        code: { type: String, uppercase: true, trim: true },
        name: { type: String, trim: true },
        symbol: { type: String, trim: true },
      },
    ],
    borders: {
      type: [String],
      default: [],
    },
    area: {
      type: Number,
      default: 0,
    },
    mapsGoogle: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Country", countrySchema);
