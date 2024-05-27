import React, { useEffect, useState } from "react";
import { Timeline } from "primereact/timeline";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "../../../loading";
export default function OnGoingTask() {
  const [taskDetails, setTaskDetails] = useState([]);
  const [taskId, setTaskId] = useState(0);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [evaluateDetail, setEvaluateDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const { taskId } = router.query;
      setTaskId(taskId);
      onAuthStateChanged(getAuth(), (userInfo) => {
        if (userInfo) {
          setUser(userInfo);
          getevaluation(userInfo);
          gettaskwithid();
          user ? getUserId() : null;
          setLoading(false);
        }
      });
      const getevaluation = async (userInfo) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getevaluation`,
            {
              email: userInfo?.email,
              taskId: taskId,
            }
          );
          setEvaluateDetail(response.data[0]);
        } catch (error) {
          toast.error("Something went wrong Check Logs");
          console.log(error);
        }
      };
      const gettaskwithid = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/gettaskwithid/${taskId}`
          );
          setTaskDetails(response.data);
        } catch (error) {
          toast.error("Something went wrong Check Logs");
          console.log(error);
        }
      };
      const getUserId = async () => {
        axios
          .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getuser`, {
            email: user?.email,
          })
          .then((response) => {
            setDbUser(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            toast.error(
              "Something went wrong Check Logs while fetching user ID from database"
            );
          });
      };
    }
    evaluateDetail != {} && taskDetails != [] && user != null
      ? setLoading(false)
      : null;
  }, [router.isReady, user]);
  const events = [
    {
      status: "On Going",
      date: evaluateDetail?.date,
      icon: `pi pi-circle`,
      color: `${evaluateDetail.status?.ongoing ? "green" : "grey"}`,
    },
    {
      status: "Under Evaluation",
      //   date: "15/10/2020 14:00",
      icon: `pi pi-circle`,
      color: `${evaluateDetail.status?.underEvaluation ? "green" : "grey"}`,
    },
    {
      status: "Evaluation Done",
      //   date: "15/10/2020 16:15",
      icon: `pi pi-circle`,
      color: `${evaluateDetail.status?.evaluationDone ? "green" : "grey"}`,
    },
    {
      status: "Payment Initiated",
      //   date: "16/10/2020 10:00",
      icon: `pi pi-circle`,
      color: `${evaluateDetail.status?.paymentInitiated ? "green" : "grey"}`,
    },
  ];
  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle rounded-full p-1 z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const [answer, setAnswer] = useState("");
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    const newImagePreviews = [...imagePreviews];

    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
      newImagePreviews.push(URL.createObjectURL(files[i]));
    }

    setImages(newImages);
    setImagePreviews(newImagePreviews);
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = handleImageChange;
    input.click();
  };
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newImagePreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newImagePreviews);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploadLoading(true);
    if (evaluateDetail.status?.underEvaluation) {
      alert("You have already submitted the task and is under evaluation");
      return;
    }
    if (!answer) {
      alert("Answer field is required");
      return;
    }
    const formData = new FormData();
    formData.append("answer", answer);
    images.forEach((image) => {
      formData.append("image", image);
    });
    formData.append("promoterEmail", taskDetails[0]?.email);
    formData.append("userEmail", user?.email);
    formData.append("userId", dbUser?.userId);
    formData.append("taskId", evaluateDetail.taskId);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createsubmission`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        setUploadLoading(false);
        toast.success("Your submission has been submitted successfully");
        setAnswer("");
        setImages([]);
        setImageUrls([]);
        setImagePreviews([]);
        router.reload();
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Something went wrong Check Logs");
    }
  };

  return (
    <div>
      {uploadLoading ? (
        <Loading message={"Uploading your submission..."} />
      ) : null}
      {loading ? (
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
      ) : (
        <div>
          <div className="text-xl font-semibold mx-5 underline">
            Task ID: {evaluateDetail.taskId}
          </div>
          <div className="text-xl font-semibold mx-5">
            Task: {evaluateDetail.title}
          </div>
          <div className="text-xl font-semibold mx-5">
            Max Time to Complete the task:{" "}
            <span className="underline">{evaluateDetail.maxTimeSpan}</span>
          </div>
          <Timeline
            className="mx-4"
            align="horizontal"
            value={events}
            content={(item) => item.status}
            // opposite={(item) => item.status}
            // content={(item) => (
            //   <small className="text-color-secondary">{item.date}</small>
            // )}
            marker={customizedMarker}
          />
          {/* TASK DETAILS */}
          <div>
            <div>
              <h1 className="text-xl m-5 font-semibold mb-6">
                Prepare & Submit Report
              </h1>
            </div>
            <div className="my-4 mx-2 bg-yellow-100 p-2 rounded-xl border-2 border-yellow-500">
              <strong>Necessary Conditions:</strong>
              <p>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: taskDetails[0]?.conditions,
                  }}
                ></div>
              </p>
            </div>
          </div>

          {/* TASK SUBMISSION FORM HERE */}
          <div>
            <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-md shadow-md">
              <h1 className="text-3xl font-semibold mb-6 text-center">
                Task Submission
              </h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <label className="block w-full max-w-md p-2 mb-4 text-gray-700">
                  Answer:
                  <textarea
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange}
                    className="block w-full max-w-md p-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>
                <div className="block w-full max-w-md p-2 mb-4">
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Images
                  </button>
                </div>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="flex items-center">
                    <img
                      src={preview}
                      alt={`Selected image ${index}`}
                      className="w-64 h-64 object-cover rounded-md shadow-md m-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {evaluateDetail.status?.underEvaluation ? (
                  <button
                    disabled={true}
                    className="bg-red-500 hover:bg-red-700 cursor-not-allowed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Already Submitted
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
