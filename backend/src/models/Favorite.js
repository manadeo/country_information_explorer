import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Please provide a country ID to favorite"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
