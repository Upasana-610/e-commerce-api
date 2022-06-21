const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pColor: {
      type: String,
    },
    pSize: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
          message: "Only XS, S, M, L, XL, 2XL, 3XL sizes are allowed ",
        },
      },
    ],
    pDescription: {
      type: String,
      required: true,
    },
    pOccasion: {
      type: String,
      required: true,
    },
    pFabric: {
      type: String,
      required: true,
    },
    pFit: {
      type: String,
      required: true,
    },
    pModelSize: {
      type: String,
      required: true,
    },
    pModelHeight: {
      type: String,
      required: true,
    },
    pWash: {
      type: String,
      required: true,
    },
    pEndLine: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      // required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    pCategory: {
      type: ObjectId,
      ref: "categories",
    },
    pSubcategory: {
      type: ObjectId,

      ref: "categories",
      foreignField: "subcategories._id",
      localField: "_id",
    },

    pImages: {
      type: [String],
      required: true,
    },
    pOffer: {
      type: Number,
      default: null,
      validate: {
        validator: function(val) {
          return val < this.pPrice && val < 100;
        },
        message:
          "Discount price ({VALUE}) should be below regular price and should be less that 100%",
      },
    },

    pStatus: {
      type: String,
      required: true,
    },
    pNewArrival: {
      type: Boolean,
      default: false,
    },
    pTopSellers: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
