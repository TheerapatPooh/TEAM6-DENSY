"use client";

import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  IItem,
  itemType,
  IItemZone,
  IPatrolChecklist,
  IPatrolResult,
  IUser,
  IDefect,
} from "@/app/type";
import React, { useState, useEffect } from "react";
import { fetchData, getInitials, getItemTypeVariant } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "./ui/skeleton";
import { formatTime } from "@/lib/utils";
import AlertDefect from "./alert-defect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatrolChecklistProps {
  user: IUser;
  patrolChecklist: IPatrolChecklist;
  disabled: boolean;
  handleResult: (result: {
    inspectorId: number;
    itemId: number;
    zoneId: number;
    status: boolean;
  }) => void;
  results: Array<{ itemId: number; zoneId: number; status: boolean }>;
  patrolResult: IPatrolResult[];
  response?: (defect: IDefect) => void
}

export default function PatrolChecklist({
  user,
  patrolChecklist,
  disabled,
  handleResult,
  results = [],
  patrolResult,
  response,
}: PatrolChecklistProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [comment, setComment] = useState<string>("")
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const param = useParams()

  const checkStatus = (itemId: number, zoneId: number) => {
    const result = results.find(
      (res) => res.itemId === itemId && res.zoneId === zoneId
    );
    return result ? result.status : null;
  };

  useEffect(() => {
    if (results.length > 0) {
      const initialStatus = results.reduce((acc, result) => {
        acc[`${result.itemId}-${result.zoneId}`] = result.status;
        return acc;
      }, {} as { [key: string]: boolean | null });

      setResultStatus(initialStatus);
    }
  }, [results]);

  const handleCreateComment = async (
    message: string,
    patrolResultId: number,
    supervisorId: number
  ) => {
    const data = {
      message: message,
      patrolResultId: patrolResultId,
      supervisorId: supervisorId
    };
    try {
      await fetchData(
        "post",
        `/patrol/${param.id}/comment`,
        true,
        data,
      );
      window.location.reload();
    } catch (error) {
      console.error("Error creating Comment:", error);
    }
  };

  const getExistingResult = (itemId: number, zoneId: number) => {
    const result = patrolResult.find(
      (res) => res.itemId === itemId && res.zoneId === zoneId
    );
    return result;
  };

  const fetchRealtimeData = (defect: IDefect) => {
    response(defect)
  }

  useEffect(() => {
    if (patrolResult && patrolChecklist.checklist.items) {
      const initialStatus = patrolChecklist.checklist.items.reduce((acc, item) => {
        item.itemZones.flatMap((itemZone: IItemZone) => {
          const matchingResult = patrolResult.find((result) => {
            return result.itemId === item.id && result.zoneId === itemZone.zone.id;
          });
          // ถ้ามี matchingResult และ status ไม่เป็น null ให้เก็บค่า status
          if (matchingResult && matchingResult.status !== null) {
            acc[`${item.id}-${itemZone.zone.id}`] = matchingResult.status;
          }

        });
        return acc;
      }, {} as { [key: string]: boolean | null });

      setResultStatus(initialStatus); // เก็บค่า resultStatus ที่อัพเดตแล้ว
    }
  }, [patrolChecklist.checklist, patrolResult]);

  const handleClick = (inspectorId: number, itemId: number, zoneId: number, status: boolean) => {
    if (!disabled) {
      handleResult({ inspectorId, itemId, zoneId, status });
      setResultStatus((prev) => ({
        ...prev,
        [`${itemId}-${zoneId}`]: status,
      }));
    }
  };

  useEffect(() => {
    if (patrolChecklist) {
      setMounted(true)
    }
  }, [])

  if (!mounted) {
    return (
      <Skeleton className="flex h-16 items-center">
        <Skeleton className="flex h-10 ms-4 w-56 bg-card"></Skeleton>
      </Skeleton>
    )
  }

  return (
    <div className="bg-card rounded-md px-4 py-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="hover:no-underline text-2xl font-bold py-2">
            {patrolChecklist.checklist.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="material-symbols-outlined">person_search</span>
                <p className="text-lg font-semibold">{t("inspector")}</p>
              </div>
              <div className="flex items-center gap-1">
                <Avatar className="custom-shadow h-[35px] w-[35px]">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${patrolChecklist.inspector.profile.image?.path}`}
                  />
                  <AvatarFallback id={patrolChecklist.inspector.id.toString()}>
                    {getInitials(patrolChecklist.inspector.profile.name)}
                  </AvatarFallback>
                </Avatar>

                <p className="text-card-foreground text-lg">{patrolChecklist.inspector.profile.name}</p>
              </div>
            </div>
            <div className="ps-2">
              {patrolChecklist.checklist.items?.map((item: IItem) => (

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pe-2">
                        <p className="text-xl font-semibold">{item.name}</p>
                        <BadgeCustom
                          variant={getItemTypeVariant(item.type as itemType).variant}
                          iconName={getItemTypeVariant(item.type as itemType).iconName}
                          showIcon={true}
                          shape="square"
                        >
                          {s(item.type)}
                        </BadgeCustom>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col py-2 gap-2">
                      {item.itemZones.flatMap((itemZones: IItemZone) => {
                        const status = checkStatus(item.id, itemZones.zone.id);
                        const existingResult = getExistingResult(
                          item.id,
                          itemZones.zone.id
                        );
                        return (
                          <div key={itemZones.zone.id} className="bg-background rounded-md p-2">
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1 mb-2">
                                  <span className="material-symbols-outlined text-muted-foreground">
                                    location_on
                                  </span>
                                  <p className="font-semibold text-lg text-muted-foreground me-1">
                                    {t("Zone")}
                                  </p>
                                  <p className="text-lg">{z(itemZones.zone.name)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <span className="material-symbols-outlined">engineering</span>
                                    <p className="text-lg font-semibold">{t("supervisor")}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Avatar className="custom-shadow h-[35px] w-[35px]">
                                      <AvatarImage
                                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${itemZones.zone.supervisor.profile.image?.path}`}
                                      />
                                      <AvatarFallback id={itemZones.zone.supervisor.id.toString()}>
                                        {getInitials(itemZones.zone.supervisor.profile.name)}
                                      </AvatarFallback>
                                    </Avatar>

                                    <p className="text-card-foreground text-lg">{itemZones.zone.supervisor.profile.name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 pe-2">
                                <Button
                                  variant={
                                    resultStatus[`${item.id}-${itemZones.zone.id}`] ===
                                      true
                                      ? "success"
                                      : "secondary"
                                  }
                                  className={`w-[155px] ${resultStatus === null
                                    ? "bg-secondary text-card-foreground"
                                    : ""
                                    }
                                                                    ${existingResult?.status ===
                                      true
                                      ? "bg-[#27BC31] hover:bg-[#27BC31]"
                                      : ""
                                    }
                                                                    ${existingResult?.status ===
                                      false
                                      ? "bg-secondary hover:bg-secondary"
                                      : ""
                                    }
                                                                    ${disabled
                                      ? " cursor-not-allowed opacity-50"
                                      : ""
                                    }
                                                                    `}
                                  onClick={() => {
                                    if (!existingResult.status === true || existingResult.status === null) {
                                      handleClick(user.id, item.id, itemZones.zone.id, true);
                                    }
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    check
                                  </span>
                                  <p>{t("Yes")}</p>
                                </Button>
                                <Button
                                  variant={
                                    resultStatus[`${item.id}-${itemZones.zone.id}`] ===
                                      false
                                      ? "fail"
                                      : "secondary"
                                  }
                                  className={`w-[155px] ${resultStatus === null
                                    ? "bg-secondary text-card-foreground"
                                    : ""
                                    }
                                                                    ${existingResult?.status ===
                                      false
                                      ? "bg-destructive hover:bg-destructive"
                                      : ""
                                    }
                                                                    ${existingResult?.status ===
                                      true
                                      ? "bg-secondary hover:bg-secondary"
                                      : ""
                                    }
                                                                    ${disabled
                                      ? " cursor-not-allowed opacity-50"
                                      : ""
                                    }
                                                                    `}
                                  onClick={() => {
                                    if (!existingResult.status === false || existingResult.status === null) {
                                      handleClick(user.id, item.id, itemZones.zone.id, false);
                                    }
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    close
                                  </span>
                                  <p>{t("No")}</p>
                                </Button>
                              </div>
                            </div>

                            {(status === false ||
                              existingResult?.status === false) && (
                                <div className="mt-4 flex flex-col items-start">
                                  {existingResult.comments.map((comment) => (
                                    //Comment Patrol
                                    <div className="flex bg-secondary rounded-md w-full p-2 mb-2 gap-2">
                                      <p className="text-muted-foreground font-bold text-lg">{formatTime(comment.timestamp)}</p>

                                      <div className="flex items-end">
                                        <p className="text-lg">{comment.message}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <AlertDefect
                                    item={item}
                                    type={"report"}
                                    result={existingResult}
                                    patrolResults={patrolResult}
                                    response={(defect: IDefect) => (
                                      fetchRealtimeData(defect)
                                    )}
                                  />
                                  <Textarea
                                    className="h-[94px] mt-3 bg-secondary border-none"
                                    placeholder={`${t("Comment")}...`}
                                    disabled={disabled}
                                    onChange={(e) => setComment(e.target.value)}
                                  />
                                  <div className="flex justify-end w-full mt-2">
                                    <Button variant={"primary"} size={"lg"} disabled={disabled} onClick={() => handleCreateComment(comment, existingResult.id, itemZones.zone.supervisor.id)}>
                                      <span className="material-symbols-outlined me-2">
                                        send
                                      </span>
                                      {t("Send")}
                                    </Button>
                                  </div>
                                </div>
                              )}
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
