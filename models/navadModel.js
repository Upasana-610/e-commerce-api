const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  ad: {
    type: String,
    required: [true, "Ad cannot be empty"],
    trim: true,
    unique: [true, "ad already exist"],
  },
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
