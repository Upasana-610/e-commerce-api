const Stripe = require("stripe");
const catchAsync = require("../utils/catchAsync");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
        unit_amount: item.product.pPrice * 100,
      },
      quantity: item.qty,
    };
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
    line_items,
    mode: "payment",
    success_url: `${req.body.clienturl}/`,
    cancel_url: `${req.body.clienturl}/cart`,
  });

  res.send({ url: session.url });
});
