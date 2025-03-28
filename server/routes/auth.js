const express = require("express");
const passport = require("passport");
const { getProfile } = require("../controllers/user");
const verifyJWT = require("../middleware/auth");

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
    res.redirect("http://localhost:5173/dashboard/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("http://localhost:5173/login");
    });
  });
});

router.get(
  "/home",

  (req, res) => {
    res.redirect("http://localhost:5173/dashboard/home");
  }
);

router.get(
  "/user",

  getProfile
);

module.exports = router;
