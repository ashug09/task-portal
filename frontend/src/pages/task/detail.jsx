import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TaskDetailsPage = () => {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const [user, setUser] = useState({});
  const [taskId, setTaskId] = useState(0);
  useEffect(() => {
    //apply logic to hide the start button if the user already opted for the task by querying the database and getting the user(not the promoter) information because user has the array of taskIds then compare the current taskId with the taskIds in the array, if it matches then hide the button
    const { taskId } = router.query;
    setTaskId(taskId);
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
        //here the validation will be done, that if user already opted for the task then task start button would get disabled
        axios
          .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getuser`, {
            email: user?.email,
          })
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/gettaskwithid/${taskId}`
      )
      .then((response) => {
        setDetail(response.data);

        // TO GET USER(PROMOTER) INFORMATION FROM USER'S EMAIL
        // axios
        //   .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getuser`, {
        //     email: response.data[0].email,
        //   })
        //   .then((response) => {
        //     setUser(response.data);
        //     console.log("this is user email: ",);
        //     console.log("this is user: ", response.data);
        //   });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const taskArray = user?.taskTaken;
  const isTaskTaken = taskArray?.includes(taskId);
  // const taskDetails = {
  //   promoter: {
  //     name: "John Doe",
  //     email: "john@example.com",
  //     phone: "+1234567890",
  //     company: "ABC Marketing Inc.",
  //   },
  //   title: "Social Media Promotion",
  //   link: "https://example.com/social-media-promotion",
  //   description:
  //     "Boost your brand's online presence through targeted social media promotion...",
  //   necessaryConditions:
  //     "Participants must have an active social media account with a minimum number of followers...",
  //   category: "Social Media Marketing",
  //   amountPaid: "$20 per task",
  //   repetition: "50",
  //   maxTimespan: "7 days",
  //   uniqueIP: "Yes",
  // };

  const handleTakenTask = () => {
    // Function to handle taken task
    axios
      .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/takentaskpush`, {
        taskId: taskId,
        email: user?.email,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong Check Logs");
      });

    axios
      .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createevaluation`, {
        email: user?.email,
        evaluateDetail: {
          taskId: taskId,
          title: detail[0]?.title,
          link: detail[0]?.link,
          maxTimeSpan: detail[0]?.maxTimeSpan?.name,
          conditions: detail[0]?.conditions,
          status: {
            ongoing: true,
            underEvaluation: false,
            evaluationDone: false,
            paymentInitiated: false,
          },
          date: new Date(),
        },
      })
      .then((response) => {
        console.log(response.data);
        router.push({
          pathname: "/task/ongoingTask",
          query: { taskId: taskId },
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong Check Logs");
      });
  };

  const addWWW = url => {
    if (!/^https?:\/\//i.test(url)) {
      url = `https://www.${url}`;
    }
    return url;
  };
  return (
    <div className="container mx-auto my-8 lg:px-64 px-4">
      {/* Promoter's Information */}
      {/* <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Promoter's Information</h2>
        <p>Name: {taskDetails.promoter.name}</p>
        <p>Email: {taskDetails.promoter.email}</p>
        <p>Phone: {taskDetails.promoter.phone}</p>
        <p>Company: {taskDetails.promoter.company}</p>
      </div> */}

      {/* Task Details */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
        <h1 className="text-lg underline">Task ID: {detail[0]?.taskId}</h1>
        <p>
          <strong>Title:</strong> {detail[0]?.title}
        </p>
        <p>
          <strong>Link:</strong>{" "}
          <a
            href={addWWW(detail[0]?.link)}
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-500"
          >
            {detail[0]?.link}
          </a>
        </p>
        <div className="my-4 bg-blue-100 p-2 rounded-xl border-2 border-blue-500">
          <strong>Description:</strong>
          <p>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: detail[0]?.description,
              }}
            ></div>
          </p>
          <div className="grid grid-cols-4 gap-4">
            {detail[0]?.upload.map((image, index) => (
              <div key={index}>
                <img src={image} className="m-4" />
                <a href={image} target="_blank" className="text-blue-700 text-center p-1 border-2 border-black rounded-lg">Download</a>
              </div>
            ))}
          </div>
        </div>
        <div className="my-4 bg-yellow-100 p-2 rounded-xl border-2 border-yellow-500">
          <strong>Necessary Conditions:</strong>
          <p>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: detail[0]?.conditions,
              }}
            ></div>
          </p>
        </div>
        <p>
          <strong>Category:</strong> {detail[0]?.selectedCategory}
        </p>
        <p>
          <strong>Amount Paid to User:</strong> ${detail[0]?.amount}
        </p>
        <p>
          <strong>Repetition of Task:</strong> {detail[0]?.repeat}
        </p>
        <p>
          <strong>Max Timespan to Complete the Task:</strong>{" "}
          {detail[0]?.maxTimeSpan.name}
        </p>
        <p>
          <strong>Unique IP Required:</strong>{" "}
          {detail[0]?.uniqueIP ? "Yes" : "No"}
        </p>
      </div>

      {/* Start Task Button */}
      <div className="mt-8">
        {isTaskTaken ? (
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed">
            Task already taken
          </button>
        ) : (
          <button
            onClick={handleTakenTask}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Task
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
