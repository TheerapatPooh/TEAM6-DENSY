import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, PatrolChecklist } from "@/app/type";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UserDropdownProps {
  userData: User[];
  onUserSelect: (selectedUser: User) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData, onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
    setIsOpen(false);

  };
  const t = useTranslations("General");


  useEffect(() => {
    console.log(selectedUser)
  },[selectedUser])
  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="w-[300px] h-[65px]">
        <Button variant="outline" className="w-full h-full justify-between bg-card hover:bg-background">
          <div className="flex items-center gap-2">
            {selectedUser && (
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{getInitials(selectedUser.profile.name)}</AvatarFallback>
              </Avatar>
            )}
            <p className="font-normal text-muted-foreground">
              {selectedUser ? selectedUser.profile.name :  t("SelectAUser")}
            </p>
          </div>
          <span
            className={`material-symbols-outlined text-muted-foreground inline-block transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          >
            expand_more
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {userData.map((user) => (
          <DropdownMenuItem key={user.id} className="flex items-center w-[300px] gap-2" onClick={() => handleSelectUser(user)}>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{getInitials(user.profile.name)}</AvatarFallback>
            </Avatar>
            <p className="font-normal text-muted-foreground">{user.profile.name}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
