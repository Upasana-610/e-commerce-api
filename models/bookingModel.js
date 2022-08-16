const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  product: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Booking must belong to a Product!"],
      },
      size: {
        type: String,
        required: [true, "Product must have a size"],
      },
      qty: {
        type: Number,
        required: [true, "Product must have a size"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  total_price: {
    type: Number,
    require: [true, "Booking must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function(next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: ["_id", "name", "email"],
  }).populate({
    path: "product.productId",
    select: ["pName", "pImages", "pPrice"],
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
