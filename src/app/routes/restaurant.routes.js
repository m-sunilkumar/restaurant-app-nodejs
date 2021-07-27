const express = require("express");
const Restaurants = require("../controllers/restaurants.controller");
// const auth = require("../middleware/auth");
// const multer = require("multer");
// const sharp = require("sharp");

const router = new express.Router();

router.post("/restaurants", Restaurants.addRestaurant);

router.get("/restaurants", Restaurants.findAllRestaurants);

module.exports = router;
