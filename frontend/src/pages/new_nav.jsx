import React from "react";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/router";

export default function New_nav() {
  const router = useRouter();
  const itemRender = (item) => {
    return (
      <>
        <div className="text-white"><span className="pi pi-list-check mr-2 my-auto"/>{item.label}</div>
      </>
    );
  };
  const items = [
    {
      label: "Tasks",
      icon: "pi pi-list-check",
      command: () => {
        router.push("/task/task");
      },
    },
    {
      label: "Promotions",
      icon: "pi pi-angle-double-up",
      command: () => {
        router.push("/postTask/task");
      },
    },
    {
      label: "Payments",
      icon: "pi pi-wallet",
      command: () => {
        router.push("/profile/payment");
      },
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        router.push("/profile/profile");
      },
    },
  ];
  const end = (
    <div onClick={() => router.push("/")} className="cursor-pointer">
      <h1 className="text-3xl max-w-screen-xl mx-10">SEOEarnSpace</h1>
    </div>
  );
  return (
    <div className="card my-5 mx-auto">
      <div className="d-flex justify-content-evenly">
        <Menubar
          className=""
          end={end}
          model={items}
        />
      </div>
    </div>
  );
}
