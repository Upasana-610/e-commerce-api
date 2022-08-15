const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authControllers");

const router = express.Router();

router.use(authController.protect);

router.post("/create-checkout-session", bookingController.getCheckoutSession);

module.exports = router;
