const Restaurant = require("../models/restaurant.model");

exports.findAllRestaurants = (req, res) => {
  Restaurant.find()
    .then((rests) => {
      res.status(200).send({ data: rests });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving restaurants.",
      });
    });
};

exports.findRestaurantsByQuery = (req, res) => {
  // const { } = req.query.params;
  if(req.query.name){
    
  }

  Restaurant.findOne(query)
    .then((rest) => {
      res.status(200).send({ data: rest });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Unable to get the restaurant you are looking" });
    });
};

exports.addRestaurant = async (req, res) => {
  const restaurantData = new Restaurant(req.body);
  try {
    await restaurantData.save();
    res.status(201).send({ data: restaurantData });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

exports.deleteRestaurant = async (req, res) => {
  const restId = req.id;
  try {
    await Restaurant.findOneAndDelete({ business_id: restId });
    res
      .status(200)
      .json({ message: "Restaurant Record Deleted Successfully", id: restId });
  } catch (err) {
    res.status(500).send({ message: "Unable to delete restaurant record" });
  }
};
