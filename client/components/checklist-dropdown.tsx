"use client";
import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/api";
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

interface Props {
  checklist: IChecklist;
  handleselectUser: (user: IUser) => void;
}

export function ChecklistDropdown({ checklist, handleselectUser }: Props) {
  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const users = await fetchData("get", "/users?profile=true&image=true", true);
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
  };
  const t = useTranslations("General");

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="item-1"
          className="bg-secondary rounded-md w-full px-4 py-2 border-none "
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex justify-between w-full">
              <p className="text-2xl">{checklist.title}</p>
              <div className="flex  w-[300px] gap-2 items-center mr-[100px]">
                {selectUser ? (
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectUser.profile.image?.path}`}
                      />
                    <AvatarFallback>
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
          <AccordionContent>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground">
                engineering
              </span>
              <p className="font-semibold text-lg text-muted-foreground">
                {t("Inspector")}
              </p>
            </div>
            <UserDropdown userData={userData} onUserSelect={handleUserSelect} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
