const express = require("express");
const AdImgController = require("./../controllers/SlidingAdImgController");

const router = express.Router();
router
  .route("/")
  .get(AdImgController.getAd)
  .post(AdImgController.insertAdd);

module.exports = router;
