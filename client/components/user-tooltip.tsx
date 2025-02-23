/**
 * คำอธิบาย:
 * Input:

 * Output:
 **/

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { IUser } from "@/app/type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials, getUserVariant } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { useTranslations } from "next-intl";
import BadgeCustom from "./badge-custom";
import { useState } from "react";

export interface IUserTooltip {
  user: IUser;
  children: ReactNode;
}

export function UserTooltip({ user, children }: IUserTooltip) {
  const t = useTranslations("General");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible((prev) => !prev); // Toggle tooltip visibility
  };
  return (
    <TooltipProvider>
      <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevents click from bubbling
              toggleTooltip(); // Toggles tooltip visibility
            }}
            className=" cursor-pointer"
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="flex h-[150px] w-full bg-card border-none custom-shadow"
        >
          <div className="p-4 flex justify-start items-start">
            {/* Avatar Section */}
            <div className="pr-4">
              {user.profile.name ? (
                <Avatar className="custom-shadow h-[60px] w-[60px]">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${user.profile.image?.path}`}
                  />
                  <AvatarFallback id={user.id.toString()} className="text-lg">
                    {getInitials(user.profile.name)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="w-[22px] h-[22px] rounded-full bg-input" />
              )}
            </div>

            {/* User Info Section */}
            <div className="text-card-foreground flex flex-col w-full">
              {user.profile.name ? (
                <div className="flex flex-col gap-2">
                  <div className="text-lg truncate w-full">
                    {user.profile.name}
                  </div>
                  <div>
                    <p
                      className={`text-sm text-muted-foreground truncate ${
                        user.email ? "" : "text-red-500"
                      }`}
                    >
                      {user.email ? user.email : "no email provided"}
                    </p>
                    <p
                      className={`text-sm text-muted-foreground truncate${
                        user.profile.tel ? "" : "text-red-500"
                      }`}
                    >
                      {user.profile.tel ? user.profile.tel : "no tel provided"}
                    </p>
                  </div>
                  <BadgeCustom
                    variant={getUserVariant(user.role).variant}
                    iconName={getUserVariant(user.role).iconName}
                    showIcon={true}
                    shape="square"
                  >
                    {t(getUserVariant(user.role).variantName)}
                  </BadgeCustom>
                </div>
              ) : (
                <div className="text-destructive">
                  <div className="truncate w-full">{user.username}</div>
                  <div className="text-[14px]">{t("NoProfileProvided")}</div>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
