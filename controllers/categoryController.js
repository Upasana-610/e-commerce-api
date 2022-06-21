const Category = require("./../models/categoryModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const Product = require("./../models/productModel");

exports.createCategory = factory.createOne(Category);

exports.getAllCategory = factory.getAll(Category);

exports.getCategory = catchAsync(async (req, res, next) => {
  let query = req.params.category;
  let data;
  let products;
  if (
    query === "Tshirts" ||
    query === "CoOrds" ||
    query === "BottomWear" ||
    query === "Sweaters" ||
    query === "Jackets" ||
    query === "Shirts"
  ) {
    data = await Category.find({ cName: query });
    products = await Product.find({ pCategory: data[0]._id });
  } else {
    data = await Category.aggregate([
      { $unwind: "$subcategories" },
      { $match: { "subcategories.SubCategory": query } },
    ]);
    let id = data[0].subcategories._id;
    products = await Product.find({ pSubcategory: id });
  }

  res.status(200).json({
    status: "success",
    products: products,
    category: data,
  });
});

// exports.getSubCategory = catchAsync(async (req, res, next) => {
//   let query = req.params.Subcategory;
//   console.log(query);
//   const data = await Category.find({
//     subcategories: { $elemMatch: { SubCategory: query } },
//   }).pretty();
//   const products = await Product.find({});
//   console.log(products.length);
//   res.status(200).json({
//     status: "success",
//     data: data,
//   });
// });

// [{pCategory:ObjectId('6220d34727aacc4d306a406e')},{pCategory:ObjectId('6220d34727aacc4d306a4070')},{pCategory:ObjectId('6220d34727aacc4d306a406f')},{pCategory:ObjectId('6220d34727aacc4d306a406d')},{pCategory:ObjectId('6220d34727aacc4d306a4071')},{pCategory:ObjectId('6220d34727aacc4d306a4076')}]
