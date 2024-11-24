"use client";

import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import BadgeCustom from "@/components/badge-custom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
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
} from "./ui/alert-dialog";
import {
  IItem,
  itemType,
  IItemZone,
  IPatrol,
  IPatrolChecklist,
  IPatrolResult,
  IUser,
  IZone,
  IChecklist,
} from "@/app/type";
import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/api";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";

// TYPE

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
}

export default function PatrolChecklist({
  user,
  patrolChecklist,
  disabled,
  handleResult,
  results = [],
  patrolResult,
}: PatrolChecklistProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [resultStatus, setResultStatus] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [defectDescription, setDefectDescription] = useState<string>("");
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


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCreateComment = async (
    message: string,
    patrolResultId: number,
  ) => {
    const data = {
      message: message,
      patrolResultId: patrolResultId,
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

  const handleCreateDefect = async (
    name: string,
    description: string,
    type: string,
    userId: number,
    patrolResultId: number | null,
    files: File[]
  ) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("status", "reported");
    formData.append("defectUserId", userId.toString());
    formData.append("patrolResultId", patrolResultId.toString());

    files.forEach((file) => {
      formData.append("imageFiles", file);
    });
    try {
      await fetchData(
        "post",
        "/defect",
        true,
        formData,
        true
      );
      window.location.reload();
    } catch (error) {
      console.error("Error creating defect:", error);
    }
  };

  const handleDefectDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setDefectDescription(value);
  };
  const handleButtonClick = (event: React.FormEvent) => {
    event.preventDefault();
    document.getElementById("file-input")?.click();
  };

  const getBadgeVariant = (type: itemType) => {
    switch (type) {
      case "safety":
        return "mint";
      case "environment":
        return "orange";
      case "maintenance":
        return "red";
      default:
        return "red";
    }
  };

  const getExistingResult = (itemId: number, zoneId: number) => {
    const result = patrolResult.find(
      (res) => res.itemId === itemId && res.zoneId === zoneId
    );

    return result;
  };

  useEffect(() => {
    if (patrolResult && patrolChecklist.checklist.item) {
      const initialStatus = patrolChecklist.checklist.item.reduce((acc, item) => {
        item.itemZone.flatMap((itemZone: IItemZone) => {
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
    <div className="bg-secondary rounded-md px-4 py-2">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="hover:no-underline text-2xl font-semibold py-2">
            {patrolChecklist.checklist.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-rows items-center gap-2 text-muted-foreground text-base ps-4 py-2  border-t-2 ">
              <span className="material-symbols-outlined">engineering</span>
              <p className="font-semibold">{t("Inspector")}</p>
              <p className="text-card-foreground">{patrolChecklist.inspector.profile.name}</p>
            </div>
            <div className="ps-2">
              {patrolChecklist.checklist.item?.map((item: IItem) => (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pe-2">
                        <p className="text-xl font-semibold">{item.name}</p>
                        <BadgeCustom
                          variant={getBadgeVariant(item.type as itemType)}
                        >
                          {s(item.type)}
                        </BadgeCustom>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col py-2 gap-2">
                      {item.itemZone.flatMap((itemZone: IItemZone) => {
                        const status = checkStatus(item.id, itemZone.zone.id);
                        const existingResult = getExistingResult(
                          item.id,
                          itemZone.zone.id
                        );
                        return (
                          <div key={itemZone.zone.id} className="bg-card rounded-md p-2">
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="material-symbols-outlined">
                                    location_on
                                  </span>
                                  <p className="font-semibold text-lg">
                                    {t("Zone")}
                                  </p>
                                  <p className="text-lg">{z(itemZone.zone.name)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined">
                                    badge
                                  </span>
                                  <p className="font-semibold text-lg">
                                    {t("Supervisor")}
                                  </p>
                                  <p className="text-lg">
                                    {itemZone.zone.supervisor.profile.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 pe-2">
                                <Button
                                  variant={
                                    resultStatus[`${item.id}-${itemZone.zone.id}`] ===
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
                                      handleClick(user.id, item.id, itemZone.zone.id, true);
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
                                    resultStatus[`${item.id}-${itemZone.zone.id}`] ===
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
                                      handleClick(user.id, item.id, itemZone.zone.id, false);
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
                                  {existingResult.comment.map((comment) => (
                                    <div className="flex bg-secondary rounded-md w-full p-2 mb-2 gap-2">
                                      <div>
                                        <div className="flex justify-start items-center gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${comment.user.profile.image?.path}`} />
                                            <AvatarFallback>
                                              {getInitials(comment.user.profile.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <p className="text-bold">{comment.user.profile.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground font-bold text-lg">{comment.timestamp}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-end">
                                        <p className="text-lg">{comment.message}</p>
                                      </div>

                                    </div>
                                  ))}
                                  <AlertDialog>
                                    <AlertDialogTrigger
                                      disabled={disabled}
                                    >
                                      <Button
                                        variant={"outline"}
                                        size={"lg"}
                                        disabled={disabled}
                                      >
                                        <span className="material-symbols-outlined ">
                                          campaign
                                        </span>
                                        {t("Report")}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl font-semibold">
                                          Report Defect
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                                          Please provide details for the defect
                                        </AlertDialogDescription>
                                        <div className="flex flex-col justify-start">
                                          <p className="font-semibold">
                                            {item.name}
                                          </p>
                                          <div className="flex items-center">
                                            <span className="material-symbols-outlined text-2xl me-2">
                                              location_on
                                            </span>
                                            <p className="font-semibold me-2">
                                              Zone
                                            </p>
                                            <p>{itemZone.zone.name}</p>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="material-symbols-outlined text-2xl me-2">
                                              badge
                                            </span>
                                            <p className="font-semibold me-2">
                                              Supervisor
                                            </p>
                                            <p>{itemZone.zone.supervisor.profile.name}</p>
                                          </div>
                                        </div>
                                      </AlertDialogHeader>
                                      <Textarea
                                        onChange={handleDefectDescription}
                                        className="h-[100px] mt-3 bg-secondary border-none"
                                        placeholder="Details..."
                                      />
                                      <div className="flex flex-row justify-between gap-2">
                                        <div
                                          className="flex h-full w-full max-w-[230px] rounded-[10px] bg-secondary justify-center items-center"
                                          onDragOver={handleDragOver}
                                          onDrop={handleDrop}
                                        >
                                          <div className="flex p-8 flex-col items-center justify-center">
                                            <span className="material-symbols-outlined text-[48px] font-normal">
                                              upload
                                            </span>
                                            <div className="text-center mt-2">
                                              Drag & Drop file
                                            </div>
                                            <div className="text-center mt-1">
                                              Or
                                            </div>
                                            <div className="mt-2">
                                              <input
                                                type="file"
                                                id="file-input"
                                                style={{ display: "none" }}
                                                multiple
                                                onChange={handleFileChange}
                                              />
                                              <Button
                                                variant={"outline"}
                                                onClick={handleButtonClick}
                                              >
                                                <span className="material-symbols-outlined mr-1">
                                                  browser_updated
                                                </span>
                                                Browse
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        <ScrollArea className="  h-72 overflow-y-auto gap-5 rounded-md w-full">
                                          <div className="flex flex-col gap-2 w-[215px]">
                                            {selectedFiles.map((file, index) => (
                                              <div
                                                key={index}
                                                className=" flex p-2 w-full bg-secondary rounded-md"
                                              >
                                                <span className="material-symbols-outlined">
                                                  image
                                                </span>
                                                <div className="flex items-center gap-2 ">
                                                  <div className="flex flex-col">
                                                    <TooltipProvider>
                                                      <Tooltip>
                                                        <TooltipTrigger asChild>
                                                          <div className=" truncate w-[145px]">
                                                            {file.name}
                                                          </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-foreground">
                                                          <div className=" w-full ">
                                                            {file.name}
                                                          </div>
                                                        </TooltipContent>
                                                      </Tooltip>
                                                    </TooltipProvider>

                                                    <p className="text-sm font-semibold text-muted-foreground">
                                                      {(file.size / 1024).toFixed(
                                                        2
                                                      )}{" "}
                                                      KB
                                                    </p>
                                                  </div>
                                                </div>
                                                <Button
                                                  variant={"ghost"}
                                                  className="w-[40px] h-[40px]"
                                                  onClick={() =>
                                                    handleRemoveFile(index)
                                                  }
                                                >
                                                  <span className="material-symbols-outlined text-destructive">
                                                    delete
                                                  </span>
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </ScrollArea>
                                      </div>

                                      <AlertDialogFooter>
                                        <div className="flex items-end justify-end gap-[10px]">
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleCreateDefect(
                                                item.name,
                                                defectDescription,
                                                item.type,
                                                patrolChecklist.inspector.id,
                                                existingResult?.id ?? null,
                                                selectedFiles
                                              )
                                            }
                                            disabled={
                                              !defectDescription ||
                                              selectedFiles.length === 0 ||
                                              disabled
                                            }
                                            className={`bg-primary hover:bg-primary/70 ${!defectDescription ||
                                              selectedFiles.length === 0
                                              ? "opacity-50 cursor-not-allowed"
                                              : ""
                                              }`}
                                          >
                                            <span className="material-symbols-outlined text-2xl me-2">
                                              send
                                            </span>
                                            Send
                                          </AlertDialogAction>
                                        </div>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Textarea
                                    className="h-[94px] mt-3 bg-secondary border-none"
                                    placeholder={`${t("Comment")}...`}
                                    disabled={disabled}
                                    onChange={(e) => setComment(e.target.value)}
                                  />
                                  <div className="flex justify-end w-full mt-2">
                                    <Button variant={"primary"} size={"lg"} disabled={disabled} onClick={() => handleCreateComment(comment, existingResult.id)}>
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
