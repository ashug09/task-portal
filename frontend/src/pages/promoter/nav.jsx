import React from "react";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/router";
import { InputSwitch } from "primereact/inputswitch";

export default function Nav() {
  const [checked, setChecked] = React.useState(true);
  const router = useRouter();
  const items = [
    {
      label: "My Wall",
      icon: "pi pi-chart-line",
      command: () => {
        router.push("/profile/myWall");
      },
    },
    {
      label: "Personal",
      icon: "pi pi-id-card",
      command: () => {
        router.push("/profile/personal");
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
      label: checked ? "Posted Tasks" : "Favorite",
      icon: checked ? "pi pi-inbox" : "pi pi-heart",
      command: () => {
        checked
          ? router.push("/promoter/postedTask")
          : router.push("/profile/fav");
      },
    },
    checked
      ? ""
      : {
          label: checked ? null : "Task Status",
          icon: checked ? null : "pi pi-clock",
          command: () => {
            checked ? null : router.push("/task/optedTask");
          },
        },
    checked
      ? ""
      : {
          label: "Hidden",
          icon: "pi pi-eye-slash",
          // command: () => {
          //     router.push('/profile/favorite');
          // }
        },
    checked
      ? ""
      : {
          label: "Profile",
          icon: "pi pi-user",
          command: () => {
            router.push("/profile/profile");
          },
        },
  ];
  const end = (
    <div className="card flex justify-content-center">
      <h1 className="mx-2 my-auto">
        {checked ? "Promoter's Dashboard" : "User's Dashboard"}
      </h1>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  );
{checked ? null :router.push("/profile/profile")}
  return (
    <div className="card my-5 mx-auto">
      <div className="d-flex justify-content-evenly">
        <Menubar
          className="bg-purple-100"
          pt={{ items: "flex justify-evenly" }}
          model={items}
          end={end}
        />
      </div>
    </div>
  );
}
