import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import toast from "react-hot-toast";
import GoogleButton from "react-google-button";
import { useRouter } from "next/router";
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    signInWithRedirect(auth, provider)
      .then((res) => {
        toast.success("User signed in successfully");
         //initializing my wall for new user
         axios.post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createmywall`, { email: res.email }).then((response) => {
            console.log(response.data);
          }).catch((error) => {
            toast.error("Something went wrong in express server while creating my wall Check Logs");
          })
          //initializing personal details
          axios.post(`${process.env.NEXT_PUBLIC_BE_URI}/api/v1/user/createPersonal`, { email: values.email }).then((response) => {
            console.log(response.data);
          }).catch((error) => {
            toast.error("Something went wrong in express server while creating personal details Check Logs");
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast.error(errorMessage);
      });
  };

  const handleEmailSingIn = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in

        const user = userCredential.user;
        console.log(user);
        toast.success("User signed in successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast.error(errorMessage);
      });
  };
  return (
    <div className="flex items-center justify-center w-max rounded-xl pt-16 pl-16">
      <div className="bg-white p-8 rounded-lg shadow-md lg:w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              handleEmailSingIn(values);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex justify-center items-center">
          <GoogleButton
            onClick={() => {
              handleGoogleSignIn();
            }}
          />
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 mb-2">Don&apos;t have an account?</p>
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
