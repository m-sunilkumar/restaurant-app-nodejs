const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', process.env.MONGODB_URL)
})

db.on('error', err => {
  console.error('connection error:', process.env.MONGODB_URL)
})