const User = require("../models/user/user.model");
const client = require("../db/postgress");
const logger = require("../utils/logger");

exports.addNewOrder = async (req, res, next) => {
  const {
    orderId,
    orderTotal,
    orderItems,
    restaurantId,
    restaurant_name,
    customer_id,
  } = req.body;

  //inserted data into orders table
  const query = {
    text: "INSERT INTO orders(orderId, orderTotal,orderItems,restaurantId, restaurant_name,customer_id) VALUES($1,$2,$3,$4,$5,$6)",
    values: [
      orderId,
      orderTotal,
      orderItems,
      restaurantId,
      restaurant_name,
      customer_id,
    ],
  };

  client
    .query(query)
    .then((results) => {
      console.log("results......", results);
      res.status(201).json({ data: results.rows[0] });
    })
    .catch((err) => {
      logger.error(
        `Error while adding new order at addNewOrder... Error: ${err.toString()}`
      );
      console.log("orderee", err);
      next(err);
    });
};
exports.getOrderById = async (req, res, next) => {
  const { userId } = req.params;
  const { limit, skip } = parseInt(req.query);
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId],
  };
  client
    .query(query)
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      logger.error(`Unable to get the order details ERROR: ${err.toString()}`);
      next(err);
    });
};
exports.updateOrder = async (req, res, next) => {
  const { restaurantId, orderItems, orderTotal } = req.body;
  const { orderId } = req.params;
  const query = {
    text: "UPDATE orders SET restaurantId = $1, orderItems = $2 ordertTotal=3 WHERE orderId = $4",
    values: [restaurantId, orderItems, orderTotal, orderId],
  };
  const updates = Object.keys(req.body);
  const allowedUpdates = ["restaurantId", "orderItems", "orderTotal"];
  const isAllowedUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isAllowedUpdate || !orderId) {
    return res.status(400).json({ message: "Invalid update request" });
  }
  client
    .query(query)
    .then((result) => {
      res.status(200).json({
        message: "order details updated successfully for user",
        data: result.rows,
      });
    })
    .catch((err) => {
      logger.info(
        `There has been a problem in updating order: Error: ${err.toString()}`
      );
      next(err);
    });
};
exports.deleteOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const query = {
    text: "DELETE FROM orders WHERE id = $1",
    values: [orderId],
  };
  if (!orderId) {
    res.status(400).json({ message: "OrderId required!" });
  }
  client
    .query(query)
    .then((result) => {
      res
        .status(200)
        .json({ message: "Order Details deleted succesfully", id: orderId });
    })
    .catch((err) => {
      logger.error(`Unable to delete order details,Error: ${err.toString()}`);
      next(err);
    });
};
