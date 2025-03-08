/**
 * คำอธิบาย:
 * Input:

 * Output:
 **/

import { ReactNode, useEffect, useRef } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export interface IUserTooltip {
  user: IUser;
  children: ReactNode;
}

export function UserTooltip({ user, children }: IUserTooltip) {
  const triggerContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("General");
  const [open, setOpen] = useState(false);
  const openType = useRef<'hover' | 'click' | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (openType.current !== 'click') {
      timeoutRef.current = setTimeout(() => {
        openType.current = 'hover';
        setOpen(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (openType.current === 'hover') {
      setOpen(false);
      openType.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // เคลียร์ timeout ของ hover ทันทีเมื่อมีการคลิก
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    openType.current = 'click';
    setOpen(true); // เปิด Popover โดยตรง
  };

  const handleClose = () => {
    setOpen(false);
    openType.current = null;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (openType.current === 'hover') {
        handleClose();
      } else if (openType.current === 'click') {
        if (window.innerWidth <= 768) {
          handleClose();
        }
      }
    };
    const handleWheel = () => {
      handleClose();
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);




  useEffect(() => {
    const handleScroll = () => {
      handleClose();
    };

    // Detect both window scroll and Scroll Area scroll
    const scrollArea = triggerContainerRef.current?.closest(
      '[data-radix-scroll-area-viewport], .scroll-area' // Add your Scroll Area's class/attribute
    );

    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const TooltipContent = ({ object }: { object: any }) => {
    return (
      <div className="flex justify-start items-start">
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
        <div className="text-card-foreground flex flex-col w-[280px]">
          {user.profile.name ? (
            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold truncate w-full">
                {user.profile.name}
              </div>
              <div>
                <p
                  className={`text-sm text-muted-foreground truncate ${user.email ? "" : "text-red-500"
                    }`}
                >
                  {user.email ? user.email : "no email provided"}
                </p>
                <p
                  className={`text-sm text-muted-foreground truncate${user.profile.tel ? "" : "text-red-500"
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
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <HoverCard
        open={open && openType.current === 'hover'}
        onOpenChange={(isHoverOpen) => {
          if (!isHoverOpen && openType.current === 'hover') handleClose();
        }}
      >
        <div
          ref={triggerContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <HoverCardTrigger asChild>
            <PopoverTrigger asChild>
              <div className="cursor-pointer" onClick={handleClick}>
                {children}
              </div>
            </PopoverTrigger>
          </HoverCardTrigger>

          <HoverCardContent
            className="w-full px-6 py-4"
            zIndex={9999}
            side="bottom"
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipContent object={user} />
          </HoverCardContent>
          <PopoverContent
            className="w-full z-[100] px-6 py-4"
            side="bottom"
            align="start"
            onInteractOutside={(e) => {
              const target = e.target as HTMLElement;
              const isUserTooltipContent = target?.closest?.('[data-radix-tooltip-content]');
              const isUserTooltipTrigger = target?.closest?.('.user-tooltip');

              if (isUserTooltipContent || isUserTooltipTrigger) {
                e.preventDefault();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipContent object={user} />
          </PopoverContent>
        </div>
      </HoverCard>
    </Popover>
  );
}
