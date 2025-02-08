/**
 * คำอธิบาย:
 *  หน้าที่แสดงรายการ Defect ทั้งหมดของ Patrol ที่เลือก
 *
 * Input:
 * - ไม่มี
 * Output:
 * - หน้าที่แสดงรายการ Defect ทั้งหมดของ Patrol ที่เลือก
 * - แสดงชื่อ Patrol และ Progress ของ Patrol
 * - แสดงปุ่ม Start หรือ Finish ของ Patrol ตามสถานะของ Patrol
 * - สามารถตรวจสอบ Defect และแก้ไข Defect ได้
 **/

"use client";
import { IDefect, patrolStatus } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import Loading from "@/components/loading";
import PatrolTimer from "@/components/patrol-timer";
import ReportDefect from "@/components/report-defect";
import TabMenu from "@/components/tab-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePatrol } from "@/context/patrol-context";
import { exportData, getInitials, getPatrolStatusVariant } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardFooter } from "@/components/ui/card";

import React from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "@/hooks/use-toast";
import NotFound from "@/components/not-found";

export default function Page() {
  const {
    patrol,
    patrolResults,
    lock,
    mounted,
    defects,
    canFinish,
    countDefects,
    countFails,
    countItems,
    patrolUser,
    isAlertOpen,
    isHovered,
    formatDate,
    formatId,
    handleMouseEnter,
    handleMouseLeave,
    handleOpenDialog,
    handleCloseDialog,
    toggleLock,
    calculateProgress,
    handleStartPatrol,
    fetchRealtimeData,
    handleFinishPatrol,
  } = usePatrol();
  const locale = useLocale();
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const s = useTranslations("Status");

  const inspectors = patrolUser;

  return (
    <div className="flex flex-col gap-4">
      {/* TabList และ Title */}
      <div className="fixed flex flex-col w-full pr-12 pb-4 gap-4 bg-background pt-4 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center p-0 justify-center text-center gap-2">
            <Button variant="ghost" className="flex hover:bg-secondary p-2">
              <span className="material-symbols-outlined text-card-foreground w-[22px] h-[22px]">
                error
              </span>
            </Button>
            <div className="flex flex-col h-full justify-start w-full">
              <p className="text-2xl font-bold mb-1">{patrol.preset.title}</p>
              <Progress value={calculateProgress()} />
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <PatrolTimer
              launchDate={patrol.startTime}
              patrolStatus={patrol.status}
              patrolDuration={patrol.duration}
            />

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
                  handleFunction = () => { };
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
                  handleFunction = () => {
                    handleStartPatrol();
                  };
                  break;
                default:
                  variant = "primary";
                  iconName = "cached";
                  text = "Start";
                  disabled = true;
                  handleFunction = () => { };
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

                            <HoverCard open={isHovered}>
                              <HoverCardTrigger
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                asChild
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
                                          id={inspector.id?.toString()}
                                        >
                                          {getInitials(inspector.profile.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                    );
                                  })}

                                  {inspectors.length > 5 && (
                                    <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                                      <AvatarImage src="" />
                                      <span className="absolute text-card-foreground text-[16px] font-semibold">
                                        +{inspectors.length - 5}
                                      </span>
                                      <AvatarFallback id={"0"}></AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="flex flex-col w-fit border-none gap-4 px-6 py-4 custom-shadow">
                                <div className="flex items-center justify-center gap-1">
                                  <span className="material-symbols-outlined">
                                    person_search
                                  </span>
                                  <p className="text-lg font-semibold">
                                    {t("InspectorList")}
                                  </p>
                                </div>
                                {inspectors.map((inspector, idx) => {
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary"
                                    >
                                      <Avatar className="custom-shadow ms-[-10px] me-2.5">
                                        <AvatarImage
                                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                                        />
                                        <AvatarFallback
                                          id={inspector.id?.toString()}
                                        >
                                          {getInitials(inspector.profile.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <p className="text-lg">
                                        {inspector.profile.name}
                                      </p>
                                    </div>
                                  );
                                })}
                                <div className="flex items-center justify-between w-full text-muted-foreground">
                                  <p className="text-lg font-semibold">
                                    {t("Total")}
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {inspectors.length}
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>

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
                        onClick={handleFunction}
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
                      onClick={handleOpenDialog}
                      disabled={disabled}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        {iconName}
                      </span>
                      {t(text)}
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-[133px] gap-4 rounded-md ">
        {defects.length === 0 ? (
          <NotFound
            icon="campaign"
            title="NoDefectsPatrol" 
            description="NoDefectsPatrolDescription" 
          />
        ) : (
          defects.map((defect: IDefect) => {
            return (
              <div className="" key={defect.id}>
                <ReportDefect
                  defect={defect}
                  page={"patrol-view-report"}
                  response={(defect: IDefect) => {
                    fetchRealtimeData(defect, "edit");
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
