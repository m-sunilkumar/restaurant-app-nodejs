const mongoose = require("mongoose");
let DB_URL = process.env.MONGODB_URL;
if (process.env.NODE_ENV == "test") {
  DB_URL = process.env.MONGODB_URL_TEST;
}

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", DB_URL);
});

db.on("error", (err) => {
  console.error("connection error:", DB_URL);
});
