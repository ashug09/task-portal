import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import date from "date-and-time";

export default function Summary() {
  const router = useRouter();
  const { taskId } = router.query;
  const [userInfo, setUserInfo] = useState(null);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  useEffect(() => {
    if (router.isReady) {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setUserInfo(user);
          userInfo ? getPendingEvaluationTasks() : null;
        }
      });
      const getPendingEvaluationTasks = () => {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getsubmissionwithuser/0`,
            {
              promoterEmail: userInfo?.email,
              taskId: taskId,
            }
          )
          .then((response) => {
            console.log(response.data);
            setPendingEvaluations(response.data);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Something went wrong check logs");
          });
      };
    }
  }, [router.isReady, userInfo]);
  return (
    <div>
      {pendingEvaluations.length === 0 ? (
        <div className="flex justify-center">
          <h1 className="text-xl border-2 border-black p-1 rounded-lg m-1 w-max mx-auto">
            No pending evaluations for this task
          </h1>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3">
          {pendingEvaluations.map((item, index) => (
            <div className="bg-gray-100 border-blue-500 border-2 p-2 rounded-lg m-5 w-96 h-52 relative" key={index}>
              <h1
                className="text-xl border-2 border-black p-1 rounded-lg m-1 w-max mx-auto"
                title="task title"
              >
                User ID: {item.userId}
              </h1>
              <div className="flex justify-center">
                <h1
                  className="mx-1 border-2 border-black p-1 rounded-lg"
                  title="task id"
                >
                  submitted at:{" "}
                  {date.format(new Date(item.createdAt), "ddd, MMM DD YYYY")}
                </h1>
              </div>
              <div className="flex justify-center mb-2 mt-10 ">
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/promoter/userReport/detail",
                      query: { taskId: item.taskId, userId: item.userId },
                    })
                  }
                  className="text-white h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
                >
                  View Submission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
