import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRepeat } from "react-icons/fa6";
import { IoBookmarkOutline, IoTimer } from "react-icons/io5";

export default function PostedTasks() {
  const router = useRouter();
  const [currentPosts, setCurrentPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserInfo(user);
        userInfo ? getPostedTasks() : null;
      }
    });
    const getPostedTasks = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/getpostedtaskwithemail/${userInfo?.email}/0`
        )
        .then((response) => {
          setCurrentPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong Check Logs");
        });
    };
  }, [userInfo]);
  return (
    <div>
      <div className="flex justify-between mx-36">
        <div className="text-2xl font-bold">All Tasks Posted By You</div>
        <div>
          <button onClick={() => router.push("/promoter/main")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back To Dashboard
          </button>
        </div>
      </div>
      <div>
        {currentPosts?.map((item) => (
          <div
            className="lg:w-[70%] mx-auto my-2 relative bg-gray-100 rounded-lg p-6 shadow-md flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6"
            key={item._id}
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {item.title}
              </h2>
              <p className="">{item.taskId}</p>
              <div className="mt-5 lg:flex">
                <p
                  className="text-gray-600 m-1 bg-white rounded-lg py-1 px-5 w-max border-2 border-blue-500"
                  title="category of the task"
                >
                  {item.selectedCategory}
                </p>
                <div
                  className="flex border-2 border-blue-500 rounded-lg mx-1 w-max m-1"
                  title="maximum time for completing the task"
                >
                  <span className="my-auto">
                    <IoTimer size={32} className="mx-2" />
                  </span>
                  <p className="my-auto mr-2">{item.maxTimeSpan.name}</p>
                </div>
                <div className="flex m-1">
                  <div
                    className="my-auto border-2 border-blue-500 rounded-lg p-1 w-max m-1"
                    title="you can repeat the task after successful completion & evaluation"
                  >
                    {Number.isInteger(parseInt(item.repeat)) ? (
                      <FaRepeat color="orange" size={28} />
                    ) : null}
                  </div>
                  <div
                    className="my-auto mx-1 border-2 border-blue-500 rounded-lg p-1"
                    title="bookmark this task"
                  >
                    <IoBookmarkOutline color="orange" size={28} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    router.push({
                      pathname: `/task/detail`,
                      query: { taskId: item.taskId },
                    });
                  }}
                  className="border-2 text-white bg-blue-500 border-black px-2 py-1 rounded-lg m-1"
                >
                  Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-l-lg shadow-md py-1 px-5 absolute bottom-1/2 right-0 border-2 border-green-500">
              ${item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
