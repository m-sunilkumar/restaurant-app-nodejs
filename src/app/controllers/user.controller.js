const logger = require("../utils/logger");
const User = require("../models/user.model");
const { BadRequestError } = require("../utils/errorController");

exports.addUser = async (req, res, next) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    logger.info(`new User Created with Email ${user.email}`);
    res.status(201).send({ user, token });
  } catch (err) {
    err.statusCode = 400;
    logger.error(err);
    next(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
    next(new BadRequestError("Unable to login!, Please try again."));
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.logoutAllUser = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.getUser = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(new BadRequestError("Unknown error occured while fetching the user"));
  }
};
exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    // res.status(400).send(e);
    next(new BadRequestError("Unknown error occured while updating the user"));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    // sendCancelationEmail(user.email, user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};
