const express = require("express");
const navAdController = require("./../controllers/navAdController");

const router = express.Router();
router
  .route("/")
  .get(navAdController.getAd)
  .post(navAdController.insertAdd);

module.exports = router;
