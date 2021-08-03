const logger = require("../utils/logger");
const User = require("../models/user/user.model");
const BadRequestError = require("../utils/errorController");

exports.addUser = async (req, res, next) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    logger.info(`new User Created`);
    res.status(201).send({ user, token });
  } catch (err) {
    err.statusCode = 400;
    logger.error(err);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    logger.error(
      `Error in loging in to the account ...Error : ${err.toString()}`
    );
    next(err);
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
  const allowedUpdates = [
    "name",
    "email",
    "password",
    "city",
    "address",
    "phone",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    logger.info(`user updated`);
    res.send(req.user);
  } catch (err) {
    logger.error(
      `There is a problem in updating the user Error: ${err.toString()}`
    );
    next(new BadRequestError(err));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    logger.error(
      `There is a problem in deleting the user...... Error: ${err.toString()}`
    );
    res.status(500).send();
  }
};
