const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../user/user.js");

const RatingSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "This filed is required"],
    ref: User,
  },
  ratingDescription: {
    type: String,
    required: [true, "This field is required"],
  },
  ratingLevel: {
    type: Number,
    required: [true, "This field is required"],
  },
  ratingDate: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
