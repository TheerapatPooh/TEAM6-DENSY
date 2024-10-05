import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserDropdown: React.FC<any> = ({
  userData,
  selectUser,
  handleSelectChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="w-[300px] h-[65px]">
        <Button variant='outline' className="w-full h-full justify-between bg-card hover:bg-background">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-normal text-muted-foreground">Jame Smith</p>
          </div>
          <span
            className={`material-symbols-outlined text-muted-foreground inline-block transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
              }`}
          >
            stat_minus_1
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <DropdownMenuItem className="flex items-center w-[300px] gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-normal text-muted-foreground">Jame Smith</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
