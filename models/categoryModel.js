const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },
    cImage: {
      type: String,
    },

    // SubCategory: {
    //   type: String,
    // },
    // Image: String,
    subcategories: [
      {
        SubCategory: {
          type: String,
          // default: 'Point',
          // enum: ['Point']
        },
        // coordinates: [Number],
        // address: String,
        // description: String,
        // day: Number
        Image: String,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// categorySchema.index(
//   { SubCategory: 1, Image: 1 },
//   {
//     unique: true,
//     // partialFilterExpression: {
//     //   SubCategory: { $ne: null },
//     //   Image: { $ne: null },
//     // },
//   }
// );
categorySchema.index(
  { SubCategory: 1 },
  {
    unique: true,
    partialFilterExpression: {
      SubCategory: { $ne: null },
    },
  }
);
// categorySchema.index({ cName: 1 }, { unique: true });
// categorySchema.index({ cName: 1, cImage: 1 }, { unique: true });

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
