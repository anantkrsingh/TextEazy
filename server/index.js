const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./passport");

const authRoutes = require("./routes/auth");
const docRoutes = require("./routes/doc");
const { connectMongo } = require("./db");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

async function init() {
  await connectMongo();

  app.use(
    cors({
      origin: ["http://localhost:5173", "https://texteazy.vercel.app"],
      credentials: true,
    })
  );
  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: MongoStore.create({ mongoUrl: process.env.MONGOOSE_URI }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/api/auth", authRoutes);
  app.use("/api/docs", docRoutes);

  app.get("/", (req, res) => {
    res.send("Server is running");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
init();
