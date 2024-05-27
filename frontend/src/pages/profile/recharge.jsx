import Cryptr from "cryptr";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import toast from "react-hot-toast";

const RechargePage = () => {
  const router = useRouter();
  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPTR, {
    encoding: "base64",
    pbkdf2Iterations: 1000,
    saltLength: 10,
  });
  const [amount, setAmount] = useState("");
  const [formData, setFormData] = useState(new FormData());

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Form submitted with amount:", formData.get("amount"));
    // Handle form submission here, e.g., send data to backend
    if (formData.get("amount") < 20) {
      toast.error("Please top up more than 20");
      return;
    }
    const encrypted = handleCrytion(formData.get("amount"));
    router.push({
      pathname: "/paymentGateway/paymentGateway",
      query: { amt: encrypted },
    });
  };
  const handleCrytion = (cost) => {
    const encrypted = cryptr.encrypt(cost);
    return encrypted;
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    formData.set("amount", event.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Recharge</h2>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter Amount"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleAmountChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <Marquee className="my-5">
              <img
                src="https://asset.brandfetch.io/idhem73aId/id7B1VUknk.svg" // Replace with PayPal logo
                alt="visa"
                className="w-16 h-auto mx-5"
              />
              <img
                src="https://asset.brandfetch.io/idFw8DodCr/idXPHIrICR.svg" // Replace with PayPal logo
                alt="master"
                className="w-16 h-auto mx-5"
              />
              <img
                src="https://asset.brandfetch.io/idO-tKGZ90/id-9bfvFxK.svg" // Replace with PayPal logo
                alt="amazon pay"
                className="w-16 h-auto mx-5"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStHmAMjIA8UX8bcJrnQXG-KKCDk03Lqbr_jG2R_tlL7g&s" // Replace with PayPal logo
                alt="PayPal"
                className="w-16 h-auto mr-4"
              />
              <img
                src="https://asset.brandfetch.io/idWNFFMbfp/idtyjMtrZe.png" // Replace with PayPal logo
                alt="PayPal"
                className="w-16 h-auto mr-4"
              />
              <img
                src="https://asset.brandfetch.io/ide4lTCz-B/idJY2rk3za.svg" // Replace with PayPal logo
                alt="bank of america"
                className="w-20 h-auto mr-4"
              />
              <img
                src="https://asset.brandfetch.io/idudVYts5w/id9K3fd189.svg"
                alt="chase"
                className="w-16 h-auto mr-4"
              />
              <img
                src="https://asset.brandfetch.io/idaYeBHZgd/idCi8OKryB.png"
                alt="amex"
                className="w-10 h-auto mr-4"
              />
              {/* 2560px-Apple_Pay_logo.svg.png
              
        
              https://asset.brandfetch.io/idudVYts5w/id9K3fd189.svg
              https://asset.brandfetch.io/idaYeBHZgd/idCi8OKryB.png */}
            </Marquee>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default RechargePage;
