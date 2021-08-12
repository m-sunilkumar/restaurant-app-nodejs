const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const restaurantSchema = new mongoose.Schema({
  business_id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },
  longitude: {
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if (typeof value == "string") {
        throw new Error("latitude must be a number");
      }
    },
  },
  latitude: {
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if (typeof value == "string") {
        throw new Error("longitude must be a number");
      }
    },
  },
  menu: [
    {
      item: {
        type: String,
      },
      catogory: {
        type: String,
      },
    },
  ],
  city: {
    type: String,
    required: true,
    trim: true,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Ratings must be above 0 and below 5");
      }
    },
  },
  catagories: [
    {
      type: String,
    },
  ],
  is_open: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: Buffer,
  },
  customerReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
