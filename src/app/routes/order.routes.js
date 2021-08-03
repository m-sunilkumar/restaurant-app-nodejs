const express = require("express");
const User = require("../models/user/user.model");
const auth = require("../middlewares/auth");
const multer = require("multer");
const OrderController = require("../controllers/order.controller");

const router = new express.Router();

router.post("/order/new", OrderController.addNewOrder);

module.exports = router;
