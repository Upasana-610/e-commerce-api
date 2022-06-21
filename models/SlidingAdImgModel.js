const mongoose = require("mongoose");

const adImgSchema = new mongoose.Schema({
  adImg: {
    type: String,
    required: [true, "AdImg cannot be empty"],
    unique: [true, "adImg already exist"],
  },
});

const AdImg = mongoose.model("AdImg", adImgSchema);

module.exports = AdImg;
