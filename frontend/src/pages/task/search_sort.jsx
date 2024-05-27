import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { FaSortAmountUpAlt } from "react-icons/fa";
import Search_sort_window from "./search_sort_window";
import { IoIosCloseCircle } from "react-icons/io";

export default function Search_sort() {
  const [hidden, setHidden] = useState("hidden");
  return (
    <div>
      <div className="lg:w-[70%] mx-auto" title="search, sort or filter your task">
        <div className="border-2 m-1 p-1 rounded-full border-blue-500 flex justify-between">
          {hidden === "" ? (
            <h1 className="text-lg font-bold mx-2">Sort & Filter</h1>
          ) : (
            <button
              onClick={() => setHidden("")}
              className="mx-2 my-auto w-full text-left"
            >
              search, sort or filter your task
            </button>
          )}
          {hidden === "" ? (
            <button className="mx-2" onClick={() => setHidden("hidden")}>
              <IoIosCloseCircle size={28} />
            </button>
          ) : (
            <div className="flex mx-5 my-auto">
              <div className="mx-1">
                <FaFilter />
              </div>
              <div className="mx-1">
                <FaSortAmountUpAlt />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${hidden}`}>
        <Search_sort_window hideButton={()=>setHidden("hidden")}/>
      </div>
    </div>
  );
}
