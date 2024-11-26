import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser} from "@/app/type";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserDropdownProps {
  userData: IUser[];
  onUserSelect: (selectedUser: IUser) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData, onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    onUserSelect(user);
    setIsOpen(false);

  };
  const t = useTranslations("General");

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="w-[300px] h-[65px]">
        <Button variant="outline" className="w-full h-full justify-between bg-card hover:bg-background">
          <div className="flex items-center gap-2">
            {selectedUser && (
              <Avatar>
                <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectedUser?.profile?.image?.path}`} />
                <AvatarFallback>{getInitials(selectedUser.profile.name)}</AvatarFallback>
              </Avatar>
            )}
            <p className="font-normal text-muted-foreground">
              {selectedUser ? selectedUser.profile.name : t("SelectAUser")}
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
        <ScrollArea className="h-72 w-full rounded-md border">
          {userData.map((user) => {
            return (
              <DropdownMenuItem key={user.id} className="flex items-center w-[300px] gap-2" onClick={() => handleSelectUser(user)}>
                <Avatar>
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${user?.profile?.image?.path}`} />
                  <AvatarFallback>{getInitials(user.profile.name)}</AvatarFallback>
                </Avatar>
                <p className="font-normal text-muted-foreground">{user.profile.name}</p>
              </DropdownMenuItem>)
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
