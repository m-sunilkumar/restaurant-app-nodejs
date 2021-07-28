const express = require("express");
const restaurantRoutes = require("./routes/restaurant.routes");
const userRoutes=require("../app/routes/user.routes")

require("./db/mongoose");

const app = express();
app.use(express.json());
app.use(restaurantRoutes);
app.use(userRoutes)

module.exports = app;
