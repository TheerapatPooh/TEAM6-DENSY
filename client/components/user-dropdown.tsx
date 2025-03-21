/**
 * คำอธิบาย:
 *   คอมโพเนนต์ UserDropdown ใช้สำหรับแสดง Dropdown ของ User ที่สามารถเลือกได้
 * Input:
 * - users: IUser[] รายชื่อของ User ที่สามารถเลือกได้
 * - onUserSelect: (selectUser: IUser) => void ฟังก์ชันที่ใช้สำหรับเลือก User
 * - selectUser: IUser | null ข้อมูลของ User ที่ถูกเลือก
 * - color?: string สีของ Dropdown
 * Output:
 * - JSX ของ Dropdown ที่มี User ที่สามารถเลือกได้
 * - สามารถเลือก User ได้จาก Dropdown ที่แสดงข้อมูลของ User ที่สามารถเลือกได้
**/

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/app/type";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserTooltip } from "@/components/user-tooltip";

interface IUserDropdown {
  users: IUser[];
  onUserSelect: (selectUser: IUser) => void;
  selectUser: IUser | null;
  color?: string;
}

const UserDropdown: React.FC<IUserDropdown> = ({
  users,
  onUserSelect,
  selectUser,
  color = "card",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectUser = (user: IUser) => {
    onUserSelect(user);
    setIsOpen(false);
  };
  const t = useTranslations("General");

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="w-[300px] h-[65px] custom-shadow">
        <Button
          variant="outline"
          className={`w-full h-full justify-between bg-${color} hover:bg-background border-none`}
        >
          <div className="flex items-center gap-2 w-full">
            {selectUser && (
              <UserTooltip user={selectUser}>
                <Avatar>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectUser?.profile?.image?.path}`}
                  />
                  <AvatarFallback id={selectUser.id.toString()}>
                    {getInitials(selectUser.profile.name)}
                  </AvatarFallback>
                </Avatar>
              </UserTooltip>
            )}
            <p className="font-normal text-start text-muted-foreground truncate w-full">
              {selectUser ? selectUser.profile.name : t("SelectAUser")}
            </p>
            <span
              className={`material-symbols-outlined text-muted-foreground inline-block transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                }`}
            >
              expand_more
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`p-0`}>
        <ScrollArea className="w-full h-72 rounded-md">
          {users.map((user) => {
            return (
              <DropdownMenuItem
                key={user.id}
                className="flex items-center w-[300px] gap-2"
                onClick={() => handleSelectUser(user)}
              >
                <UserTooltip user={user}>
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${user?.profile?.image?.path}`}
                    />
                    <AvatarFallback id={user.id.toString()}>
                      {getInitials(user.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                </UserTooltip>
                <p className="font-normal text-lg truncate text-muted-foreground">
                  {user.profile.name}
                </p>
              </DropdownMenuItem>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
