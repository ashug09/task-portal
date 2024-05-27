import React, { useState } from "react";
import { FaSliders } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoIdCard } from "react-icons/io5";
import { BsIncognito } from "react-icons/bs";
import { LuFileSearch } from "react-icons/lu";
import { IoIosCloseCircle } from "react-icons/io";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addTask } from "../features/taskSlice";
export default function Search_sort_window({hideButton}) {
  const dispatch = useDispatch();
  const parameter = ["One Time", "Multiple Time"];
  const categories = [
    "Surfing",
    "Registeration Only",
    "Registeration with Activity",
    "Activity Only",
    "Youtube",
    "Instagram",
    "Vkontakte",
    "Facebook",
    "TikTok",
    "Telegram",
    "Other Social",
    "Vote",
    "Posting",
    "Copywrite, Rewrite",
    "Captha",
    "Transfer of Point Credits",
    "Invest",
    "Forex",
    "Games",
    "Mobile Apps",
    "Download Files",
    "Other",
  ];
  const sort = [
    "Most Recent",
    "Oldest",
    "Price: Low to High",
    "Price: High to Low",
    // "By Rating",
  ];

  const formik = useFormik({
    initialValues: {
      parameter: "",
      categories: [],
      rewards: 0.0,
      sort: "",
      author_id: "",
      task_id: "",
      string_match: "",
    },
    onSubmit: (values) => {
      console.log(values);
      handleSortFilter(values);
      //   alert(JSON.stringify(values, null, 2));
    },
  });
  const handleSortFilter = async (values) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/filtersorttask`,
        values
      )
      .then((response) => {
        console.log(response.data);
        dispatch(addTask(response.data));
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong Check Logs");
      });
  };
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mx-2 p-1 border-2 rounded-xl">
          {/* FILTER BY PARAMETER HERE */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex">
              <span className="my-auto ml-2 mr-1">
                <FaSliders className="mr-1" size={18} />
              </span>
              By Parameter:{" "}
            </h1>
            {parameter.map((option, index) => (
              <button
                key={index}
                className={`mx-1 my-1 border-2 rounded-lg px-2 ${
                  formik.values.parameter === option
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black border-blue-500"
                }`}
                onClick={() => formik.setFieldValue("parameter", option)}
                type="button" // add type="button" to prevent form submission
              >
                {option}
              </button>
            ))}
          </div>

          {/* FILTER BY REWARDS/ PRICE  */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex">
              <span className="my-auto ml-2 mr-1">
                <FaRegMoneyBillAlt className="mr-1" size={20} />
              </span>
              By Rewards (greater than):{" "}
            </h1>
            <div className="w-64 flex my-auto mx-8">
              <input
                type="range"
                min="0.003"
                max="3.000"
                step="0.001"
                value={formik.values.rewards} // Bind to Formik field
                onChange={(e) =>
                  formik.setFieldValue("rewards", e.target.value)
                } // Update Formik field value
                className="w-full h-4 bg-gray-300 rounded-full outline-none appearance-none my-auto"
                style={{
                  background: `linear-gradient(to right, #4dc0b5 0%, #4dc0b5 ${
                    (formik.values.rewards / 3) * 100
                  }%, #cbd5e0 ${
                    (formik.values.rewards / 3) * 100
                  }%, #cbd5e0 100%)`,
                }}
              />
              <h1 className="text-center px-5 w-10">
                ${formik.values.rewards}
              </h1>
            </div>
          </div>

          {/* FILTER BY CATEGORIES OF TASKS */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex pr-16">
              <span className="my-auto ml-2 mr-1">
                <MdCategory className="mr-1" size={20} />
              </span>
              By Categories:{" "}
            </h1>
            <div className="flex flex-wrap">
              {categories.map((option, index) => (
                <button
                  key={index}
                  type="button" // Set type to button
                  className={`mx-1 my-1 border-2 rounded-lg px-2 ${
                    formik.values.categories.includes(option)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black border-blue-500"
                  }`}
                  onClick={() => {
                    const updatedCategories = [...formik.values.categories];
                    if (updatedCategories.includes(option)) {
                      // Remove option if already selected
                      updatedCategories.splice(
                        updatedCategories.indexOf(option),
                        1
                      );
                    } else {
                      // Add option if not selected
                      updatedCategories.push(option);
                    }
                    // Update Formik field value
                    formik.setFieldValue("categories", updatedCategories);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER BY SORTING OF TASKS */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex pr-16">
              <span className="my-auto ml-2 mr-1">
                <FaSortAmountUpAlt className="mr-1" size={20} />
              </span>
              Sort:{" "}
            </h1>
            <div className="flex flex-wrap">
              {sort.map((option, index) => (
                <button
                  key={index}
                  type="button" // Set type to button
                  className={`mx-1 my-1 border-2 rounded-lg px-2 ${
                    formik.values.sort === option
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black border-blue-500"
                  }`}
                  onClick={() => {
                    if (formik.values.sort === option) {
                      formik.setFieldValue("sort", ""); // Deselect the option
                    } else {
                      formik.setFieldValue("sort", option); // Select the option
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER BY AUTHOR ID, INPUT FIELD HERE   */}
          {/* <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex pr-16">
              <span className="my-auto ml-2 mr-1">
                <BsIncognito className="mr-1" size={20} />
              </span>
              By Author ID:{" "}
            </h1>
            <div className="flex flex-wrap">
              <input
                type="number"
                name="author_id"
                id="author_id"
                value={formik.values.author_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="enter the id of the author"
                className="border-2 border-blue-500 rounded-lg"
              />
            </div>
          </div> */}

          {/* FILTER BY TASK ID,INPUT FIELD HERE  */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex pr-16">
              <span className="my-auto ml-2 mr-1">
                <IoIdCard className="mr-1" size={20} />
              </span>
              By Task ID:{" "}
            </h1>
            <div className="flex flex-wrap">
              <input
                type="number"
                name="task_id"
                id="task_id"
                value={formik.values.task_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="enter the id of the task"
                className="border-2 border-blue-500 rounded-lg"
              />
            </div>
          </div>

          {/* STRING MATCH GOES HERE, MEANS MATCHING EXACT STRING OF THE TASK TITLE */}
          <div className="flex border-b-2 pb-2 my-2">
            <h1 className="my-auto flex pr-16">
              <span className="my-auto ml-2 mr-1">
                <LuFileSearch className="mr-1" size={20} />
              </span>
              String Match:{" "}
            </h1>
            <div className="flex flex-wrap">
              <input
                type="text"
                name="string_match"
                id="string_match"
                value={formik.values.string_match}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="enter the any task title to search"
                className="border-2 border-blue-500 rounded-lg w-72"
              />
            </div>
          </div>

          {/* APPLY BUTTON  */}
          <div className="flex border-b-2 pb-2 my-2">
            <button
              type="submit"
              onClick={hideButton}
              className="bg-green-500 hover:bg-green-700 text-xl text-white text-center px-5 py-1 rounded-xl mx-auto"
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
