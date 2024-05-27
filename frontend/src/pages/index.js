import Image from "next/image";
import { Inter } from "next/font/google";
import Dashboard from "./dashboard";
import Newmain from "./profile/newmain";
import Task from "./task/task";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Task />
      {/* <Dashboard /> */}
    </>
  );
}
