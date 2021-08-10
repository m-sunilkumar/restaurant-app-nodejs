// susbcribe from same  topic

queue_name = "rating_reviews_update";

// Consumer
function consumer(conn) {
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(queue_name);
    ch.consume(queue_name, function (msg) {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(content);
        const reviews = JSON.parse(content);
        console.log("received ", reviews);
        ch.ack(msg);
      }
    });
  }
  var ok = conn.createChannel(on_open);
}

require("amqplib/callback_api").connect(
  process.env.CLOUDAMPQ_URL,
  function (err, conn) {
    if (err != null) console.log("errr....", err);
    consumer(conn);
  }
);
