import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Main from "./main";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Calendar } from "primereact/calendar";

const PersonalDetailsPage = () => {
  const [personalDetails, setPersonalDetails] = useState([]);
  const genderOptions = [
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Other", code: "O" },
    { name: "Prefer not to say", code: "P" },
  ];
  const maritalStatusOptions = [
    { name: "Single", code: "S" },
    { name: "Married", code: "M" },
    { name: "Divorced", code: "D" },
    { name: "Widowed", code: "W" },
    { name: "Separated", code: "S" },
  ];

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    axios
      .post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/getPersonal`, {
        email: sessionUser.email,
      })
      .then((res) => {
        console.log("then res: " + JSON.stringify(res));
        setPersonalDetails(res.data);
      })
      .catch((err) => {
        toast.error(
          "Something went wrong while getting personal details. Check Logs"
        );
        console.log(err);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      Gender: "",
      Occupation: "",
      "Marital Status": "",
      Children: "",
      dob: "",
    },
    onSubmit: (values) => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
      // Submit form data to the backend for updating
      // You can use axios to make a POST request to update the details
    },
  });

  return (
    <>
      <Main />
      <div className="container mx-auto mt-10 px-5">
        <h1 className="text-2xl font-semibold mb-5">Edit Personal Details</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <div className="card flex justify-content-center">
                  <Dropdown
                    value={formik.values.Gender}
                    onChange={(e) => formik.setFieldValue("Gender", e.value)}
                    options={genderOptions}
                    optionLabel="name"
                    placeholder="Select a Gender"
                    className="w-full md:w-14rem border-2 p-1 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  className="border rounded-md py-2 px-3 w-full bg-gray-100"
                  value={formik.values.Occupation}
                  onChange={formik.handleChange}
                  name="Occupation"
                />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Marital Status
                </label>
                <div className="card flex justify-content-center">
                  <Dropdown
                    value={formik.values["Marital Status"]}
                    onChange={(e) =>
                      formik.setFieldValue("Marital Status", e.value)
                    }
                    options={maritalStatusOptions}
                    optionLabel="name"
                    placeholder="Select Marital Status"
                    className="w-full md:w-14rem border-2 p-1 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Children
                </label>
                <input
                  type="text"
                  className="border rounded-md py-2 px-3 w-full bg-gray-100"
                  value={formik.values.Children}
                  onChange={formik.handleChange}
                  name="Children"
                />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date of Birth
                </label>
                <Calendar
                  name="dob"
                  className="border-2 p-1 rounded-lg"
                  value={formik.values.dob}
                  placeholder="Select Date"
                  onChange={(e) => formik.setFieldValue("dob", e.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white m-5 font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default PersonalDetailsPage;
