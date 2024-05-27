import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PendingEvaluation() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserInfo(user);
        userInfo ? getPendingEvaluationTasks() : null;
      }
    });
    const getPendingEvaluationTasks = () => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getsubmissionwithuser/2`,
          {
            promoterEmail: userInfo?.email,
          }
        )
        .then((response) => {
          console.log(response.data);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getsubmissionwithuser/3`,
              {
                taskId: response.data,
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
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong check logs");
        });
    };
  }, [userInfo]);
  return (
    <div>
      <div className="flex justify-between mx-36">
        <h1 className="text-3xl text-left mx-5">
          All Pending Evaluation Tasks
        </h1>
        <div>
          <button
            onClick={() => router.push("/promoter/main")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back To Dashboard
          </button>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-3">
        {pendingEvaluations.map((item, index) => (
          <div className="bg-gray-100 border-blue-500 border-2 p-2 rounded-lg m-5 w-96 h-52 relative" key={index}>
            <h1
              className="text-xl border-2 border-black p-1 rounded-lg m-1 w-max mx-auto"
              title="task title"
            >
              {item.title}
            </h1>
            <div className="flex justify-center">
              <h1
                className="mx-1 border-2 border-black p-1 rounded-lg"
                title="task id"
              >
                {item.taskId}
              </h1>
              <h1
                className="mx-1 border-2 border-black p-1 rounded-lg"
                title="created at"
              >
                5th May 2024 (hard code)
              </h1>
            </div>
            <div className="flex mb-2 mt-4 absolute bottom-1">
              <button className="text-white h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0">
                Task Details
              </button>

              <button
                onClick={() =>
                  router.push({
                    pathname: "/promoter/userReport/summary",
                    query: { taskId: item.taskId },
                  })
                }
                className="text-white h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
              >
                View Reports
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
