const express = require("express");
const restaurantRoutes = require("./routes/restaurant.routes");
const userRoutes = require("../app/routes/user.routes");
const reviewsRoutes = require("../app/routes/reviews.routes");
const orderRoutes = require("../app/routes/order.routes");
const { errorHandler } = require("../app/middlewares/errors");

require("./db/mongoose");
require("./db/postgress");
require("./publisher");
require("./subscriber");

const app = express();
app.use(express.json());
app.use(restaurantRoutes);
app.use(userRoutes);
app.use(reviewsRoutes);
app.use(orderRoutes);
app.use(errorHandler);

module.exports = app;
