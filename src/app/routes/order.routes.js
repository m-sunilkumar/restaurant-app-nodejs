const express = require("express");
const User = require("../models/user/user.model");
const auth = require("../middlewares/auth");
const OrderController = require("../controllers/order.controller");

const router = new express.Router();

router.post("/order/new", auth, OrderController.addNewOrder);
router.patch("/order/:orderId", auth, OrderController.updateOrder);

router.get("/order/:orderId", auth, OrderController.getOrderById);

router.post("/order/:orderId", auth, OrderController.updateOrder);

router.delete("/order/delete/:orderId", auth, OrderController.deleteOrder);
router.delete("/clear-table-data", OrderController.dropTable);

module.exports = router;
