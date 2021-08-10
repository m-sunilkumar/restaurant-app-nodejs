const axios = require("axios");

const getRestaurantReviews = async (id) =>
  axios.get(`${process.env.HOST}/reviews-and-ratings/${id}`);
module.exports = { getRestaurantReviews };
