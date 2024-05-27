import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import Main from "../profile/main";
export default function OptedTask() {
  //on this page all the opted taks would be shown
  const router = useRouter();
  const [taskDetails, setTaskDetails] = useState([]);
  const [user, setUser] = useState(null);
  const [evaluate, setEvaluate] = useState([]);
  useEffect(() => {
    if (router.isReady) {
      const { taskId } = router.query;
      onAuthStateChanged(getAuth(), (userInfo) => {
        if (userInfo) {
          setUser(userInfo);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getevaluation`,
              {
                email: userInfo?.email,
              }
            )
            .then((response) => {
              console.log(response.data);
              setEvaluate(response.data);
            })
            .catch((error) => {
              console.log(error);
              toast.error("Something went wrong Check Logs");
            });
        }
      });
    }
  }, [router.isReady]);
  return (
    <div>
      <Main />
      <div className="lg:grid lg:grid-cols-2">
      {evaluate.map((item) => (
        <div
          className="max-w-md bg-white shadow-lg rounded-lg overflow-hidden mx-auto my-4 lg:w-[720px]"
          key={item.taskId}
        >
          <div className="px-4 py-2">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600 mt-2">Task ID: {item.taskId}</p>
            <p className="text-gray-600">
              Max Time to Complete: {item.maxTimeSpan}
            </p>
            <p className="text-gray-600 flex underline">
              Task Status:{" "}
              {item.status.paymentInitiated
                ? "Payment Initiated"
                : item.status.evaluationDone
                ? "Evaluation Done"
                : item.status.underEvaluation
                ? "Under Evaluation"
                : item.status.ongoing
                ? "Ongoing"
                : "Completed"}
            </p>
          </div>
          <div className="px-4 py-2">
            <button
              onClick={() =>
                router.push({
                  pathname: "/task/ongoingTask",
                  query: { taskId: item.taskId },
                })
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              More Details
            </button>
          </div>
        </div>
      ))}

      </div>
    </div>
  );
}
