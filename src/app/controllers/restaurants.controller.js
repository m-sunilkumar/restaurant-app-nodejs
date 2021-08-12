const Restaurant = require("../models/restaurant/restaurant.model");
const BadRequestError = require("../utils/errorController");
const logger = require("../utils/logger");

exports.findAllRestaurants = async (req, res) => {
  const totalPage = 10;
  const { page = 1, limit = 5 } = req.query;
  const offset = parseInt((page - 1) * limit);
  const restaurantCollectionCount = await Restaurant.count();
  const totalPages = Math.ceil(restaurantCollectionCount / limit);
  const currentPage = Math.ceil(restaurantCollectionCount % offset);
  Restaurant.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()
    .then((rests) => {
      logger.info(`Fetched all restaurant data`);
      res.status(200).send({
        data: rests,
        paging: {
          page: currentPage,
          tolalPages: totalPages,
        },
      });
    })
    .catch((err) => {
      next(
        new BadRequestError(
          `${err.message}` ||
            "Some error occurred while retrieving restaurants."
        )
      );
    });
};

exports.findRestaurantsByQuery = (req, res, next) => {
  let params = {};
  if (!req.query.dish) {
    params = req.query;
  } else {
    params["menu.item"] = req.query.dish;
  }
  const allowedQuery = ["dish", "name", "city", "address"];
  const queries = Object.keys(req.query);
  const isQueryValid = queries.every((query) =>
    allowedQuery.includes(query.toLowerCase())
  );
  if (!isQueryValid) {
    return res.status(400).json({ message: "Invalid search queries passed!" });
  }

  Restaurant.find({ ...params })
    .populate("customerReviews")
    .exec()
    .then((rest) => {
      res.status(200).send({ data: rest });
    })
    .catch((err) => {
      logger.error(
        `Unable to find the restaurant you are loooking into,  Here is the error statement ${err.toString()}`
      );
      err.statusCode = 500;
      next(err);
    });
};

exports.addRestaurant = async (req, res, next) => {
  const restaurantData = new Restaurant(req.body);
  try {
    await restaurantData.save();
    res.status(201).send({ data: restaurantData });
  } catch (error) {
    // res.status(400).json({ error: error.toString() });
    error.statusCode = 400;
    logger.error(
      `Unable to add restaurant data,  Here is the error statement ${error.toString()}`
    );
    next(error);
  }
};

exports.updateRestaurant = async (req, res) => {
  const restId = req.params;
  const body = req.body;
  const restaurantData = await Restaurant.findOne({ business_id: restId });
  if (!restaurantData) {
    return res
      .status(404)
      .json({ status: "failed", message: "Resource not found" });
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "latitude",
    "longitude",
    "address",
    "catagories",
    "name",
    "address",
    "city",
    "menu",
    "is_open",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid update request, Please check the fields and try again",
    });
  }
  try {
    Restaurant.findOneAndUpdate({ business_id: restId }, body).then(
      (result) => {
        res.status(200).json({
          id: restId,
          data: result,
          message: "Restaurant details updated successfully",
        });
      }
    );
  } catch (error) {
    logger.error(
      `There is a error in uopdating restaurant data.  ERROR: ${error.toString()}`
    );
    error.statusCode = 400;
    next(error);
  }
};
exports.deleteRestaurant = async (req, res, next) => {
  const restId = req.params.id;

  try {
    const restauratData = await Restaurant.findOneAndDelete({
      business_id: restId,
    });
    if (!restauratData) {
      res.status(404).json({ message: "Requested resource not found!" });
      return;
    }

    res.status(200).send({
      message: "Restaurant Record Deleted Successfully",
      id: restId,
    });
  } catch (err) {
    err.statusCode = 500;
    logger.error(
      `Unable to delete restaurant data,  Here is the error statement ${err.toString()}`
    );
    next(err);
  }
};
