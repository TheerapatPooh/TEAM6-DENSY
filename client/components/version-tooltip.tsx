/**
 * คำอธิบาย:
 *   คอมโพเนนต์ที่ใช้สำหรับแสดงข้อมูลของเวอร์ชั่น
 *   โดยจะแสดงข้อมูลของเวอร์ชั่นที่เลือกในรูปแบบของ Tooltip
 * Input: 
 * - ข้อมูลของเวอร์ชั่น
 * - ข้อมูลของเวอร์ชั่นที่เลือก
 * Output:
 * - JSX ของเวอร์ชั่นที่เลือกในรูปแบบของ Tooltip
**/

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import { UserTooltip } from "@/components/user-tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface IUserTooltip {
  object: any;
  children: ReactNode;
}

export function VersionTooltip({ object, children }: IUserTooltip) {
  const triggerContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("General");
  const locale = useLocale();
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
      // Original first effect's logic
      if (openType.current === 'hover') {
        handleClose();
      } else if (openType.current === 'click' && window.innerWidth <= 768) {
        handleClose();
      }
      
      // Second effect's logic
      handleClose();
    };
  
    const handleWheel = () => {
      handleClose();
    };
  
    // Find scroll area parent
    const scrollArea = triggerContainerRef.current?.closest(
      '[data-radix-scroll-area-viewport], .scroll-area'
    );
  
    // Add event listeners
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
  
    return () => {
      // Cleanup listeners
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []); // Keep dependency array empty since all functions are stable



  const TooltipContent = ({ object }: { object: any }) => {
    return (
      <div className="flex flex-col gap-4">
        <span className="text-card-foreground text-lg font-bold flex items-center">
          <span className="material-symbols-outlined mr-1">history</span>
          {t("Version")} {object.version}
        </span>
        <div className="flex flex-col justify-start items-start">
          {object.user.profile ? (
            <div className="flex flex-row justify-center items-center gap-2 text-muted-foreground">
              <div className="text-muted-foreground text-base font-semibold w-fit">
                {t("UpdateBy")}
              </div>
              <UserTooltip user={object.user}>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${object.user.profile.image?.path}`}
                    />
                    <AvatarFallback id={object.user.id.toString()}>
                      {getInitials(object.user.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {object.user.profile.name}
                </div>
              </UserTooltip>
            </div>
          ) : (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}
          <div className="flex gap-2 text-muted-foreground">
            <div className="text-muted-foreground text-base font-semibold">{t("UpdateAt")}</div>
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
            zIndex={0}
            side="bottom"
            align="start"
            onBlur={() => handleClose()}
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipContent object={object} />
          </HoverCardContent>
          <PopoverContent
            className="w-full z-[100] px-6 py-4"
            side="bottom"
            align="start"
            onBlur={() => handleClose()}
            onInteractOutside={(e) => {
              const target = e.target as HTMLElement;
              const isUserTooltipContent = target?.closest?.('[data-radix-tooltip-content]');
              const isUserTooltipTrigger = target?.closest?.('.user-tooltip');

              if (isUserTooltipContent || isUserTooltipTrigger) {
                e.preventDefault();
              }
            }}
          >
            <TooltipContent object={object} />
          </PopoverContent>
        </div>
      </HoverCard>
    </Popover>
  );
}
