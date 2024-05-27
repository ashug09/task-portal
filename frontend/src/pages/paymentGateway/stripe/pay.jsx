import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../../../CheckoutForm";
import Cryptr from "cryptr";
import { useRouter } from "next/router";
import { Message } from "primereact/message";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Pay() {
  const [clientSecret, setClientSecret] = useState("");
  const [newAmt, setNewAmt] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const { amt } = router.query;
    if (amt){
      const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPTR, {
        encoding: "base64",
        pbkdf2Iterations: 1000,
        saltLength: 10,
      });
      const decryptedAmt = cryptr.decrypt(amt);
      setNewAmt(decryptedAmt);
    }
    newAmt !== 0
      ? fetch(`${process.env.NEXT_PUBLIC_BE_URI}/api/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: newAmt }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret))
      : null;
  }, [router.query, newAmt]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="lg:mx-auto mx-10">
      <Message className="flex justify-center my-5" text={"amount to be processed $" + newAmt}/>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
