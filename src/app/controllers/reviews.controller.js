const Reviews = require("../models/reviews/reviews.model");
const Restaurant = require("../models/restaurant/restaurant.model");
const logger = require("../utils/logger");
const sendRabbitMQ = require("../publisher");

exports.addReview = async (req, res, next) => {
  const reviews = new Reviews({ ...req.body, customer_id: req.user._id });
  const { restaurantId } = req.params;
  const queue_name = "rating_reviews_update";
  try {
    await reviews.save();
    Restaurant.findOneAndUpdate(
      { business_id: restaurantId },
      { customerReviews: reviews._id },
      { upsert: true, new: true, useFindAndModify: false },
      (err, results) => {
        console.log("resultssss", results);
        reviews.save();
        res
          .status(201)
          .json({ message: "Review Added Successfully", review: reviews });
      }
    );
    sendRabbitMQ(queue_name, reviews);
  } catch (error) {
    console.log("errrorr", error);
    logger.error(
      `Something went wrong in adding review ...Error: ${error.toString()} `
    );
    next(error);
  }
};
exports.getReviewsByRestaurantId = async (req, res, next) => {
  const { restaurantId } = req.params;
  const { limit, skip } = parseInt(req.query);
  const reviewsCount = await Reviews.countDocuments();
  const totalPages = Math.ceil(reviewsCount / limit);
  const currentPage = Math.ceil(reviewsCount % skip);
  Reviews.findOne({ business_id: restaurantId })
    .populate({
      path: "",
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
      error.statusCode = 400;
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

exports.updateReviews = async (req, res, next) => {
  const { restaurantId } = req.params;
  const body = req.body;
  const review = await Reviews.findOne({ business_id: restaurantId });
  if (!review) {
    return res
      .status(404)
      .json({ message: "Resource Not found!", status: "failed" });
  }

  Reviews.findOneAndUpdate({ business_id: restaurantId }, body)
    .then((result) => {
      res.status(200).json({
        message: "Reviews updated successfully",
        status: "success",
        data: result,
      });
    })
    .catch((error) => {
      logger.error(
        `Error in Update reviews controller function : ${error.toString()}`
      );
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
