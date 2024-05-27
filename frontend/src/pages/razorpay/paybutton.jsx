// import logo from './logo.svg';
// import './App.css';

import axios from "axios";
import { useRouter } from "next/router";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Pay({amount}) {
  const router = useRouter();
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }
    console.log("this is response: ", res);

    const data = await fetch("${process.env.NEXT_PUBLIC_BE_URI}/api/v1/orderid", {
      method: "POST",
    }).then((t) => t.json());

    console.log(data);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const item = {
          orderCreationId: data.id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        await axios
          .post("${process.env.NEXT_PUBLIC_BE_URI}/api/v1/payment/verify", item)
          .then((res) => {
            console.log(res.data);
            if (res.status == 200) {
              router.push("/paymentSuccess");
            }
          })
          .catch((err) => console.log(err.data));
      },
      callback_url: "http://localhost:3000/",
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src="" className="App-logo" alt="logo" />
        <button onClick={displayRazorpay}>Pay now</button>
      </header>
    </div>
  );
}

export default Pay;
