const express = require("express");
const restaurantRoutes = require("./routes/restaurant.routes");

require("./db/mongoose");

const app = express();
app.use(express.json());
app.use(restaurantRoutes);

module.exports = app;
