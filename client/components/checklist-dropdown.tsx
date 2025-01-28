/**
 * คำอธิบาย:
 *   คอมโพเนนต์ ChecklistDropdown ใช้สำหรับแสดง Dropdown ของ Checklist และ Inspector ที่เป็นผู้รับผิดชอบในการตรวจสอบ
 * Input: 
 * - checklist: ข้อมูลของ Checklist ที่ต้องการแสดง
 * - handleselectUser: ฟังก์ชันที่ใช้สำหรับเลือก Inspector จาก Dropdown
 * Output:
 * - JSX ของ Dropdown ที่มี Checklist และ Inspector ที่สามารถเลือกได้
 **/

"use client";
import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/utils";
import UserDropdown from "@/components/user-dropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IChecklist, IUser } from "@/app/type";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IChecklistDropdown {
  checklist: IChecklist;
  handleselectUser: (user: IUser) => void;
}

export function ChecklistDropdown({ checklist, handleselectUser }: IChecklistDropdown) {
  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const [accordionValue, setAccordionValue] = useState<string | null>();

  useEffect(() => {
    const getData = async () => {
      try {
        const users = await fetchData("get", "/users?profile=true&image=true&role=inspector", true);
        setUserData(users);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser);
    handleselectUser(dropdownUser);
    setAccordionValue(null);
  };
  const t = useTranslations("General");

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={accordionValue}
        onValueChange={setAccordionValue}>
        <AccordionItem
          value="item-1"
          className="bg-secondary rounded-md w-full px-6 py-4 border-none custom-shadow"
        >
          <AccordionTrigger className="p-0 hover:no-underline">
            <div className="flex justify-between w-full">
              <p className="text-2xl font-bold">{checklist.title}</p>
              <div className="flex  w-[200px] gap-2 items-center mr-[100px]">
                {selectUser ? (
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectUser.profile.image?.path}`}
                    />
                    <AvatarFallback id={selectUser.id.toString()}>
                      {getInitials(selectUser.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <p className="font-semibold text-lg text-muted-foreground">
                  {selectUser
                    ? selectUser.profile.name
                    : t("SelectAnInspector")}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground">
                person_search
              </span>
              <p className="font-semibold text-lg text-muted-foreground">
                {t("inspector")}
              </p>
            </div>
            <UserDropdown users={userData} onUserSelect={handleUserSelect} selectUser={selectUser} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
