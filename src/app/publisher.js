const amqp = require("amqplib/callback_api");

// publish and susbcribe happens over a channel/queue

const sendRabbitMQ = function sendRabbitMQ(queue_name, data) {
  amqp.connect(process.env.CLOUDAMPQ_URL, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    console.log("Connected to cloudampq....");
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = queue_name;

      channel.assertQueue(queue);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

      console.log(" [x] Sent %s", data);
    });
    setTimeout(function () {
      connection.close();
      //process.exit(0);
    }, 500);
  });
};
module.exports = sendRabbitMQ;

// module.exports=publisher
