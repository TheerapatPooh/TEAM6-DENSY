/**
 * คำอธิบาย:
 * Input:

 * Output:
 **/

import { ReactNode, useEffect, useRef } from "react";
import { IZone } from "@/app/type";
import { useTranslations } from "next-intl";import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ScrollArea } from "./ui/scroll-area";

export interface IZoneTooltip {
  zonesName?: IZone[] | string[];
  zones?: IZone[];
  children: ReactNode;
}

export function ZoneTooltip({ zonesName,zones, children }: IZoneTooltip) {
  const t = useTranslations("General");
  const z = useTranslations("Zone");

  const [open, setOpen] = useState(false);
  const openType = useRef<"hover" | "click" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (openType.current !== "click") {
      timeoutRef.current = setTimeout(() => {
        openType.current = "hover";
        setOpen(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (openType.current === "hover") {
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
    openType.current = "click";
    setOpen(true); // เปิด Popover โดยตรง
  };

 

  
  const triggerContainerRef = useRef<HTMLDivElement>(null);


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



  const TooltipContent =({ }: { object: any }) => {
    return (
      <div className="custom-shadow rounded-md px-2.5 py-1.5 w-fit flex flex-col items-start justify-start">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          {t("Zone")}
        </h3>
        <ScrollArea className="h-32 rounded-md">
          {(zonesName ?? zones)?.map((zone, index, arr) => (
            <div key={index} className="text-sm text-left">
              -{" "}
              <span className={zone.userId || zonesName ? "" : "text-destructive"}>
              {z(zone.name || zone)}
                {index < arr.length - 1 && ", "}
              </span>
            </div>
          ))}
        </ScrollArea>
      </div>
    );
  };
  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <HoverCard
        open={open && openType.current === "hover"}
        onOpenChange={(isHoverOpen) => {
          if (!isHoverOpen && openType.current === "hover") handleClose();
        }}
      >
        <div ref={triggerContainerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <HoverCardTrigger asChild>
            <PopoverTrigger asChild>
              <div className="cursor-pointer" onClick={handleClick}>
                {children}
              </div>
            </PopoverTrigger>
          </HoverCardTrigger>

          <HoverCardContent
            className="w-full p-0 bg-card-foreground text-card"
            zIndex={9999}
            side="bottom"
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
          </HoverCardContent>
          <PopoverContent
            className="w-full p-0 bg-card-foreground text-card"
            side="bottom"
            align="start"
            onInteractOutside={(e) => {
              const target = e.target as HTMLElement;
              const isUserTooltipContent = target?.closest?.(
                "[data-radix-tooltip-content]"
              );
              const isUserTooltipTrigger = target?.closest?.(".user-tooltip");

              if (isUserTooltipContent || isUserTooltipTrigger) {
                e.preventDefault();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipContent object={zonesName} />
          </PopoverContent>
        </div>
      </HoverCard>
    </Popover>
  );
}
