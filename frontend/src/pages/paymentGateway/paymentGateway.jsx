import Cryptr from "cryptr";
import { useRouter } from "next/router";
import Router from "next/router";
import { Message } from "primereact/message";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
export default function PaymentGateway() {
  const router = useRouter();
  const [amt1, setAmt1] = useState(0);
  const { amt } = router.query;
  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPTR, {
    encoding: "base64",
    pbkdf2Iterations: 1000,
    saltLength: 10,
  });
  useEffect(() => {
    if (amt == null || amt == undefined) {
      () => router.push("/");
    } else {
      const decryptedAmt = cryptr.decrypt(amt);
      setAmt1(decryptedAmt);
    }
  });

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>

          <Message
            text={"amount to be paid: $" + amt1}
            className="justify-center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perfect Money */}

            <div
              onClick={() =>
                router.push({
                  pathname: "/paymentGateway/perfectmoney/pay",
                  query: { amt: amt },
                })
              }
              className="flex items-center bg-gray-50 p-4 rounded-lg cursor-pointer"
            >
              <img
                src="https://asset.brandfetch.io/idXd3lPhGZ/idwoFe0cxb.png" // Replace with Perfect Money logo
                alt="Perfect Money"
                className="w-20 h-auto mr-4"
              />
              <span className="text-lg font-semibold">
                Pay with Perfect Money
              </span>
            </div>
            {/* Stripe */}
            <div
              onClick={() =>
                router.push({
                  pathname: "/paymentGateway/stripe/pay",
                  query: { amt: amt },
                })
              }
              className="flex items-center bg-gray-50 p-4 rounded-lg cursor-pointer"
            >
              <img
                src="https://asset.brandfetch.io/idxAg10C0L/idATb3amIw.svg" // Replace with Stripe logo
                alt="Stripe"
                className="w-20 h-auto mr-4"
              />
              <span className="text-lg font-semibold">Pay with Stripe</span>
            </div>
            {/* Payeer */}
            <div className="flex items-center bg-gray-50 p-4 rounded-lg cursor-pointer">
              <img
                src="/payeer-logo.png" // Replace with Payeer logo
                alt="Payeer"
                className="w-20 h-auto mr-4"
              />
              <span className="text-lg font-semibold">Pay with Payeer</span>
            </div>
            {/* PayPal */}
            <div className="flex items-center bg-gray-50 p-4 rounded-lg cursor-pointer">
              <img
                src="https://asset.brandfetch.io/id-Wd4a4TS/id4wNJYpBf.svg" // Replace with PayPal logo
                alt="PayPal"
                className="w-20 h-auto mr-4"
              />

              <span className="text-lg font-semibold">Pay with PayPal</span>
            </div>
          </div>
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
      </div>
    </div>
  );
}
