/**
 * คำอธิบาย:
 * คอมโพเนนต์ PatrolDetailPage ใช้สำหรับแสดงรายละเอียดของการตรวจสอบในแต่ละ Patrol โดยจะแสดงข้อมูลการตรวจที่เกี่ยวข้อง เช่น รายการตรวจ, ผลการตรวจ, การแจ้งปัญหาหรือข้อเสนอแนะ, และการจัดการสถานะต่างๆ ที่เกี่ยวข้อง
 * ฟังก์ชันต่างๆ ในคอมโพเนนต์นี้ทำงานแบบ Realtime ผ่านการเชื่อมต่อกับ Socket และแสดงผลการเปลี่ยนแปลงแบบทันทีเมื่อมีการอัปเดต
 * นอกจากนี้ยังสามารถส่งออกข้อมูลในรูปแบบ Excel เพื่อให้ผู้ใช้สามารถบันทึกหรือวิเคราะห์ข้อมูลการตรวจสอบได้
 *
 * Input:
 * - ไม่มี (ใช้ข้อมูลจาก context และ hooks ที่มีการดึงข้อมูลภายในคอมโพเนนต์นี้)
 *
 * Output:
 * - แสดงรายละเอียดของการตรวจ Patrol, ผลการตรวจ, ข้อเสนอแนะ, การจัดการสถานะการตรวจ, ฟังก์ชันสำหรับการเริ่มต้นและสิ้นสุดการตรวจ, และการส่งออกข้อมูลเป็นไฟล์ Excel
**/
"use client";
import { IDefect, IPatrolChecklist, patrolStatus } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import PatrolChecklist from "@/components/patrol-checklist";
import PatrolTimer from "@/components/patrol-timer";
import TabMenu from "@/components/tab-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePatrol } from "@/context/patrol-context";
import { exportData, getInitials, getPatrolStatusVariant } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import React, { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserTooltip } from "@/components/user-tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PatrolDetailPage() {
  const {
    patrol,
    patrolResults,
    user,
    lock,
    isAlertOpen,
    canFinish,
    countDefects,
    countFails,
    countItems,
    patrolUser,
    formatDate,
    formatId,
    formatTimeDate,
    formatZone,
    handleMouseEnter,
    handleMouseLeave,
    itemCounts,
    toggleLock,
    calculateProgress,
    handleResult,
    fetchRealtimeData,
    handleStartPatrol,
    handleFinishPatrol,
    handleOpenDialog,
    handleCloseDialog,
  } = usePatrol();
  const locale = useLocale();
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const [open, setOpen] = useState(false);
  const openType = useRef<"hover" | "click" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerContainerRef = useRef<HTMLDivElement>(null);

  itemCounts(patrol, patrolResults);
  const inspectors = patrolUser;
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

  const TooltipContent = () => {
    return (
      <div>
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
            <p className="text-lg truncate">{inspector.profile.name}</p>
          </div>
        ))}
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <p className="text-lg font-semibold">{t("Total")}</p>
          <p className="text-lg font-semibold">{inspectors.length}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* TabList และ Title */}
      <div className="flex flex-col gap-4 bg-background">
        <div className="flex sm:flex-col lg:flex-row lg:items-center justify-between sm:items-start">
          <div className="flex items-center p-0 justify-center text-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="flex hover:bg-secondary p-2">
                  <span className="material-symbols-outlined text-card-foreground w-[22px] h-[22px]">
                    error
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[400px] h-fit px-6 py-4 ">
                <AlertDialogHeader className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-muted-foreground">
                      {formatDate(patrol.date)}
                    </p>
                    <AlertDialogTitle>
                      <p className="text-2xl font-semibold">
                        {patrol.preset.title}
                      </p>
                    </AlertDialogTitle>
                  </div>

                  <AlertDialogDescription className="flex flex-col gap-2">
                    <div className="flex flex-row gap-1">
                      <span className="material-symbols-outlined">
                        description
                      </span>
                      <p className="text-muted-foreground text-xl font-semibold">
                        {formatId(patrol.id)}
                      </p>
                    </div>

                    <div className="flex flex-row gap-1">
                      {patrol.status === "completed" && (
                        <span className="material-symbols-outlined">
                          event_available
                        </span>
                      )}

                      {patrol.status === "completed" ? (
                        <div className="text-muted-foreground font-extrabold text-lg">
                          <p className="text-xl font-semibold text-muted-foreground">
                            {formatDate(patrol.endTime) +
                              " " +
                              formatTimeDate(patrol.startTime) +
                              " - " +
                              formatTimeDate(patrol.endTime)}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex flex-row gap-1 items-start">
                      <span className="material-symbols-outlined text-2xl text-muted-foreground p-0">
                        location_on
                      </span>
                      <p className="flex items-center text-base text-muted-foreground">
                        {formatZone(patrol) || "No zones available"}
                      </p>
                    </div>

                    <div className="flex flex-row gap-1 ">
                      <span className="material-symbols-outlined text-2xl text-muted-foreground ">
                        data_info_alert
                      </span>
                      <p className="gap-1 text-base text-muted-foreground ">
                        {patrol.preset.description}
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col h-full justify-start w-full">
              <p className="text-2xl font-bold mb-1 text-start">
                {patrol.preset.title}
              </p>
              <div className="w-[300px]">
                <Progress value={calculateProgress()} />
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:w-full sm:justify-between lg:w-fit items-center gap-2">
            {patrol && (
              <PatrolTimer
                launchDate={patrol.startTime}
                patrolStatus={patrol.status}
                patrolDuration={patrol.duration}
              />
            )}

            <BadgeCustom
              iconName={getPatrolStatusVariant(patrol.status).iconName}
              showIcon={true}
              showTime={false}
              variant={getPatrolStatusVariant(patrol.status).variant}
            >
              {s(patrol.status)}
            </BadgeCustom>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <TabMenu id={id.toString()} />
          <div className="flex items-center gap-2">
            <Button
              variant={"secondary"}
              onClick={() => router.push(`/${locale}`)}
            >
              {t("Back")}
            </Button>
            {(() => {
              let iconName: string;
              let text: string;
              let variant:
                | "link"
                | "default"
                | "secondary"
                | "destructive"
                | "success"
                | "fail"
                | "outline"
                | "ghost"
                | "primary"
                | null
                | undefined;
              let disabled: boolean;
              let handleFunction: any;
              switch (patrol.status as patrolStatus) {
                case "completed":
                  variant = "outline";
                  iconName = "ios_share";
                  text = "Export";
                  disabled = false;
                  handleFunction = () => {};
                  break;
                case "on_going":
                  variant = "primary";
                  iconName = "Check";
                  text = "Finish";
                  disabled = false;
                  handleFunction = () => {
                    handleFinishPatrol();
                  };
                  break;
                case "scheduled":
                  variant = "primary";
                  iconName = "cached";
                  text = "Start";
                  disabled = false;
                  handleFunction = () => {
                    handleStartPatrol();
                  };
                  break;
                case "pending":
                  variant = "primary";
                  iconName = "cached";
                  text = "Start";
                  disabled = true;
                  handleFunction = () => {};
                  break;
                default:
                  variant = "primary";
                  iconName = "cached";
                  text = "Start";
                  disabled = true;
                  handleFunction = () => {};
                  break;
              }
              return (
                <div>
                  {patrol.status === "completed" && isAlertOpen ? (
                    <AlertDialog open={isAlertOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={variant}
                          onClick={handleOpenDialog}
                          disabled={disabled}
                          className="flex flex-row items-center gap-2"
                        >
                          <span className="material-symbols-outlined ">
                            {iconName}
                          </span>
                          {t(text)}
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="w-[400px] h-fit px-6 py-4 ">
                        <AlertDialogHeader className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold text-muted-foreground">
                              {formatDate(patrol.date)}
                            </p>
                            <AlertDialogTitle>
                              <p className="text-2xl font-semibold">
                                {patrol.preset.title}
                              </p>
                            </AlertDialogTitle>
                          </div>

                          <AlertDialogDescription className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1">
                              <span className="material-symbols-outlined">
                                description
                              </span>
                              <p className="text-muted-foreground text-xl font-semibold">
                                {formatId(patrol.id)}
                              </p>
                            </div>

                            <Popover
                              open={open}
                              onOpenChange={(isOpen) => {
                                if (!isOpen) handleClose();
                              }}
                            >
                              <HoverCard
                                open={open && openType.current === "hover"}
                                onOpenChange={(isHoverOpen) => {
                                  if (
                                    !isHoverOpen &&
                                    openType.current === "hover"
                                  )
                                    handleClose();
                                }}
                              >
                                <div
                                  ref={triggerContainerRef}
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <HoverCardTrigger asChild>
                                    <PopoverTrigger asChild>
                                      <div
                                        className="cursor-pointer"
                                        onClick={handleClick}
                                      >
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
                                              <Avatar
                                                key={idx}
                                                className="custom-shadow ms-[-10px]"
                                              >
                                                <AvatarImage
                                                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                                                />
                                                <AvatarFallback
                                                  id={inspector.id.toString()}
                                                >
                                                  {getInitials(
                                                    inspector.profile.name
                                                  )}
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
                                              <AvatarFallback
                                                id={"0"}
                                              ></AvatarFallback>
                                            </Avatar>
                                          )}
                                        </div>
                                      </div>
                                    </PopoverTrigger>
                                  </HoverCardTrigger>

                                  <HoverCardContent
                                    className="w-[300px] px-6 py-4"
                                    zIndex={0}
                                    side="bottom"
                                    align="start"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <TooltipContent />
                                  </HoverCardContent>
                                  <PopoverContent
                                    className="w-[300px] z-[100] px-6 py-4"
                                    side="bottom"
                                    align="start"
                                    onInteractOutside={(e) => {
                                      const target = e.target as HTMLElement;
                                      const isUserTooltipContent =
                                        target?.closest?.(
                                          "[data-radix-tooltip-content]"
                                        );
                                      const isUserTooltipTrigger =
                                        target?.closest?.(".user-tooltip");

                                      if (
                                        isUserTooltipContent ||
                                        isUserTooltipTrigger
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                  >
                                    <TooltipContent />
                                  </PopoverContent>
                                </div>
                              </HoverCard>
                            </Popover>

                            <CardFooter className="p-0 gap-0">
                              <div className="flex gap-2 items-center w-full">
                                <div className="flex gap-1 text-primary items-center">
                                  <span className="material-symbols-outlined">
                                    checklist
                                  </span>
                                  <p className="text-xl font-semibold">
                                    {countItems}
                                  </p>
                                </div>
                                <div className="flex gap-1 text-orange items-center">
                                  <span className="material-symbols-outlined">
                                    close
                                  </span>
                                  <p className="text-xl font-semibold">
                                    {countFails}
                                  </p>
                                </div>
                                <div className="flex gap-1 text-destructive items-center">
                                  <span className="material-symbols-outlined">
                                    error
                                  </span>
                                  <p className="text-xl font-semibold">
                                    {countDefects}
                                  </p>
                                </div>
                              </div>
                            </CardFooter>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => handleCloseDialog()}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-4 text-lg font-bold"
                            onClick={() => {
                              exportData(patrol, patrolResults);
                              handleCloseDialog();
                              toast({
                                variant: "success",
                                title: a("ExportReportPatrolTitle"),
                                description: a("ExportReportPatrolDescription"),
                              });
                            }}
                          >
                            <span className="material-symbols-outlined text-2xl me-2">
                              ios_share
                            </span>
                            Export
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : patrol.status === "on_going" ? (
                    canFinish ? (
                      <Button
                        variant={variant}
                        onClick={handleOpenDialog}
                        disabled={disabled}
                      >
                        <span className="material-symbols-outlined">
                          {iconName}
                        </span>
                        {t(text)}
                      </Button>
                    ) : (
                      <Button
                        variant={lock ? "secondary" : variant}
                        disabled={disabled}
                        onClick={toggleLock}
                      >
                        <span className="material-symbols-outlined">
                          {lock ? "lock_open" : "lock"}
                        </span>
                        {lock ? t("Unlock") : t("Lock")}
                      </Button>
                    )
                  ) : (
                    <Button
                      variant={variant}
                      onClick={() => handleOpenDialog()}
                      disabled={disabled}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        {iconName}
                      </span>
                      {t(text)}
                    </Button>
                  )}
                  {patrol.status === "scheduled" && isAlertOpen ? (
                    <AlertCustom
                      title={a("PatrolStartConfirmTitle")}
                      description={a("PatrolStartConfirmDescription")}
                      primaryButtonText={t("Confirm")}
                      primaryIcon="check"
                      secondaryButtonText={t("Cancel")}
                      backResult={(result) => {
                        if (result) {
                          handleStartPatrol();
                        }
                        handleCloseDialog();
                      }}
                    />
                  ) : patrol.status === "on_going" && isAlertOpen ? (
                    <AlertCustom
                      title={a("PatrolFinishConfirmTitle")}
                      description={a("PatrolFinishConfirmDescription")}
                      primaryButtonText={t("Confirm")}
                      primaryIcon="check"
                      secondaryButtonText={t("Cancel")}
                      backResult={(result) => {
                        if (result) {
                          handleFinishPatrol();
                        }
                        handleCloseDialog();
                      }}
                    />
                  ) : null}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <ScrollArea className="h-full w-full rounded-md flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-224px)]">
        {patrol.patrolChecklists.map((pc: IPatrolChecklist) => (
          <div className="rounded-md mb-4">
            {user?.profile.name === pc.inspector.profile.name ? (
              <PatrolChecklist
                handleResult={handleResult}
                patrolStatus={patrol.status}
                patrolChecklist={pc}
                disabled={patrol.status === "on_going" && !lock ? false : true}
                patrolResults={patrolResults}
                response={(defect: IDefect) => {
                  fetchRealtimeData(defect, "create");
                }}
              />
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
