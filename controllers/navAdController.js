const Ad = require("./../models/navadModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");

exports.insertAdd = factory.createOne(Ad);

exports.getAd = factory.getAll(Ad);
