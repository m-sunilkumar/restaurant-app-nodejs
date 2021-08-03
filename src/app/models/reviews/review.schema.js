const mongoose = require("mongoose");
const validator = require("validator");
const review = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ratings: {
    type: Number,
    validate(value) {
      if (!validator.isNumeric && value <= 5) {
        throw new mongoose.Error(
          "ratings must be number and should be less than or equal to 5"
        );
      }
    },
  },
});

module.exports = review;
