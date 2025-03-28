const express = require("express");
const {
  createDoc,
  updateDoc,
  removeDoc,
  getDocById,
  getDocsByUser,
} = require("../controllers/doc");
const verifyAuth = require("../middleware/auth");
const { saveToDrive } = require("../controllers/drive");

const router = express.Router();

router.post("/create", verifyAuth, createDoc);

router.put("/update/:id", updateDoc);

router.delete("/delete/:id", verifyAuth, removeDoc);
router.get("/", verifyAuth, getDocsByUser);
router.get("/:id", verifyAuth, getDocById);

router.post("/saveToDrive/:docId", verifyAuth, saveToDrive);
module.exports = router;
