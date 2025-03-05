/**
 * คำอธิบาย:
 *   คอมโพเนนต์ PatrolCard ใช้สำหรับแสดงข้อมูลของการตรวจสอบสถานที่ โดยแสดงข้อมูลเช่น วันที่, สถานะ, รายการตรวจสอบ, ผู้ตรวจสอบ และอื่นๆ
 * Input:
 * - id: รหัสการตรวจสอบ
 * - date: วันที่ของการตรวจสอบ
 * - status: สถานะของการตรวจสอบ
 * - preset: รายการตรวจสอบ
 * - itemCounts: จำนวนรายการตรวจสอบ
 * - inspectors: ผู้ตรวจสอบ
 * - onRemoveSuccess: Callback หลังลบสำเร็จ
 * Output:
 * - JSX ของ Card ที่แสดงข้อมูลของ Patrol
 **/

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { patrolStatus, IUser, IPreset, IPatrol, IPatrolResult } from "@/app/type";
import {
  countPatrolResult,
  formatPatrolId,
  formatTime,
  getInitials,
  getPatrolStatusVariant,
} from "@/lib/utils";
import { fetchData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import BadgeCustom from "@/components/badge-custom";
import { UserTooltip } from "./user-tooltip";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { Popover } from "@radix-ui/react-popover";
import { TextTooltip } from "./text-tooltip";
import { useSocket } from "./socket-provider";

export interface IPatrolCard {
  id: number;
  date: string;
  status: patrolStatus;
  preset: IPreset;
  itemCounts: number;
  results: IPatrolResult[];
  inspectors: IUser[];
  onRemoveSuccess;
}

export function PatrolCard({
  id,
  date,
  status,
  preset,
  itemCounts,
  results,
  inspectors = [],
  onRemoveSuccess,
}: IPatrolCard) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState(0);
  const [fails, setFails] = useState(0);
  const [defects, setDefects] = useState(0);
  const triggerContainerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { socket, isConnected } = useSocket();

  const router = useRouter();
  const locale = useLocale();

  const getPatrolData = async () => {
    try {
      let countItems = itemCounts;
      let countFails = countPatrolResult(results).fail;
      let countDefects = countPatrolResult(results).defect;

      if (status === "completed") {
        const resultFetch: Partial<IPatrol> = await fetchData(
          "get",
          `/patrol/${id}?result=true`,
          true
        );
        if (resultFetch?.results) {
          for (const patrolResult of resultFetch.results) {
            if (patrolResult.status === false) {
              countFails++;
              if (patrolResult.defects && patrolResult.defects.length !== 0) {
                countDefects += patrolResult.defects.length;
              }
            }
          }
        }
      }
      setItems(countItems);
      setFails(countFails);
      setDefects(countDefects);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  useEffect(() => {
    getPatrolData();
    setMounted(true);
  }, [results]);

  const t = useTranslations("General");
  const a = useTranslations("Alert");

  const handleDetail = () => {
    router.push(`/${locale}/patrol/${id}/detail`);
  };

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleRemovePatrol = () => {
    setPendingAction(() => () => removePatrol());
    handleOpenDialog();
  };

  const removePatrol = async () => {
    if (status !== "pending") {
      toast({
        variant: "error",
        title: a("PatrolRemoveErrorTitle"),
        description: a("PatrolRemoveErrorDescription"),
      });
      return;
    }
    try {
      await fetchData("delete", `/patrol/${id}`, true);
      socket.emit("delete_patrol", id);
    } catch (error) {
      console.error(error);
    }
    if (onRemoveSuccess) {
      onRemoveSuccess(id); // เรียก Callback หลังลบสำเร็จ
    }
  };

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

  const TooltipContent = () => {
    return (
      <div >
        <div className="flex items-center justify-center gap-1">
          <span className="material-symbols-outlined">person_search</span>
          <p className="text-lg font-semibold">{t("InspectorList")}</p>
        </div>
        {inspectors.map((inspector, idx) => (
          <div
            key={idx}
            className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary"
          >
            <UserTooltip user={inspector}>
              <Avatar className="custom-shadow ms-[-10px] me-2.5">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                />
                <AvatarFallback id={inspector.id.toString()}>
                  {getInitials(inspector.profile.name)}
                </AvatarFallback>
              </Avatar>
            </UserTooltip>
            <p className="text-lg">{inspector.profile.name}</p>
          </div>
        ))}
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <p className="text-lg font-semibold">{t("Total")}</p>
          <p className="text-lg font-semibold">{inspectors.length}</p>
        </div>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card
      className="flex flex-col custom-shadow border-none w-full px-6 py-4 h-fit gap-4  hover:bg-secondary cursor-pointer"
      onClick={() => handleDetail()}
    >
      <CardHeader className="flex flex-row gap-0 p-0 justify-between">
        <div className="flex flex-col justify-between items-start gap-4 truncate">
          <CardDescription className="text-lg font-semibold text-muted-foreground">
            {formatTime(date, locale, false)}
          </CardDescription>
          <TextTooltip object={preset.title}>
          <CardTitle className="text-card-foreground text-2xl truncate w-[300px]">
            {preset.title}
          </CardTitle>
          </TextTooltip>
        </div>
        <BadgeCustom
          variant={getPatrolStatusVariant(status).variant}
          iconName={getPatrolStatusVariant(status).iconName}
          showIcon={true}
          hideText={true}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex text-muted-foreground items-center gap-1">
          <span className="material-symbols-outlined">description</span>
          <p className="text-lg font-normal">{formatPatrolId(id)}</p>
        </div>

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
              <div className="flex text-muted-foreground items-center">
              <span className="material-symbols-outlined me-1">
                person_search
              </span>
              {inspectors.length > 0 && (
                <div className="flex items-center me-1 truncate max-w-[190px]">
                  <p className="text-xl me-2.5 truncate">
                    {inspectors[0].profile.name}
                  </p>
                </div>
              )}
              {inspectors.map((inspector, idx) => {
                return (
                  <Avatar key={idx} className="custom-shadow ms-[-10px]">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                    />
                    <AvatarFallback id={inspector.id.toString()}>
                      {getInitials(inspector.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}

              {inspectors.length > 5 && (
                <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                  <AvatarImage src="" />
                  <span className="absolute text-card-foreground text-base font-semibold">
                    +{inspectors.length - 5}
                  </span>
                  <AvatarFallback id={"0"}></AvatarFallback>
                </Avatar>
              )}
            </div>
              </div>
            </PopoverTrigger>
          </HoverCardTrigger>

          <HoverCardContent
            className="w-full px-6 py-4"
            zIndex={0}
            side="bottom"
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipContent/>
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
          >
            <TooltipContent />
          </PopoverContent>
        </div>
      </HoverCard>
    </Popover>

      </CardContent>
      <CardFooter className="p-0 gap-0">
        <div className="flex gap-2 items-center w-full">
          <div className="flex gap-1 text-primary items-center">
            <span className="material-symbols-outlined">checklist</span>
            <p className="text-xl font-semibold">{items}</p>
          </div>
          <div className="flex gap-1 text-orange items-center">
            <span className="material-symbols-outlined">close</span>
            <p className="text-xl font-semibold">{fails}</p>
          </div>
          <div className="flex gap-1 text-destructive items-center">
            <span className="material-symbols-outlined">error</span>
            <p className="text-xl font-semibold">{defects}</p>
          </div>
          <div className="ml-auto items-center">
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="w-[45px] h-[45px]">
                  <span className="material-symbols-outlined items-center text-input">
                    more_vert
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="p-0">
                <DropdownMenuItem
                  onClick={(e) => {
                    handleDetail();
                  }}
                >
                  <h1>{t("Detail")}</h1>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePatrol();
                  }}
                >
                  <h1 className="text-destructive cursor-pointer">
                    {t("Delete")}
                  </h1>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isDialogOpen && (
            <AlertCustom
              title={a("PatrolRemoveConfirmTitle")}
              description={a("PatrolRemoveConfirmDescription")}
              primaryButtonText={t("Confirm")}
              primaryIcon="check"
              secondaryButtonText={t("Cancel")}
              backResult={handleDialogResult}
            ></AlertCustom>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export function CreatePatrolCard() {
  return (
    <Card className="bg-accent-gradient border-none flex justify-center items-center min-h-[261px] w-full h-full hover:bg-accent-gradient-hover cursor-pointer custom-shadow">
      <span className="material-symbols-outlined text-card text-8xl">
        note_add
      </span>
    </Card>
  );
}
