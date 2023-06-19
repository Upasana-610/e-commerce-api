const Stripe = require("stripe");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const factory = require("./handlerFactory");
const webhook = process.env.WEBHOOK_SECRET;

const cartEmpty = async (userid) => {
  try {
    await User.findByIdAndUpdate(userid, {
      $set: { cart: [] },
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.getCheckoutSession = catchAsync(async (req, res) => {
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.pName,

          description: item.selected,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.product.pPrice * 148,
      },
      quantity: item.qty,
    };
  });

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(
        req.body.cartItems.map((item) => {
          return {
            productId: item.product.id,
            size: item.selected,
            qty: item.qty,
          };
        })
      ),
    },
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["IN", "US"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "inr",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "inr",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${req.body.clienturl}/`,
    cancel_url: `${req.body.clienturl}/cart`,
  });

  res.send({ url: session.url });
});

const createBookingCheckout = async (data, customer) => {
  console.log(customer.metadata.userId);
  const product = JSON.parse(customer.metadata.cart).map((item) => item);
  const user = (await User.findById(customer.metadata.userId))._id;
  console.log(user, "hello");
  const total_price = data.amount_subtotal / 100;

  await Booking.create({ product, user, total_price });
  await cartEmpty(customer.metadata.userId);
};

// Stripe webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;

// whsec_a996c8bf2107363ef73004abbebe191fde315140a7496bc1b3eb3d9527946f76

// whsec_7rLE5ZR2yOzweJ7cGhIoWnsFfMWBNeiY

endpointSecret = webhook;

exports.webhookCreator = (req, res) => {
  console.log("entered");

  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook-Verified");
    } catch (err) {
      console.log(`Webhook Roar Error: ${err.message}`);
      res.status(400).send(`Webhook Roar Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
    console.log(eventType);
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createBookingCheckout(data, customer);
        console.log(customer);
        console.log("data:", data);
      })
      .catch((err) => console.log(err.message));
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

exports.getBooking = factory.getOne(Booking);

exports.getMyOrder = catchAsync(async (req, res, next) => {
  console.log(req.user);
  let orders;
  orders = await Booking.find({ user: req.user.id });
  // if (popOptions) query = query.populate(popOptions);

  if (!orders) {
    return next(new AppError("No Order Made", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      length: orders.length,
      data: orders,
    },
  });
});
