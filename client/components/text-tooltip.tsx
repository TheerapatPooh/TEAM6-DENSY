import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface IUserTooltip {
  object: any;
  children: ReactNode;
}

export function TextTooltip({ object, children }: IUserTooltip) {
  const triggerContainerRef = useRef<HTMLDivElement>(null);
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
  // Modify the existing wheel handler
  const handleWheel = useCallback(() => {
    handleClose();
  }, []);

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

  const handleClose = () => {
    setOpen(false);
    openType.current = null;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (openType.current === "hover") {
        handleClose();
      } else if (openType.current === "click") {
        if (window.innerWidth <= 768) {
          handleClose();
        }
      }
    };
    handleWheel;

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      handleClose();
    };

    // Detect both window scroll and Scroll Area scroll
    const scrollArea = triggerContainerRef.current?.closest(
      "[data-radix-scroll-area-viewport], .scroll-area" // Add your Scroll Area's class/attribute
    );

    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const TooltipContent = ({ object }: { object: any }) => {
    return (
        <div className="flex flex-col gap-2 w-auto h-auto text-sm max-w-[500px] max-h-[500px] overflow-auto">
        {JSON.stringify(object, null, 2)
          .split("\n")
          .map((line, index) => (
            <p key={index} className="break-words whitespace-pre-wrap">
              {line}
            </p>
          ))}
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
            className="w-full px-2.5 py-1.5 bg-card-foreground text-card"
            zIndex={0}
            side="bottom"
            align="start"
            onClick={(e) => e.stopPropagation()}
          ></HoverCardContent>
          <PopoverContent
            className="w-full z-[100] px-2.5 py-1.5 bg-card-foreground text-card"
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
          >
            <TooltipContent object={object} />
          </PopoverContent>
        </div>
      </HoverCard>
    </Popover>
  );
}
