// publish and susbcribe happens over a channel/queue
//  queue: rating_reviews_update
const { getRestaurantReviews } = require("./services/reviews-managment");
queue_name = "rating_reviews_update";

// example code to publish using  a timer
// in your project, whenever new rating/update posted, you need to publish
// do avg rating/aggergated calculation and publish avg rating

async function publisher(conn) {
  let response = {};
  getRestaurantReviews(1)
    .then((res) => {
      response.allRatingsCount = res.data.length;
      const allRatings = [];
      res.data.map((rating) => allRatings.push(rating.ratings));
      const avgRating =
        allRatings.reduce((a, b) => a + b) / res.data.length.toFixed(2);

      response.avgRating = avgRating;
      return response;
    })
    .catch((err) => {
      response.err = err.toString();
      return response;
    });

  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(queue_name);
    ch.sendToQueue(queue_name, Buffer.from(JSON.stringify(response)));
  }
  conn.createChannel(on_open);
}

require("amqplib/callback_api").connect(
  process.env.CLOUDAMPQ_URL,
  function (err, conn) {
    if (err != null) console.log("errr....", err);
    console.log("Connected to cloudampq....");
    publisher(conn);
  }
);
