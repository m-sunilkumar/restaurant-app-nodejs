const express = require("express");
const restaurantRoutes = require("./routes/restaurant.routes");
const userRoutes = require("../app/routes/user.routes");
const { errorHandler } = require("../app/middlewares/errors");

require("./db/mongoose");

const app = express();
app.use(express.json());
app.use(restaurantRoutes);
app.use(userRoutes);
app.use(errorHandler);

module.exports = app;
