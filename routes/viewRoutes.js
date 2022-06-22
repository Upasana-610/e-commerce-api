const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router({ mergeParams: true });

router.route("/").get(viewController.view);
module.exports = router;
