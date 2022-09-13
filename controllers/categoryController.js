const Category = require("./../models/categoryModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const Product = require("./../models/productModel");

exports.createCategory = factory.createOne(Category);

exports.getAllCategory = factory.getAll(Category);

exports.getCategory = catchAsync(async (req, res, next) => {
  console.log("first");
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

exports.getCategoryId = catchAsync(async (req, res, next) => {
  console.log("first1");
  let category = req.query.categoryid;
  let subcategory = req.query.subcategoryid;
  let data = [],
    data2 = [];
  console.log(category, subcategory);
  data = await Category.find({ cName: category });
  if (category === "Tshirts" || (category === "Shirts" && subcategory !== ""))
    data2 = await Category.aggregate([
      { $unwind: "$subcategories" },
      { $match: { "subcategories.SubCategory": subcategory } },
    ]);
  res.status(200).json({
    status: "success",
    categoryId: data.length !== 0 ? data[0]._id : "",
    subcategoryId: data2.length !== 0 ? data2[0].subcategories._id : "",
  });
});
