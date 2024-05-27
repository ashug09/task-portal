import React, { useEffect, useState } from "react";
import Image from "next/image";
import tick from "../images/tick.gif";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
const PaymentSuccessPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [payment_intent, setPaymentIntent] = useState(null);
  const [confirmPayment, setConfirmPayment] = useState(false);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      }
    });
    setPaymentIntent(router.query.payment_intent);
    if (payment_intent) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BE_URI}/v1/payment_intents/${payment_intent}`
        )
        .then((res) => {
          res.data.clientData && user
            ? axios
                .post(
                  `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/updatetopupbalanceinc`,
                  {
                    email: user?.email,
                    topUpBalance: res.data.clientData?.amount / 100,
                  }
                )
                .then((response) => {
                  // Handle success response here
                  toast.success("Top Up Successful");
                  setConfirmPayment(true);
                })
                .catch((error) => {
                  toast.error("Something went wrong Check Logs");
                  console.error("Error:", error);
                  // Handle error response here
                })
            : null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [payment_intent, router, user]);

  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      router.push("/profile/payment");
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {confirmPayment ? (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md">
          <Image
            src={tick}
            width={50}
            height={50}
            className="mx-auto"
            alt="tick gif"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-center">
            Payment Successful
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Thank you for your purchase!
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Continue Exploring
            </Link>
          </div>
          <p>
            redirecting to payment profil page in{" "}
            <span className="text-blue-500">
              {" "}
              <Countdown date={Date.now() + 5000} renderer={renderer} />
            </span>{" "}
            seconds.....
          </p>
        </div>
      ) : (
        "Please wait while we confirm your payment...."
      )}
    </div>
  );
};

export default PaymentSuccessPage;
