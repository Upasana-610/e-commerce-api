const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const SlidingAdRouter = require("./routes/SlidingAdImgRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const UserRouter = require("./routes/userRoutes");
const ViewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const bookingController = require("./controllers/bookingController");
const app = express();

app.enable("trust proxy");

// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));
app.use(fileUpload());
app.use(cors());

app.options("*", cors());

// app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  bookingController.webhookCreator
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

// 3) ROUTES
app.use("/", ViewRouter);

app.use("/api/v1/adimg", SlidingAdRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/bookings", bookingRouter);

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);
app.use("/api/v1/users", UserRouter);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// app.use

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
