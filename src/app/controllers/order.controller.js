const Reviews = require("../models/reviews/reviews.model");
const client = require("../db/postgress");
const logger = require("../utils/logger");

exports.addNewOrder = async (req, res, next) => {
  const { orderId, orderTotal, orderItems, restaurantId, restaurant_name } =
    req.body;

  client.query(
    "INSERT INTO order (orderId, orderTotal,orderItems,restaurantId, restaurant_name,customer_id) VALUES ($1,$2,$3,$4,$5,$6)",
    [
      orderId,
      orderTotal,
      orderItems,
      restaurantId,
      restaurant_name,
      customer_id,
    ],
    (err, result) => {
      if (err) {
        next(err);
      }
      console.log("results......", result);
      res.status(201).json({ data: result });
    }
  );
};
exports.getOrderById = async (req, res, next) => {
  const { restaurantId } = req.params;
  const { limit, skip } = parseInt(req.query);
};
exports.updateOrder = async (req, res, next) => {
  const { restaurantId, itemId } = req.params;
};
exports.deleteOrder = async (req, res, next) => {
  const { restaurantId } = req.params;
};
