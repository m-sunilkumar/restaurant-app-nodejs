const Reviews = require("../models/reviews/reviews.model");
const logger = require("../utils/logger");

exports.addReview = async (req, res, next) => {
  const reviews = new Reviews({ ...req.body, customer_id: req.user._id });

  try {
    await reviews.save();
    res
      .status(201)
      .json({ message: "Review Added Successfully", review: reviews });
  } catch (error) {
    logger.error(
      `Something wneet wrong in adding review ...Error: ${error.toString()} `
    );
    next(error);
  }
};
exports.getReviewsByRestaurantId = async (req, res, next) => {
  const { restaurantId } = req.params;
  const { limit, skip } = parseInt(req.query);
  const reviewsCount = await Reviews.count();
  const totalPages = Math.ceil(reviewsCount / limit);
  const currentPage = Math.ceil(reviewsCount % skip);
  Reviews.find({ business_id: restaurantId })
    .populate({
      path: "restaurant_reviews",
      options: {
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    })
    .then((result) => {
      res.status(200).send({
        data: result,
        paging: {
          total: reviewsCount,
          page: currentPage,
          pages: totalPages,
        },
      });
    })
    .catch((error) => {
      logger.error(
        `Something wneet wrong while fetching reviews for the selected restaurant ...Error: ${error.toString()} `
      );
      next(error);
    });
};
exports.getReviewbyItemId = async (req, res, next) => {
  const { restaurantId, itemId } = req.params;
  Reviews.find({ restaurantId, "items.rating": itemId })
    .then((result) => {
      res.status(200).send({ data: result });
    })
    .catch((error) => {
      logger.error(
        `Something wneet wrong while fetching reviews for the selected restaurant ...Error: ${error.toString()} `
      );
      next(error);
    });
};
exports.deleteReview = async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    Reviews.findOneAndDelete({ _id: restaurantId }).then((result) => {
      res.status(200).json({
        message: "Review has been deleted successfully",
        data: result,
      });
    });
  } catch (error) {
    logger.error(
      `There is a problem in deleting the review ...Error: ${error.toString()}`
    );
    next(error);
  }
};
