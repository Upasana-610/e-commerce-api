const express = require("express");
const categoryController = require("./../controllers/categoryController");

const router = express.Router();
router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);

//Can be used for products of both category and subcategory

router.route("/:category").get(categoryController.getCategory);
// router.route("subcategory/:Subcategory").get(categoryController.getSubCategory);
module.exports = router;
