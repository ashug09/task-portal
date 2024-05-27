import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import date from "date-and-time";
export default function Detail() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { taskId, userId } = router.query;
  const [data, setData] = useState();
  useEffect(() => {
    if (router.isReady) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getsubmissionwithuser/4`,
          {
            taskId: taskId,
            userId: userId,
          }
        )
        .then((response) => {
          console.log(response.data);
          setData(response.data[0]);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong check logs");
        });
      setLoading(false);
    }
  }, [router.isReady]);
  const handleCorrectTask = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/updatestatus/1`, {
        taskId: data?.taskId,
        userId: data?.userId,
        userEmail: data?.userEmail,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Task marked as correct, payment will be initiated");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong check logs");
      });
  };
  return (
    <div>
      {loading ? (
        <i
          className="pi pi-spin pi-spinner m-20"
          style={{ fontSize: "2rem" }}
        ></i>
      ) : (
        <div className="py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
          <div className="relative px-6 pt-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-lg sm:mx-auto sm:rounded-lg sm:px-10">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-300/50">
                <div className="py-8 text-base leading-7 space-y-6 text-gray-600">
                  <p>Task ID: {data?.taskId}</p>
                  <p>User ID: {data?.userId}</p>
                  <p>
                    Submission Date & Time:{" "}
                    {date.format(
                      new Date(data?.createdAt),
                      "ddd, MMM DD YYYY HH:mm"
                    )}
                  </p>
                  <p>Submission Report Below</p>
                  <div className="py-2 border-2 border-yellow-500 bg-yellow-100 rounded-lg">
                    <p className="p-2">{data?.answer}</p>
                    <div>
                        {data?.upload.map((image, index) => (
                            <div className="p-1" key={index}>
                                <img src={image} className="my-2"/>
                                <a href={image} target="_blank" className="text-blue-500 border-2 border-black p-1 rounded-lg">download file</a>
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleCorrectTask()}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Correct
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      Re-attempt
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
