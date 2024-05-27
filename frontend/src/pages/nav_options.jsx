import { useRouter } from "next/router";
import React from "react";

export default function Nav_options() {
  const router = useRouter();
  return (
    <div className="my-5">
      <div className="flex flex-wrap justify-center bg-blue-100 py-2 rounded-lg mx-2">
        <button
          onClick={() => router.push("/task")}
          className="text-white text-lg h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
        >
          Tasks
        </button>
        <button
          onClick={() => router.push("/postTask/task")}
          className="text-white text-lg h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
        >
          Promotions
        </button>
        <button
          className="text-white text-lg h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
        >
          Payments
        </button>
        <button
        onClick={()=>router.push("/profile/profile")}
          className="text-white text-lg h-12 my-auto bg-blue-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
        >
          Profile
        </button>
      </div>
    </div>
  );
}
