var pg = require("pg");
//or native libpq bindings
//var pg = require('pg').native

const credentials = {
  user: "sunilkumarmanjappa",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
};

var conString = process.env.PGSQL_CONNECTION_STRING;
var client = new pg.Client(credentials);
client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log("connected to postgresql on: ", result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    // await client.end();
  });
});

module.exports = client;
