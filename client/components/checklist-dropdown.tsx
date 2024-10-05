"use client";
import React, { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/api";
import UserDropdown from "./user-dropdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PatrolHasChecklist {
  checklistId: number;
  inspectorId: number;
}

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  lasted: boolean;
  updateAt: string;
  updateBy: number;
  version: number;
}

interface Props {
  checklist: ChecklistItem;
  handleselectUser: (user: PatrolHasChecklist) => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  department: string | null;
  created_at: string;
  profile: Profile[];
}

interface Profile {
  address: string;
  age: number;
  id: number;
  name: string;
  tel: string;
  users_id: number;
}

export function ChecklistDropdown({ checklist, handleselectUser }: Props) {
  const [selectUser, setselectUser] = useState<string>("");
  const [userData, setUser] = useState<User[]>([]);


  useEffect(() => {
    const getData = async () => {
      try {
        const dataAllUser = await fetchData("get", "/users", true);
        setUser(dataAllUser);
        console.log(dataAllUser);



      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="bg-secondary rounded-md w-full px-4 py-2 border-none">
          <AccordionTrigger className="hover:no-underline">
            <p className="text-2xl">{checklist.title}</p>
            <div className="flex items-center w-[300px] gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-lg text-muted-foreground">Jame Smith</p>
            </div>

          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground">engineering</span>
              <p className="font-semibold text-lg text-muted-foreground">Inspector</p>
            </div>
            <UserDropdown />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

  );
}
