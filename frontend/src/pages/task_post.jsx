import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

export default function Task_post() {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    author: Yup.string().required("Author is required"),
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      author: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission here, e.g., send data to backend
      console.log("Form submitted with values:", values);
      axios
        .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/task/posttask`, values)
        .then((response) => {
          console.log(response);
          toast.success("posted successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong Check Logs");
        });
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <h1 className="my-5 text-2xl font-bold">Create and Post Your Task</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <TextField
            id="title"
            name="title"
            type="text"
            label="Title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            variant="outlined"
            fullWidth
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.title}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <TextField
            id="description"
            label="Description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            maxRows={4}
            multiline
            fullWidth
          />

          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <TextField
            id="author"
            label="Author"
            name="author"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.author}
            variant="outlined"
            fullWidth
          />
          {formik.touched.author && formik.errors.author ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.author}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
        <h1 className="bg-red-100 my-5 rounded-lg p-2 inline-block">Rs. 500.00 fees will be charged</h1>
      </form>
    </div>
  );
}
