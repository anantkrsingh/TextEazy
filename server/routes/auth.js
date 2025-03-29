const express = require("express");
const passport = require("passport");
const { getProfile } = require("../controllers/user");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/home`);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });
});

router.get(
  "/home",

  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/home`);
  }
);

router.get(
  "/user",

  getProfile
);

module.exports = router;
