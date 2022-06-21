const AdImg = require("./../models/SlidingAdImgModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");

exports.insertAdd = factory.createOne(AdImg);

exports.getAd = factory.getAll(AdImg);
