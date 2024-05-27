// import React, { useState } from "react";
// import ProfilePage from "./profile";
// import PaymentDetailsPage from "./payment";
// import PersonalDetailsPage from "./personal";
// import { useRouter } from "next/router";

// export default function Main() {
//   const router = useRouter();
//   // const [content, setContent] = useState(<ProfilePage />);
//   return (
//     <div className="bg-gray-100 rounded-lg p-2">
//       <div className="my-5">
//         <div className="flex flex-wrap justify-center bg-purple-100 py-2 rounded-lg mx-2">
//           <button
//             onClick={() => router.push("/profile/myWall")}
//             className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
//           >
//             My Wall
//           </button>
//           <button
//             onClick={() => {
//               router.push("/profile/personal");
//             }}
//             className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
//           >
//             Personal
//           </button>
//           <button
//             onClick={()=>router.push("/profile/payment")}
//             className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
//           >
//             Payments
//           </button>
//           <button onClick={()=>router.push("/profile/fav")} className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0">
//             Favorites
//           </button>
//           <button className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0">
//             Task Status
//           </button>
//           <button className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0">
//             Hidden
//           </button>
//           <button
//             onClick={() => router.push("/profile/profile")}
//             className="text-white text-lg h-12 my-auto bg-purple-500 mx-2 rounded-xl px-8 mb-2 sm:mx-5 sm:mb-0"
//           >
//             Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/router";
import { InputSwitch } from "primereact/inputswitch";

export default function Main() {
  const [checked, setChecked] = React.useState(false);
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
{checked ? router.push("/promoter/main") :null}
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
