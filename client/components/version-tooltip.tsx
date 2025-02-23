import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { IUser } from "@/app/type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatTime, getInitials, getUserVariant } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import BadgeCustom from "./badge-custom";
import { UserTooltip } from "./user-tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export interface IUserTooltip {
  object: any;
  children: ReactNode;
}

export function VersionTooltip({ object, children }: IUserTooltip) {
  const t = useTranslations("General");
  const locale = useLocale();
  const [hoverState, setHoverState] = useState<{
    [key: string]: { isHovered: boolean; isClicked: boolean };
  }>({});

  const handleMouseEnter = (id: string) => {
    setHoverState((prev) => ({
      ...prev,
      [id]: { ...prev[id], isHovered: true },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverState((prev) => ({
      ...prev,
      [id]: { ...prev[id], isHovered: false },
    }));
  };

  const handleClick = (
    id: string,
    e: React.MouseEvent | React.SyntheticEvent
  ) => {
    e.stopPropagation();
    setHoverState((prev) => ({
      ...prev,
      [id]: { ...prev[id], isClicked: !prev[id]?.isClicked },
    }));
  };

  const cardRef = useRef(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setHoverState((prev) => ({
        ...prev,
        export: { ...prev["export"], isClicked: false },
      }));
    }
  };

  useEffect(() => {
    // Add event listener for click outside
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  const handleMouseDown = (e) => {
    e.stopPropagation();
    handleClick("export", e);  // When HoverCardContent is clicked, handle it here
  };



  return (
    <HoverCard
      open={hoverState["export"]?.isClicked || hoverState["export"]?.isHovered}
    >
      <div ref={cardRef}>
        <HoverCardTrigger
          onClick={(e) => {
            e.stopPropagation();
            handleClick("export", e);
          }}
          onMouseEnter={() => handleMouseEnter("export")}
          onMouseLeave={() => handleMouseLeave("export")}
          asChild
        >
          {children}
        </HoverCardTrigger>

        {hoverState["export"]?.isClicked || hoverState["export"]?.isHovered ? (
          <HoverCardContent        
          className="w-full " zIndex={0} side="bottom" align="start" onBlur={handleMouseDown}>
            <span className="text-card-foreground text-lg font-bold flex items-center ">
              <span className="material-symbols-outlined mr-1">history</span>
              {t("Version")} {object.version}
            </span>
            <div className="flex flex-col justify-start items-start ">
              {object.user.profile ? (
                <div className="flex flex-row justify-center items-center gap-2 text-muted-foreground">
                  <div className="text-muted-foreground w-fit">
                    {t("UpdateBy")}
                  </div>
                  <UserTooltip user={object.user}>
                    <Avatar>
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${object.user.profile.image?.path}`}
                      />
                      <AvatarFallback id={object.user.id.toString()}>
                        {getInitials(object.user.profile.name)}
                      </AvatarFallback>
                    </Avatar>
                  </UserTooltip>

                  {(object as any).user.profile.name}
                </div>
              ) : (
                <Skeleton className="h-12 w-12 rounded-full" />
              )}
              <div className="flex gap-2 text-muted-foreground">
                <div className="text-muted-foreground">{t("UpdateAt")}</div>
                {formatTime(object.updatedAt, locale)}
              </div>
            </div>
            <div className="flex justify-between w-full">
              <div className="font-bold text-lg text-muted-foreground">
                {t("Total")}
              </div>
              <div className="font-bold text-lg text-muted-foreground">
                {object.version} {t("Version")}
              </div>
            </div>
          </HoverCardContent>
        ) : null}
      </div>
    </HoverCard>
  );
}
