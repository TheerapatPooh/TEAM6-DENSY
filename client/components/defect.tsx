"use client";
import React from "react";
import { DefectStatus, DefectType } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DefectProps {
  date: string;
  title: string;
  time: string;
  status: DefectStatus;
  type: DefectType;
  description?: string;
  beforeImage?: string;
  afterImage?: string;
  zone: string;
}

export default function Defect({
  date,
  title,
  time,
  status,
  type,
  description,
  beforeImage,
  afterImage,
  zone,
}: DefectProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Resolved":
        return "blue";
      case "Reported":
        return "mint";
      case "Completed":
        return "green";
      case "InProgress":
        return "orange";
      default:
        return "red";
    }
  };

  const getIconForStatus = (status: string) => {
    switch (status) {
      case "Resolved":
        return "autorenew";
      case "Reported":
        return "campaign";
      case "Completed":
        return "check_circle";
      case "InProgress":
        return "hourglass_top";
      default:
        return "pending";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Safety":
        return "mint";
      default:
        return "orange";
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="bg-secondary rounded-md w-full px-4 py-2 border-none"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#707A8A] cursor-default ">
              schedule
            </span>
            <span className="text-lg font-bold text-[#707A8A] cursor-default ">
              {date}
            </span>
            <span className="text-lg font-bold text-[#707A8A] cursor-default ">
              {time}
            </span>
            <h2 className="text-lg font-bold text-card-foreground cursor-default ">
              {title}
            </h2>
          </div>
        </AccordionTrigger>

        {/* โชว์ส่วนของ status, type, และปุ่ม Verify/Rework */}
        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex space-x-2">
            <BadgeCustom
              variant={getStatusVariant(status)}
              showIcon={true}
              iconName={getIconForStatus(status)}
            >
              {status}
            </BadgeCustom>
            <BadgeCustom variant={getTypeVariant(type)}>{type}</BadgeCustom>
          </div>

          {/* แสดงปุ่ม Verify และ Rework เฉพาะเมื่อ status เป็น Resolved */}
          {status === "Resolved" && (
            <div className="flex space-x-2">
              <Button variant="success" size={"lg"}>
                <span className="material-symbols-outlined mr-2 text-[20px]">
                  check_circle
                </span>
                Verify
              </Button>
              <Button variant="destructive" size={"lg"}>
                <span className="material-symbols-outlined mr-2 text-[20px]">
                  cancel
                </span>
                Rework
              </Button>
            </div>
          )}
        </div>

        <AccordionContent>
          <div className="flex flex-col mt-4">
            <Textarea
              className="w-full h-40 bg-card "
              placeholder="Description"
              value={description || ""}
              readOnly
            />
            <div className="flex space-x-4 justify-between mt-4">
              <div className="flex space-x-4">
                <div>
                  <div className="flex items-center">
                    <p className="text-gray-500 mb-2 cursor-default user-select-none">
                      Before
                    </p>
                    <button className="ml-2 focus:outline-none cursor-default user-select-none">
                      <span className="material-symbols-outlined text-gray-500 cursor-default user-select-none">
                        edit
                      </span>
                    </button>
                  </div>
                  <div className="border p-2 rounded-md bg-background h-40 w-40 flex items-center justify-center cursor-default user-select-none">
                    {beforeImage ? (
                      <img
                        src={beforeImage}
                        alt="Before"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="cursor-default user-select-none">
                        No Image
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-2 cursor-default user-select-none">
                    After
                  </p>
                  <div className="border p-2 rounded-md bg-background h-40 w-40 flex items-center justify-center cursor-default user-select-none">
                    {afterImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/1728239317254-Scan_20220113 (2).png`}
                        alt="After"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="cursor-default user-select-none">
                        No Image
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <p className="text-gray-500 mb-2 cursor-default user-select-none"></p>
                <div className="border p-2 rounded-md bg-background flex items-center justify-center h-48 w-48 cursor-default user-select-none">
                  {zone}
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
