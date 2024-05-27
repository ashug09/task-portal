import React from "react";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/router";
import { InputSwitch } from "primereact/inputswitch";
export default function Newmain() {
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
      label: "Favorites",
      icon: "pi pi-heart",
      command: () => {
        router.push("/");
      },
    },
    {
      label: "Task Status",
      icon: "pi pi-clock",
      // command: () => {
      //     router.push('/profile/favorite');
      // }
    },
    {
      label: "Hidden",
      icon: "pi pi-eye-slash",
      // command: () => {
      //     router.push('/profile/favorite');
      // }
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        router.push("/profile/profile");
      },
    },
  ];
  const [checked, setChecked] = React.useState(false);
  const end = (
    <div className="card flex justify-content-center">
        <h1>yo yo yyo</h1>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  );
  return (
    <div className="card my-5 mx-auto">
      <div className="d-flex justify-content-evenly">
        <Menubar
          className="bg-blue-100"
          pt={{ items: "flex justify-evenly" }}
          model={items}
          end={end}
        />
      </div>
    </div>
  );
}
