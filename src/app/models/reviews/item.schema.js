const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  catogory: {
    type: String,
  },
  ratings: {
    type: Number,
    required: true,
  },
});
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
