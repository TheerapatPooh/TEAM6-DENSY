"use client";
import React, { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/api";
import UserDropdown from "./user-dropdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checklist, User } from "@/app/type";
import { getInitials } from "@/lib/utils";


interface Props {
  checklist: Checklist;
  handleselectUser: (user: User) => void;
}

export function ChecklistDropdown({ checklist, handleselectUser }: Props) {
  const [userData, setUserData] = useState<User[]>([]);
  const [selectUser, setSelectUser] = useState<User | null>(null);


  useEffect(() => {
    const getData = async () => {
      try {
        const users = await fetchData("get", "/profiles", true);
        setUserData(users);

      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  const handleUserSelect = (dropdownUser: User) => {
    setSelectUser(dropdownUser)
    handleselectUser(dropdownUser); 
  }

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="bg-secondary rounded-md w-full px-4 py-2 border-none">
          <AccordionTrigger className="hover:no-underline">
            <p className="text-2xl">{checklist.title}</p>
            <div className="flex items-center w-[300px] gap-2">
              {selectUser ? (
                <Avatar>
                  <AvatarImage src={selectUser.profile[0].imagePath || ""} />
                  <AvatarFallback>{getInitials(selectUser.profile[0].name)}</AvatarFallback>
                </Avatar>
              ) : null}
              <p className="font-semibold text-lg text-muted-foreground">
                {selectUser ? selectUser.profile[0].name : "Select an Inspector"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground">engineering</span>
              <p className="font-semibold text-lg text-muted-foreground">Inspector</p>
            </div>
            <UserDropdown userData={userData} onUserSelect={handleUserSelect} />

          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

  );
}
