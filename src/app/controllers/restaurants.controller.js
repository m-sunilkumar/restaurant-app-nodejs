const Restaurant = require("../models/restaurant.model");
const { BadRequestError } = require("../utils/errorController");

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
      res.status(200).send({
        data: rests,
        paging: {
          page: currentPage,
          tolalPages: totalPages,
        },
      });
    })
    .catch((err) => {
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while retrieving restaurants.",
      // });
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

  Restaurant.find({ ...params })
    .then((rest) => {
      res.status(200).send({ data: rest });
    })
    .catch((err) => {
      // res
      //   .status(500)
      //   .json({ message: "Unable to get the restaurant you are looking" });
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
    next(err);
  }
};
