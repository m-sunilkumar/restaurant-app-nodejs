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
router.patch(
  "/reviews-and-ratings/:restaurantId",
  ReviewsController.updateReviews
);
router.delete(
  "/reviews-and-ratings/:restaurantId",
  ReviewsController.deleteReview
);

module.exports = router;
