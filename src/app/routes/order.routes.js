const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");

const router = new express.Router();

router.get("/", (req, res) => {
  // const body=req.body;
  res.send({ message: "hello there!" });
});

module.exports = router;
