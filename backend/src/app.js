import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.static("public/temp"));
dotenv.config({
  path: "./.env",
});

app.get("/", (req, res) => {
  res.send("hello world");
});

//route configurations
import { taskRouter } from "./router/task.router.js";
import { userRouter } from "./router/user.route.js";
//route declaration
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/user", userRouter);

import fetch from "node-fetch";

//here we are creating a contact that is creating recipient in the razorpay by getting there details
app.use("/api/v1/contact", async (req, res) => {
  try {
    const apiKey = process.env.RAZORPAY_ID;
    const apiSecret = process.env.RAZORPAY_SECRET;

    const url = "https://api.razorpay.com/v1/contacts";

    const data = {
      name: "Shamsher Singh",
      email: "shamsher.kumar@example.com",
      contact: "9099090000",
      type: "employee",
      reference_id: "Acme Contact ID 12345",
      notes: {
        notes_key_1: "Tea, Earl Grey, Hot",
        notes_key_2: "Tea, Earl Grey… decaf.",
      },
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        res.status(200).send(data);
        id = data.id;
      })
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    console.log(error);
  }
});

//here we add the recipients account either with vpa(UPI) or actual bank details
app.use("/api/v1/account", (req, res) => {
  try {
    const url = "https://api.razorpay.com/v1/fund_accounts";

    const data = {
      account_type: "vpa",
      contact_id: "cont_Nqa7WgJY8KtXYx",
      vpa: {
        address: "gaurav.kumar@exampleupi",
      },
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_ID}:${process.env.RAZORPAY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => res.status(200).send(data))
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    console.log(error);
  }
});

//here actual payouts will happen
app.use("/api/v1/payout", (req, res) => {
  try {
    const apiKey = process.env.RAZORPAY_ID;
    const apiSecret = process.env.RAZORPAY_SECRET;

    const url = "https://api.razorpay.com/v1/payouts";

    const data = {
      account_number: "2323230086701953", //ye vo account hai jisse paise katne hai
      fund_account_id: "fa_NqahCdkoZLFqMR", //recipients account id jisme ki fund transfer honge (ye db me save karana hai)
      amount: 100,
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      queue_if_low_balance: true,
      reference_id: "Acme Transaction ID 12345",
      narration: "Acme Corp Fund Transfer",
      notes: {
        notes_key_1: "Tea, Earl Grey, Hot",
        notes_key_2: "Tea, Earl Grey… decaf.",
      },
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => res.status(200).send(data))
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    console.log(error);
  }
});

//ACCEPTING PAYMENTS
import { instance } from "./constant.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

app.use("/api/v1/orderid", async (req, res) => {
  try {
    var options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json(order);
      if (err) console.log("this is error: " + err);
    });
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/v1/payment/verify", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const valid = validatePaymentVerification(
      { order_id: orderCreationId, payment_id: razorpayPaymentId },
      razorpaySignature,
      process.env.RAZORPAY_SECRET
    );

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
    if (valid) {
      res.status(200).json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
    } else {
      res.status(400).send("verification invalid");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// STRIPE PAYMENT
// Importing necessary modules
import stripe from "stripe";

// Creating a Stripe instance with the test secret API key
const stripeClient = new stripe(process.env.STRIPE_SECRET);

//creating payment intent to make payments of custom amount values
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//getting client secret and sending it back to frontend to verify the payment and topping up the wallet balance
app.get("/v1/payment_intents/:id", async (req, res) => {
  try {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      req.params.id
    );
    res.json({ clientData: paymentIntent });
  } catch (error) {
    res.send({ error: error.message });
  }
});
export default app;
