import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Main from "./main";

const ProfilePage = () => {
  const auth = getAuth();
  const router = useRouter()
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("User signed out successfully");
        router.reload()
      })
      .catch((error) => {
        // An error happened.
        toast.error("Error signing out: ", error);
        console.error("Error signing out: ", error);
      });
  };
  console.log(user);
  return (
    <>
    <Main/>
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-blue-500 rounded-full flex justify-center items-center text-white text-xl font-semibold">
                <img
                  src={
                    user?.photoURL ||
                    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1712361600&semt=ais"
                  }
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold capitalize">
                  {user?.displayName}
                </h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="mt-8 text-left">
              <h3 className="text-lg font-semibold">About Me</h3>
              <p className="mt-2 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                vehicula vitae sapien sed pulvinar. Donec vehicula justo nec
                nisi fringilla eleifend.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="mt-2 text-gray-500">
                <p>Email: {user?.email}</p>
                <p>Phone: +1234567890</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="mt-2 text-gray-500">
                <p>Twitter: @johndoe</p>
                <p>LinkedIn: /in/johndoe</p>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
