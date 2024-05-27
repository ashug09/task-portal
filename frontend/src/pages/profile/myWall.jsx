import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FaStar } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import Main from "./main";
export default function BasicDemo() {
  const earn = [
    {
      earningFrom: "Own Earnings",
      totalEarn: `$${1000}`,
    },
    {
      earningFrom: "Referral L1 Earnings",
      totalEarn: `$${2000}`,
    },
    {
      earningFrom: "Referral L2 Earnings",
      totalEarn: `$${3000}`,
    },
    {
      earningFrom: "Referral Ads Earnings",
      totalEarn: `$${4000}`,
    },
  ];
  const referalL1 = [
    {
      name: "John Doe",
      code: "f230fh0g3",
      memberSince: "2022-01-01",
      earningGiven: 1000,
    },
    {
      name: "Jane Smith",
      code: "nvklal433",
      memberSince: "2022-02-01",
      earningGiven: 2000,
    },
  ];

  const referalL2 = [
    {
      name: "Jane Smith",
      code: "nvklal433",
      memberSince: "2022-02-01",
      earningGiven: 2000,
    },
    {
      name: "John Doe",
      code: "f230fh0g3",
      memberSince: "2022-01-01",
      earningGiven: 1000,
    },
    {
      name: "Jane Smith",
      code: "nvklal433",
      memberSince: "2022-02-01",
      earningGiven: 2000,
    },
  ];
  return (
    <div>
      <Main />
      <div className="card lg:mx-36">
        <div>
          <h3 className="text-4xl my-2 font-semibold text-center">My Wall</h3>
          <div className="my-8">
            <img
              className="rounded-full h-32 w-32 mx-auto"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            />
            <h1 className="text-2xl font-semibold text-center">John Doe</h1>
          </div>
          <div className="flex justify-evenly select-none">
            <div className="text-center bg-gray-100 border-2 rounded-lg p-2 mb-8">
              <h1 className="text-2xl text-left font-semibold">Rating</h1>
              <div className="flex">
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} fill="#FFD700" />
                <FaStar size={24} />
                <FaStar size={24} />
                <FaStar size={24} />
                <FaStar size={24} />
              </div>
            </div>
            <h1 className="text-center bg-gray-100 border-2 text-2xl py-5 font-semibold rounded-lg px-2 mb-8">
              <span className="font-normal">Member Since:</span> 2022-01-01
            </h1>
          </div>
        </div>
        <Accordion activeIndex={0}>
          <AccordionTab header="Financial Stats">
            <DataTable value={earn} tableStyle={{ minWidth: "50rem" }}>
              <Column field="earningFrom" header="Earning From"></Column>
              <Column field="totalEarn" header="Total Earn"></Column>
            </DataTable>
          </AccordionTab>
          <AccordionTab header="Referral L1">
            <DataTable value={referalL1} tableStyle={{ minWidth: "50rem" }}>
              <Column field="name" header="Name"></Column>
              <Column field="code" header="Code"></Column>
              <Column field="memberSince" header="Member Since"></Column>
              <Column field="earningGiven" header="Earning Given"></Column>
            </DataTable>
          </AccordionTab>
          <AccordionTab header="Referral L2">
            <DataTable value={referalL2} tableStyle={{ minWidth: "50rem" }}>
              <Column field="name" header="Name"></Column>
              <Column field="code" header="Code"></Column>
              <Column field="memberSince" header="Member Since"></Column>
              <Column field="earningGiven" header="Earning Given"></Column>
            </DataTable>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
}
