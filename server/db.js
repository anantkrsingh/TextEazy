const mongoose = require("mongoose");
 async function connectMongo() {
   mongoose
    .connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongo) => {
      console.log("Connected to MongoDB");
      return mongoose;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
module.exports = { connectMongo };
