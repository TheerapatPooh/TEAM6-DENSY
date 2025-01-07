import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser} from "@/app/type";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserDropdownProps {
  userData: IUser[];
  onUserSelect: (selectUser: IUser) => void;
  selectUser: IUser | null; 
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData, onUserSelect, selectUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectUser = (user: IUser) => {
    onUserSelect(user);
    setIsOpen(false);
  };
  const t = useTranslations("General");

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="w-[300px] h-[65px]">
        <Button
          variant="outline"
          className="w-full h-full justify-between bg-card hover:bg-background border-none"
        >
          <div className="flex items-center gap-2">
            {selectUser && (
              <Avatar>
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectUser?.profile?.image?.path}`}
                />
                <AvatarFallback>
                  {getInitials(selectUser.profile.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <p className="font-normal text-muted-foreground">
              {selectUser ? selectUser.profile.name : t("SelectAUser")}
            </p>
          </div>
          <span
            className={`material-symbols-outlined text-muted-foreground inline-block transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            expand_more
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 h-auto max-h-72">
        <ScrollArea className="max-h-72 w-full overflow-auto rounded-md">
          {userData.map((user) => {
            return (
              <DropdownMenuItem
                key={user.id}
                className="flex items-center w-[300px] gap-2"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${user?.profile?.image?.path}`}
                  />
                  <AvatarFallback>
                    {getInitials(user.profile.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-normal text-lg text-muted-foreground">
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
