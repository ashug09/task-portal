import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Nav from "./nav";

export default function Main() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingEvaluations, setPendingEvaluations] = useState(0);
  const [dbUser, setDbUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserInfo(user);
        userInfo ? totalTasks() : null;
        userInfo ? getTotalPendingEvaluations() : null;
        userInfo ? getTopUpBalance() : null;
        setLoading(false);
      }
    });
    const totalTasks = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/getpostedtaskwithemail/${userInfo?.email}/1`
        )
        .then((response) => {
          setTotalTasks(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong Check Logs");
        });
    };
    const getTotalPendingEvaluations = () => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getsubmissionwithuser/1`,
          {
            promoterEmail: userInfo?.email,
          }
        )
        .then((response) => {
          console.log(response.data);
          setPendingEvaluations(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong Check Logs");
        });
    };
    const getTopUpBalance = () => {
      axios
        .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getuser`, {
          email: userInfo?.email,
        })
        .then((response) => {
          setDbUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          toast.error("Something went wrong Check Logs");
          console.log(error);
        });
    };
  }, [userInfo]);
  return (
    <div>
      <Nav />
      <div className="bg-gray-100 p-10 h-full w-full">
        <h1 className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-max">
          Promoter&apos;s Dashboard
        </h1>
        {loading ? (
          <div className="mx-auto my-16">
            <i
              className="pi pi-spin pi-spinner mx-auto"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-5">
            {/* remaining advertising balance on the platform  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-2xl font-bold">${dbUser?.topUpBalance}</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Remaining Advertising Balance
              </h1>
              <button
                onClick={() => router.push("/profile/recharge")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
              >
                Recharge
              </button>
            </div>

            {/* number of total tasks posted on the platform  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-5xl">{totalTasks}</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Total Posted Tasks
              </h1>
              {totalTasks === 0 ? (
                <button
                  disabled={true}
                  className="cursor-not-allowed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                  title="No tasks posted yet"
                >
                  View Tasks
                </button>
              ) : (
                <button
                  onClick={() => router.push("/promoter/postedTask")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                >
                  View Tasks
                </button>
              )}
            </div>

            {/* number of tasks pending for evaluation  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-5xl">0</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Tasks Pending For Evaluation
              </h1>
              {pendingEvaluations === 0 ? (
                <button
                  disabled={true}
                  className="cursor-not-allowed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                  title="No tasks pending for evaluation"
                >
                  Evaluate
                </button>
              ) : (
                <button
                  onClick={() => router.push("/promoter/pendingEvaluation")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                >
                  Evaluate
                </button>
              )}
            </div>

            {/* number of tasks for which evaluation has been done  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-5xl">{pendingEvaluations}</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Evaluation Done
              </h1>
              {pendingEvaluations === 0 ? (
                <button
                  disabled={true}
                  className="cursor-not-allowed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                  title="No tasks pending for evaluation"
                >
                  View
                </button>
              ) : (
                <button
                  // onClick={() => router.push("/promoter/pendingEvaluation")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2"
                >
                  View
                </button>
              )}
            </div>

            {/* number of favorite tasks  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-5xl">0</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Favorite Tasks
              </h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2">
                View
              </button>
            </div>

            {/* number of exhausted tasks  */}
            <div className="bg-white shadow-lg rounded-lg m-5 h-56 w-52 relative">
              <h1 className="pt-8 pl-8 text-5xl">0</h1>
              <h1 className="pt-5 pl-5 text-lg font-semibold">
                Exhausted Tasks
              </h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 absolute bottom-2">
                View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
