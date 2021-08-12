const mongoose = require("mongoose");
const User = require("../user/user.model");
const Item = require("./item.schema");
const Restaurant = require("../restaurant/restaurant.model");
const Review = require("./review.schema");

const reviewsAndRatings = new mongoose.Schema({
  id: {
    type: String,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  business_id: {
    type: mongoose.Schema.Types.String,
    ref: "Restaurant",
  },
  restaurantName: {
    type: String,
    required: true,
  },
  review: Review,

  date: {
    type: String || Number,
    required: true,
  },
});

const Reviews = mongoose.model("Reviews", reviewsAndRatings);
module.exports = Reviews;
