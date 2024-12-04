const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("connected to db"))
    .catch((err) => {
      console.log("helllllp", err);
    });
}
module.exports = connectToDb;
