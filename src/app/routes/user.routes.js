const express = require("express");
const auth = require("../middlewares/auth");

const users = require("../controllers/user.controller");

const router = new express.Router();

//routes start here
router.post("/users", users.addUser);

router.post("/users/login", users.loginUser);

router.post("/users/logout", auth, users.logoutUser);

router.post("/users/logoutAll", auth, users.logoutAllUser);

router.get("/users/me", auth, users.getUser);

router.patch("/users/me", auth, users.updateUser);

router.delete("/users/me", auth, users.deleteUser);

module.exports = router;
