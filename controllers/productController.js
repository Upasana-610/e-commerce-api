const Product = require("./../models/productModel");
const categoryModel = require("./../models/categoryModel");
const catchAsync = require("./../utils/catchAsync");
const handleFactory = require("./handlerFactory");

exports.insertProduct = handleFactory.createOne(Product);

exports.getProduct = handleFactory.getOne(Product);

exports.getAllProducts = handleFactory.getAll(Product);

exports.getProducts = catchAsync(async (req, res, next) => {
  let query = req.params.product;
  const data = await Product.find(
    query === "newarrivals"
      ? { pNewArrival: true }
      : query === "topsellers"
      ? { pTopSellers: true }
      : ""
  );

  const data2 = await Product.find();
  res.status(200).json({
    status: "success",
    products: data,
  });
});

exports.updateProduct = handleFactory.updateOne(Product);
exports.deleteProduct = handleFactory.deleteOne(Product);

// exports.getProductByCategory = catchAsync(async (req, res, next) => {
//   let query = await Product.find({ pCategory: req.params.category });

//   //   if (popOptions) query = query.populate(popOptions);

//   const doc = await query;
//   console.log(doc);

//   if (!doc) {
//     return next(new AppError("No document found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: doc,
//     },
//   });
// });

// exports.getProductBySubCategory = catchAsync(async (req, res, next) => {
//   let query = await Product.find({ pSubcategory: req.params.subcategory });
//   //   if (popOptions) query = query.populate(popOptions);

//   const doc = await query;

//   if (!doc) {
//     return next(new AppError("No document found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: doc,
//     },
//   });
// });
