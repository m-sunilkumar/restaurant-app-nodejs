const express = require("express");
const ReviewsController = require("../controllers/reviews.controller");
const auth = require("../middlewares/auth");
// const multer = require("multer");

const router = new express.Router();

router.post(
  "/reviews-and-ratings/:restaurantId",
  auth,
  ReviewsController.addReview
);
router.get(
  "/reviews-and-ratings/:restaurantId",
  ReviewsController.getReviewsByRestaurantId
);
router.get(
  "/reviews-and-ratings/:restaurantId/:itemId",
  ReviewsController.getReviewbyItemId
);
// router.delete("/restaurants/:restaurantId",Restaurants.deleteRestaurant)

module.exports = router;
