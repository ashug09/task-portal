import Cryptr from "cryptr";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

const Home = () => {
  const [newAmt, setNewAmt] = useState(0);
  const [payId, setPayId] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPayId(user.email + Math.random(99));
      }
    });
    // Manipulate the amount input field after the component mounts
    const { amt } = router.query;
    if (amt) {
      const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPTR, {
        encoding: "base64",
        pbkdf2Iterations: 1000,
        saltLength: 10,
      });
      const decryptedAmt = cryptr.decrypt(amt);
      setNewAmt(decryptedAmt);

      // Wait for the next render cycle to ensure the input field is updated
      setTimeout(() => {
        // Manipulate the amount input field
        const PAYMENT_ID = document.getElementsByName("PAYMENT_ID")[0];
        if (PAYMENT_ID) {
          PAYMENT_ID.value = payId;
        }
        const amtInput = document.getElementById("amt");
        if (amtInput) {
          amtInput.value = decryptedAmt;
        }

        // Submit the form
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 0); // No delay needed, submit the form on the next render cycle
    }
  }, [router.query]); // Re-run the effect when the query parameters change

  return (
    <div>
      <h1>PerfectMoney Loading.....</h1>
      <div className="hidden">
        <form
          ref={formRef}
          action="https://perfectmoney.com/api/step1.asp"
          method="POST"
        >
          <input type="hidden" name="PAYEE_ACCOUNT" value="U43280630" />
          <input type="hidden" name="PAYEE_NAME" value="SEOEarnSpace" />
          <input type="text" name="PAYMENT_ID" defaultValue="" />
          <br />
          <input
            id="amt"
            type="text"
            name="PAYMENT_AMOUNT"
            value={newAmt || ""} // Ensure value is empty if newAmt is null
            readOnly
          />
          {/* Set the input field as readOnly to prevent user input */}
          <br />
          <input type="hidden" name="PAYMENT_UNITS" value="USD" />
          <input type="hidden" name="STATUS_URL" value="" />
          <input
            type="hidden"
            name="PAYMENT_URL"
            value={`${process.env.NEXT_PUBLIC_FE_URI}/paymentGateway/paySuccess`}
          />
          <input type="hidden" name="PAYMENT_URL_METHOD" value="LINK" />
          <input
            type="hidden"
            name="NOPAYMENT_URL"
            value={`${process.env.NEXT_PUBLIC_FE_URI}/paymentGateway/payError`}
          />
          <input type="hidden" name="NOPAYMENT_URL_METHOD" value="LINK" />
          <input type="hidden" name="SUGGESTED_MEMO" value="" />
          <input type="hidden" name="BAGGAGE_FIELDS" value="" />
          <input type="submit" name="PAYMENT_METHOD" value="Pay Now!" />
        </form>
      </div>
    </div>
  );
};

export default Home;
