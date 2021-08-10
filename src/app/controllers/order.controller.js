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
  //create orders table if not exists
  client.query(
    `CREATE TABLE  IF NOT EXISTS Orders(
     orderId          SERIAL PRIMARY KEY,
     customer_id      VARCHAR(50),
     restaurantId     VARCHAR(50),
     restaurant_name   VARCHAR(30),
     orderTotal       INTEGER,
     orderItems       JSON ARRAY
   )`,
    (err, res) => {
      if (err) {
        console.error("error in creating table", err);
        return;
      }
      console.log("Table is successfully created");
      // client.end();
    }
  );

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

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $push: { orders: req.body } },
    { upsert: true, useFindAndModify: false },
    (err, result) => {
      if (err)
        return res.status(400).json({
          status: "failed",
          message: "Unable to place order due to database failure",
        });
      result.save();
    }
  );

  client
    .query(query)
    .then((results) => {
      res
        .status(201)
        .json({ data: results.rows[0], message: "order successfully placed!" });
    })
    .catch((err) => {
      logger.error(
        `Error while adding new order at addNewOrder... Error: ${err.toString()}`
      );
      next(err);
    });
};
exports.getOrderById = async (req, res, next) => {
  const { orderId } = req.params;
  const { limit, skip } = parseInt(req.query);
  const query = {
    text: "SELECT * FROM orders WHERE orderId = $1",
    values: [orderId],
  };
  if (!orderId) {
    return res.status(404).send({
      message: "Please provide orderId in params to get the details",
    });
  }
  client
    .query(query)
    .then((result) => {
      res.status(200).json({
        data: result.rows[0],
        message: `Oder Details fetched successfully for id ${orderId}`,
      });
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
    text: "UPDATE orders SET restaurantId = $1, orderItems = $2, orderTotal=$3  WHERE orderId = $4",
    values: [restaurantId, orderItems, orderTotal, orderId],
  };
  const updates = Object.keys(req.body);
  const allowedUpdates = ["restaurantId", "orderItems", "orderTotal"];
  const isAllowedUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isAllowedUpdate || !orderId) {
    return res.status(404).json({ message: "Invalid update request" });
  }
  client
    .query(query)
    .then((result) => {
      res.status(200).json({
        message: `order details updated successfully for user with orderId: ${orderId}`,
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
  console.log("params", params);
  const query = {
    text: "DELETE FROM orders WHERE id = $1",
    values: [orderId],
  };
  if (!orderId) {
    res.status(404).json({ message: "OrderId required!" });
  }
  client
    .query(query)
    .then((result) => {
      res
        .status(200)
        .json({ message: "Order details deleted succesfully", id: orderId });
    })
    .catch((err) => {
      logger.error(`Unable to delete order details,Error: ${err.toString()}`);
      next(err);
    });
};

exports.dropTable = (table) => {
  const query = {
    text: `DROP TABLE ${table}`,
    values: [],
  };
  client
    .query(query)
    .then((result) => {
      res.status(200).json({ message: "Table data deleted successfully" });
    })
    .catch((err) => {
      logger.error("Unable to drop a table");
      next(err);
    });
};
