import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const auth = getAuth();
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);
  const handleGoogleSignUp = () => {
    // Implement Google sign-up logic here
    alert("Sign up with Google");
  };

  return (
    <div className="flex items-center justify-center py-5 h-max rounded-xl pt-16 pl-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .required("Required")
              .min(6, "Password must be at least 6 characters"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            let success = false;
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createuser`,
                values
              )
              .then((response) => {
                createUserWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                )
                  .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    toast.success("Registered successfully");
                    console.log(user);
                    console.log(response.data);
                    if (user) {
                      updateProfile(auth.currentUser, {
                        displayName: values.name,
                      })
                        .then(() => {
                          success = true;
                          toast.success("Name updated successfully");
                        })
                        .catch((error) => {
                          toast.error(
                            "Something went wrong while updating name in firebase Check Logs"
                          );
                        });
                    }
                    // ...
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error("Something went wrong in firebase Check Logs");
                    // ..
                  });
              })
              .catch((error) => {
                toast.error(
                  "Something went wrong in express server Check Logs"
                );
              });
            if (success) {
              //initializing my wall for new user
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createmywall`,
                  { email: values.email }
                )
                .then((response) => {
                  console.log("inizializing my wall: " + response.data);
                })
                .catch((error) => {
                  toast.error(
                    "Something went wrong in express server while creating my wall Check Logs"
                  );
                });
              //initializing personal details
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createPersonal`,
                  { email: values.email }
                )
                .then((response) => {
                  console.log(
                    "initializing personal details: " + response.data
                  );
                })
                .catch((error) => {
                  toast.error(
                    "Something went wrong in express server while creating personal details Check Logs"
                  );
                });
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex justify-center items-center">
          <button
            onClick={handleGoogleSignUp}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign up with Google
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 mb-2">Already have an account?</p>
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
