import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";

import parse from "html-react-parser";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import countryData from "../../../country-by-name.json";
import { MultiSelect } from "primereact/multiselect";
import { findFlagUrlByCountryName } from "country-flags-svg";
import { Message } from "primereact/message";
import Cryptr from "cryptr";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../../loading";

export default function BasicDemo() {
  //   {/* this below will be use to render html text on the task page, that text which will be fetched from the database */}
  //   <div
  //   className="ql-editor"
  //   dangerouslySetInnerHTML={{ __html: text }}
  // ></div>
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  let topUpBalance = 0;
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPTR, {
    encoding: "base64",
    pbkdf2Iterations: 1000,
    saltLength: 10,
  });
  const [text, setText] = useState("");
  const validationSchema = Yup.object().shape({
    selectedCategory: Yup.string().required("Category is required"),
    amount: Yup.number().required("Amount is required"),
    repeat: Yup.string().required("Repeat option is required"),
    maxTimeSpan: Yup.object().required("Max timespan is required"),
  });
  const randomNumber = Math.floor(Math.random() * 100000000);
  const formik = useFormik({
    initialValues: {
      taskId: randomNumber,
      title: "",
      link: "",
      description: text,
      conditions: "",
      selectedCategory: "",
      amount: "",
      numberOfTasks: "",
      repeat: "",
      maxTimeSpan: "",
      // verifyPeriod: "",
      // distributionInterval: "",
      uniqueIP: false,
      advertise: "",
      rating: "",
      selectedImplementers: "",
      geotargeting: "",
      finalCost: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      // Handle form submission here, e.g., send data to backend
      const encrypted = handleCrytion(formik.values.finalCost);
      console.log("Form submitted with values:", values);
      // alert(JSON.stringify(values, null, 2));
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("image", image);
      });
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, subValue);
          });
        } else {
          formData.append(key, value);
        }
      });
      axios
        .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getuser`, {
          email: user?.email,
        })
        .then((response) => {
          topUpBalance = response.data.topUpBalance;
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong Check Logs");
        });
      if (topUpBalance < formik.values.finalCost) {
        setLoading(false);
        toast.error("Insufficient Balance");
        return;
      } else {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/updatetopupbalancedec`,
            {
              topUpBalance: finalCost,
              email: user?.email,
            }
          )
          .then((response) => {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/posttask`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((response) => {
                setLoading(false);
                console.log(response.data);
                router.reload();
                toast.success("posted successfully");
              })
              .catch((error) => {
                console.log(error);
                toast.error("Something went wrong Check Logs");
              });
          })
          .catch((error) => {
            console.log(error);
            toast.error("Something went wrong Check Logs");
          });
      }
    },
  });

  const handleCrytion = (cost) => {
    const encrypted = cryptr.encrypt(cost);
    return encrypted;
  };
  // handling rich text editor input
  const handleEditorChange = (e) => {
    const htmlValue = e.htmlValue;
    setText(htmlValue);
    formik.setFieldValue("description", htmlValue);
  };
  const [necessary, setNecessary] = useState("");
  const handleNecessaryChange = (e) => {
    const htmlValue = e.htmlValue;
    setNecessary(htmlValue);
    formik.setFieldValue("conditions", htmlValue);
  };

  const categoriesOptions = [
    { name: "Surfing" },
    { name: "Registeration Only" },
    { name: "Registeration with Activity" },
    { name: "Activity Only" },
    { name: "Youtube" },
    { name: "Instagram" },
    { name: "Vkontakte" },
    { name: "Facebook" },
    { name: "TikTok" },
    { name: "Telegram" },
    { name: "Other Social" },
    { name: "Vote" },
    { name: "Posting" },
    { name: "Copywrite, Rewrite" },
    { name: "Captha" },
    { name: "Transfer of Point Credits" },
    { name: "Invest" },
    { name: "Forex" },
    { name: "Games" },
    { name: "Mobile Apps" },
    { name: "Download Files" },
    { name: "Other" },
  ];

  const repeatedTimesOptions = [
    {
      label: "One Time",
      code: "OT",
      items: [{ label: "No repeat", value: null }],
    },
    {
      label: "Multiple Times",
      code: "MT",
      items: [
        { label: "Available after 1 hour of submission", value: 1 },
        { label: "Available after 3 hours of submission", value: 3 },
        { label: "Available after 6 hours of submission", value: 6 },
        { label: "Available after 12 hours of submission", value: 12 },
        { label: "Available after 1 day of submission", value: 24 },
        { label: "Available after 2 days of submission", value: 48 },
        { label: "Available after 3 days of submission", value: 72 },
        { label: "Available after 4 days of submission", value: 96 },
        { label: "Available after 5 days of submission", value: 120 },
        { label: "Available after 6 days of submission", value: 144 },
        { label: "Available after 7 days of submission", value: 168 },
      ],
    },
  ];
  const repeatedTimesTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };
  const maxTimeSpanOptions = [
    { name: "1 day", rate: 0.04 },
    { name: "2 days", rate: 0.06 },
    { name: "3 days", rate: 0.08 },
    { name: "4 days", rate: 0.1 },
    { name: "5 days", rate: 0.12 },
    { name: "6 days", rate: 0.14 },
    { name: "7 days", rate: 0.16 },
    { name: "8 days", rate: 0.18 },
    { name: "9 days", rate: 0.2 },
    { name: "10 days", rate: 0.22 },
  ];
  const advertiseOptions = [
    { name: "10 min (free)", rate: 0.0, time: 0.1667 },
    { name: "30 min ($0.001)", rate: 0.001, time: 0.5 },
    { name: "2 hr ($0.005)", rate: 0.005, time: 2 },
    { name: "1 day ($0.01)", rate: 0.01, time: 24 },
  ];
  const ratingOptions = [
    { name: "All Users", rate: 0.0 },
    { name: "1 star ($0.005)", rate: 0.005 },
    { name: "2 star ($0.01)", rate: 0.01 },
    { name: "3 star ($0.02)", rate: 0.02 },
    { name: "4 star ($0.025)", rate: 0.025 },
    { name: "5 star ($0.03)", rate: 0.03 },
    { name: "6 star ($0.035)", rate: 0.03 },
    { name: "7 star ($0.035)", rate: 0.035 },
    { name: "8 star ($0.04)", rate: 0.035 },
    { name: "9 star ($0.04)", rate: 0.04 },
    { name: "10 star ($0.04)", rate: 0.04 },
  ];
  const selectedImplementersOptions = [
    { name: "All Users", rate: 0.0 },
    { name: "Only Referels ($0.003)", rate: 0.003 },
  ];
  const geoTargetingTemplate = (option) => {
    const flagUrl = findFlagUrlByCountryName(option?.name);
    return (
      <div className="flex align-items-center">
        <img alt={option.name} src={flagUrl} className={`mr-2 flag w-5 h-5`} />
        <div>{option.name}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = formik.values.geotargeting
      ? formik.values.geotargeting.length
      : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? "s" : ""} selected.
      </div>
    );
  };
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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

  let cost = parseFloat(
    (
      0 +
      Number(formik.values.amount) * Number(formik.values.numberOfTasks) +
      (formik.values.uniqueIP ? 0.005 : null) +
      Number(
        formik.values.advertise?.rate != undefined
          ? formik.values.advertise.rate
          : null
      ) +
      Number(
        formik.values.rating?.rate != undefined
          ? formik.values.rating.rate
          : null
      ) +
      Number(
        formik.values.selectedImplementers?.rate != undefined
          ? formik.values.selectedImplementers.rate
          : null
      )
    ).toFixed(2)
  );

  let finalCost = parseFloat((cost + cost * 0.2).toFixed(2));
  const handleFormikCost = () => {
    formik.setFieldValue("finalCost", finalCost);
    formik.setFieldValue("email", user?.email);
  };
  return (
    <>
      <div className="card mx-5">
        {loading ? (
          <Loading message={"posting your task ..."} />
        ) : (
          <div className="w-[70%] mx-auto">
            <h1 className="text-2xl font-bold">Post Promotion</h1>
            <p className="text-gray-500">
              create your promotion online by filling up the form
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-md rounded px-5 pt-6 pb-8 mb-4"
            >
              {/* title  */}
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="link"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Title
                </label>
                <InputText
                  className="border-2  p-1"
                  type="text"
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </div>
              {/* link  */}
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="link"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Link (URL)
                </label>
                <InputText
                  className="border-2  p-1"
                  type="text"
                  id="link"
                  name="link"
                  value={formik.values.link}
                  onChange={formik.handleChange}
                />
              </div>
              {/* task description  */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description of Task
                </label>
                <Editor
                  type="text"
                  id="description"
                  name="description"
                  value={text}
                  onTextChange={handleEditorChange}
                  style={{ height: "320px" }}
                />
              </div>

              {/* images for reference upload button  */}
              <div>
                <h1 className="text-sm font-semibold">
                  Add Images For Reference
                </h1>
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
              </div>

              {/* necessary condititon  */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Necessary condition to fulfill task
                </label>
                <Editor
                  type="text"
                  id="conditions"
                  name="conditions"
                  value={necessary}
                  onTextChange={handleNecessaryChange}
                  style={{ height: "320px" }}
                />
              </div>

              {/* Mandatory site parameters  */}
              <div>
                <h1 className="block text-gray-700 text-lg font-bold mb-2 underline ">
                  Mandatory site parameters
                </h1>
                {/* select category  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="selectedCategory"
                  >
                    Select a Category
                  </label>
                  <Dropdown
                    id="selectedCategory"
                    name="selectedCategory"
                    value={formik.values.selectedCategory}
                    options={categoriesOptions.map((category) => ({
                      label: category.name,
                      value: category.name,
                    }))}
                    onChange={(e) =>
                      formik.setFieldValue("selectedCategory", e.value)
                    }
                    placeholder="Select a Category"
                    className="w-full md:w-14rem border-2 p-1"
                  />
                  {formik.errors.selectedCategory &&
                    formik.touched.selectedCategory && (
                      <div className="text-red-500">
                        {formik.errors.selectedCategory}
                      </div>
                    )}
                </div>
                {/* amount that would be paid to the user for completing the task */}
                <div className="flex flex-col gap-2 mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Amount paid to complete task
                  </label>
                  <InputText
                    className="border-2 p-1"
                    keyfilter={"money"}
                    type="text"
                    id="amount"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.amount && formik.touched.amount && (
                    <div className="text-red-500">{formik.errors.amount}</div>
                  )}
                </div>

                {/* number of tasks */}
                <div className="flex flex-col gap-2 mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Number of tasks
                  </label>
                  <InputText
                    className="border-2 p-1"
                    keyfilter={"int"}
                    type="text"
                    id="numberOfTasks"
                    name="numberOfTasks"
                    value={formik.values.numberOfTasks}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.numberOfTasks &&
                    formik.touched.numberOfTasks && (
                      <div className="text-red-500">
                        {formik.errors.numberOfTasks}
                      </div>
                    )}
                </div>
                {/* select task repetition option  */}
                <div className="flex flex-col justify-content-center py-4">
                  <label
                    htmlFor="repeat"
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                  >
                    Select Repeat Option
                  </label>
                  <Dropdown
                    value={formik.values.repeat}
                    onChange={(e) => formik.setFieldValue("repeat", e.value)}
                    options={repeatedTimesOptions}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={repeatedTimesTemplate}
                    className="w-full md:w-14rem border-2 p-1"
                    placeholder="Select Repeat Option"
                  />
                  {formik.errors.repeat && formik.touched.repeat && (
                    <div className="text-red-500">{formik.errors.repeat}</div>
                  )}
                </div>
                {/* Max timespan to complete task  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="maxTimeSpan"
                  >
                    Max timespan to complete task
                  </label>
                  <Dropdown
                    value={formik.values.maxTimeSpan}
                    onChange={(e) =>
                      formik.setFieldValue("maxTimeSpan", e.value)
                    }
                    options={maxTimeSpanOptions}
                    optionLabel="name"
                    placeholder="Select Max Timespan"
                    className="w-full md:w-14rem border-2 p-1"
                  />
                  {formik.errors.maxTimeSpan && formik.touched.maxTimeSpan && (
                    <div className="text-red-500">
                      {formik.errors.maxTimeSpan}
                    </div>
                  )}
                </div>
              </div>

              {/* additional parameters  */}
              <div>
                <h1 className="block text-gray-700 text-lg font-bold mb-2 underline ">
                  Additional site parameters
                </h1>
                {/* uniqueIP for task */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="maxTimeSpan"
                  >
                    Only by uniqueIP
                  </label>
                  <ToggleButton
                    checked={formik.values.uniqueIP}
                    onChange={(e) => formik.setFieldValue("uniqueIP", e.value)}
                    className="border-2 rounded-lg"
                  />
                  <div>
                    {formik.values.uniqueIP ? (
                      <h1 className="m-2 font-bold">+ $0.005</h1>
                    ) : null}
                  </div>
                </div>
                {/* advertise  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="advertise"
                  >
                    Advertise your tsk on our site
                  </label>
                  <Dropdown
                    value={formik.values.advertise}
                    onChange={(e) => formik.setFieldValue("advertise", e.value)}
                    options={advertiseOptions}
                    optionLabel="name"
                    placeholder="Select Advertise Option"
                    className="w-full md:w-14rem border-2 p-1"
                  />
                </div>
                {/* rating vale users ya fir all users  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="rating"
                  >
                    Task only for selected user based on rating
                  </label>
                  <Dropdown
                    value={formik.values.rating}
                    onChange={(e) => formik.setFieldValue("rating", e.value)}
                    options={ratingOptions}
                    optionLabel="name"
                    placeholder="Select Rating Option"
                    className="w-full md:w-14rem border-2 p-1"
                  />
                </div>
                {/* selected implementers  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="selectedImplementers"
                  >
                    Selected Implementers
                  </label>
                  <Dropdown
                    value={formik.values.selectedImplementers}
                    onChange={(e) =>
                      formik.setFieldValue("selectedImplementers", e.value)
                    }
                    options={selectedImplementersOptions}
                    optionLabel="name"
                    placeholder="Select Implementers Option"
                    className="w-full md:w-14rem border-2 p-1"
                  />
                </div>
                {/* geotargeting  */}
                <div className="flex flex-col py-4">
                  <label
                    className="pb-2 block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="selectedImplementers"
                  >
                    Geotargeting (selected countries)
                  </label>
                  <MultiSelect
                    value={formik.values.geotargeting}
                    options={countryData}
                    onChange={(e) =>
                      formik.setFieldValue("geotargeting", e.value)
                    }
                    optionLabel="name"
                    filter
                    placeholder="Select Countries"
                    itemTemplate={geoTargetingTemplate}
                    panelFooterTemplate={panelFooterTemplate}
                    className="w-full md:w-20rem border-2 p-1"
                    display="chip"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Message
                  className="my-2"
                  text={"Cost of implementation:" + "$" + finalCost}
                />
                <Message
                  className="my-2"
                  text={"including platform fees: 20%"}
                />

                <button
                  onClick={handleFormikCost}
                  type="submit"
                  className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
