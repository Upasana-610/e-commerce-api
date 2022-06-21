const express = require("express");
const productController = require("./../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.insertProduct);

router.route("/:product").get(productController.getProducts);

router
  .route("/single/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// router.route("/category/:category").get(productController.getProductByCategory);

// router
//   .route("/subcategory/:subcategory")
//   .get(productController.getProductBySubCategory);

module.exports = router;
