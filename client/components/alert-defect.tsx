/**
 * คำอธิบาย:
 *   คอมโพเนนต์ AlertDefect ใช้สำหรับแสดง Alert ที่เกี่ยวกับการรายงาน, แก้ไข หรือ แจ้งปัญหาได้โดยมีการแสดงรายละเอียดของปัญหาและสามารถแนบไฟล์รูปภาพได้
 * Input:
 * - defect: ข้อมูลของปัญหา
 * - item: ข้อมูลของรายการ
 * - type: ประเภทของ Alert ที่ต้องการแสดง
 * - patrolResults: ข้อมูลของผลการตรวจสอบ
 * - result: ข้อมูลของผลการตรวจสอบ
 * - response: ฟังก์ชันที่รับค่า IDefect จากการสร้างหรือแก้ไขปัญหา
 * Output:
 * - JSX ของ AlertDefect ที่มีหัวข้อ, คำอธิบาย, 2 ปุ่ม Action และสามารถแนบไฟล์รูปภาพได้
 **/

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defectStatus, IDefect } from "@/app/type";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { IItem, IItemZone, IPatrolResult } from "@/app/type";
import React, { useEffect, useState } from "react";
import { fetchData, getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserTooltip } from "./user-tooltip";
interface IAlertDefect {
  userId?: number;
  defect?: IDefect;
  item?: IItem;
  type: "edit" | "report" | "resolve" | "edit-resolve";
  patrolResults?: IPatrolResult[];
  result?: {
    id: number;
    inspectorId: number;
    itemId: number;
    zoneId: number;
    status: boolean;
    supervisorId?: number;
  };
  response: (defect: IDefect) => void;
}

export default function AlertDefect({
  userId,
  defect,
  item,
  type,
  patrolResults,
  result,
  response,
}: IAlertDefect) {
  const disabled = false;
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations("Zone");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [defectDescription, setDefectDescription] = useState<string>("");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertDefectOpen, setAlertDefectOpen] = useState(true);

  const [detailError, setDetailError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const closeAlertDefect = () => {
    setAlertDefectOpen(false);
  };

  const openAlertDefect = () => {
    setAlertDefectOpen(true);
  };

  const handleOpenDialog = () => {
    setIsAlertOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAlertOpen(false);
  };

  const handleDefectDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setDefectDescription(value);
  };

  // ตรวจสอบว่าไฟล์ทั้งหมดเป็นไฟล์รูปภาพ
  const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

  const handleCreateDefect = async (
    name: string,
    description: string,
    type: string,
    userId: number,
    patrolResultId: number | null,
    supervisorId: number,
    files: File[]
  ) => {
    setDetailError(null);
    setFileError(null);
    if (!description || !files || files?.length === 0) {
      setDetailError(!description ? a("ReportDefectErrorMissingDetail") : null);
      setFileError(
        !files || files?.length === 0
          ? a("ReportDefectErrorMissingImage")
          : null
      );
      toast({
        variant: "error",
        title: a("ReportDefectMissingField"),
        description:
          (!description && !files) || files?.length === 0
            ? a("ReportDefectMissingDetailAndImage")
            : !description
            ? a("ReportDefectMissingDetail")
            : a("ReportDefectMissingImage"),
      });
      return;
    }
    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFileError(a("ReportDefectErrorInvalidImageMessage"));
      toast({
        variant: "error",
        title: a("ReportDefectErrorInvalidImage"),
        description: a("ReportDefectErrorInvalidImageMessage"),
      });
      return;
    }
    const defectData = {
      name,
      description,
      type,
      defectUserId: userId?.toString(),
      patrolResultId: patrolResultId.toString(),
      supervisorId: supervisorId.toString(),
    };

    try {
      const createDefect = await fetchData(
        "post",
        "/defect",
        true,
        defectData,
        false
      );
      const id = createDefect.id;

      // ส่งไฟล์ใน request แยก
      const formData = new FormData();
      formData.append("status", "reported");
      files.forEach((file) => formData.append("imageFiles", file));

      const defectImage = await fetchData(
        "put",
        `/defect/${id}/upload`,
        true,
        formData,
        true // เป็น FormData
      );
      if (defectImage) {
        toast({
          variant: "success",
          title: a("ReportDefectTitle"),
          description: a("ReportDefectDescription"),
        });
        closeAlertDefect();
      }

      createDefect.images = defectImage.images;
      createDefect.images = defectImage.images;
      response(createDefect);
      setDetailError(null);
      setFileError(null);
      setSelectedFiles(null);
      setDefectDescription(null);
    } catch (error) {
      console.error("Error creating defect:", error);
    }
  };

  const handleEditDefect = async (
    id: number,
    name: string,
    description: string,
    type: string,
    userId: number,
    patrolResultId: number | null,
    supervisorId: number,
    files: File[]
  ) => {
    setDetailError(null);
    setFileError(null);
    if (!description || !files || files?.length === 0) {
      setDetailError(!description ? a("ReportDefectErrorMissingDetail") : null);
      setFileError(
        !files || files?.length === 0
          ? a("ReportDefectErrorMissingImage")
          : null
      );
      toast({
        variant: "error",
        title: a("ReportDefectMissingField"),
        description:
          (!description && !files) || files?.length === 0
            ? a("ReportDefectMissingDetailAndImage")
            : !description
            ? a("ReportDefectMissingDetail")
            : a("ReportDefectMissingImage"),
      });
      return;
    }

    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFileError(a("ReportDefectErrorInvalidImageMessage"));
      toast({
        variant: "error",
        title: a("ReportDefectErrorInvalidImage"),
        description: a("ReportDefectErrorInvalidImageMessage"),
      });
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("status", "reported");
    formData.append("defectUserId", userId.toString());
    formData.append("supervisorId", supervisorId.toString());
    formData.append("deleteExistingImages", "true");

    files?.forEach((file) => {
      formData.append("imageFiles", file);
    });
    try {
      const updateDefect = await fetchData(
        "put",
        `/defect/${id}`,
        true,
        formData,
        true
      );

      if (updateDefect) {
        toast({
          variant: "success",
          title: a("EditReportDefectTitle"),
          description: a("EditReportDefectDescription"),
        });
        closeAlertDefect();
      }
      setDetailError(null);
      setFileError(null);
      setSelectedFiles(null);
      setDefectDescription(null);
      response(updateDefect);
    } catch (error) {
      console.error("Error edit defect:", error);
    }
  };

  const handleResolveDefect = async (
    id: number,
    files: File[],
    type: string,
    deleteExistingImages: boolean
  ) => {
    setDetailError(null);
    setFileError(null);
    if (!files || files?.length === 0) {
      setFileError(
        !files || files?.length === 0
          ? a("ReportDefectErrorMissingImage")
          : null
      );
      toast({
        variant: "error",
        title: a("ReportDefectMissingField"),
        description: a("ReportDefectMissingImage"),
      });
      return;
    }

    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFileError(a("ReportDefectErrorInvalidImageMessage"));
      toast({
        variant: "error",
        title: a("ReportDefectErrorInvalidImage"),
        description: a("ReportDefectErrorInvalidImageMessage"),
      });
      return;
    }

    const formData = new FormData();

    formData.append("status", "resolved");
    formData.append("defectUserId", defect.userId.toString());
    formData.append("supervisorId", defect.supervisor.id.toString());
    formData.append("deleteExistingImages", "true");
    files?.forEach((file) => {
      formData.append("imageFiles", file);
    });

    try {
      const resolveDefect = await fetchData(
        "put",
        `/defect/${id}`,
        true,
        formData,
        true
      );
      if (resolveDefect) {
        if (type === "resolve") {
          toast({
            variant: "success",
            title: a("DefectResolveTitle"),
            description: a("DefectResolveDescription"),
          });
        }
        if (type === "edit") {
          toast({
            variant: "success",
            title: a("EditDefectResolveTitle"),
            description: a("EditDefectResolveDescription"),
          });
        }
        closeAlertDefect();
      }
      setDetailError(null);
      setFileError(null);
      setSelectedFiles(null);
      response(resolveDefect);
    } catch (error) {
      console.error("Error resolve defect:", error);
    }
  };

  const handleSendClick = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleOpenDialog();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([
        ...(selectedFiles ?? []),
        ...Array.from(event.target.files),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
  };

  const handleButtonClick = (event: React.FormEvent) => {
    event.preventDefault();
    document.getElementById("file-input")?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (!patrolResults && type === "report") {
    return <Skeleton />;
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger disabled={disabled}>
          <Button
            variant={
              type === "resolve" || type === "edit-resolve"
                ? "primary"
                : type === "edit"
                ? "primary"
                : "outline"
            }
            size={"lg"}
            onClick={() => openAlertDefect()}
          >
            <span className="material-symbols-outlined pr-2 ">
              {type === "edit" || type === "edit-resolve"
                ? "edit"
                : type === "resolve"
                ? "published_with_changes"
                : "campaign"}
            </span>
            {t(
              type === "edit" || type === "edit-resolve"
                ? "Edit"
                : type === "resolve"
                ? "Resolve"
                : "Report"
            )}
          </Button>
        </AlertDialogTrigger>
        {isAlertDefectOpen && (
          <AlertDialogContent className="sm:w-[90%] xl:w-[60%]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                {t(
                  type === "edit"
                    ? "EditDefect"
                    : type === "resolve"
                    ? "ResolveDefect"
                    : type === "edit-resolve"
                    ? "EditResolveDefect"
                    : "ReportDefect"
                )}
              </AlertDialogTitle>
              <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                {t(
                  type === "edit"
                    ? "PleaseProvideDetailsForTheDefect"
                    : type === "resolve"
                    ? "PleaseProvideResolvedTheDefect"
                    : type === "edit-resolve"
                    ? "EditResolvedTheDefect"
                    : "PleaseProvideDetailsForTheDefect"
                )}
              </AlertDialogDescription>
              <div className="flex flex-col justify-start">
                <p className="font-semibold">
                  {type === "report" ? item.name : defect.name}
                </p>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-2xl me-2">
                    location_on
                  </span>
                  <p className="font-semibold me-2">{t("Zone")}</p>
                  <p>
                    <p>
                      {type === "report"
                        ? item.itemZones.map((itemZone: IItemZone) => {
                            return result.zoneId === itemZone.zone.id
                              ? z(itemZone.zone.name)
                              : null;
                          })
                        : z(defect.patrolResult.itemZone.zone.name)}
                    </p>
                  </p>
                </div>

                <div className="flex items-center">
                  <span className="material-symbols-outlined text-2xl me-2">
                    engineering
                  </span>

                  <p className="font-semibold me-2">{t("supervisor")}</p>
                  {type === "report" ? (
                    item.itemZones.map((itemZone: IItemZone) => {
                      if (result.zoneId === itemZone.zone.id) {
                        const patrolResult = patrolResults.find(
                          (patrolResult: IPatrolResult) =>
                            patrolResult.zoneId === itemZone.zone.id
                        );
                        const supervisor = patrolResult?.supervisor;
                        return (
                          <div className="flex items-center gap-1">
                            <UserTooltip user={supervisor}>
                              <Avatar className="custom-shadow h-[35px] w-[35px]">
                                <AvatarImage
                                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${supervisor.profile.image?.path}`}
                                />
                                <AvatarFallback id={supervisor.id.toString()}>
                                  {getInitials(supervisor.profile.name)}
                                </AvatarFallback>
                              </Avatar>
                            </UserTooltip>
                            <span className="text-card-foreground text-lg truncate">
                              {supervisor.profile.name}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <div className="flex items-center gap-1">
                      <UserTooltip user={defect.supervisor}>
                        <Avatar className="custom-shadow h-[35px] w-[35px]">
                          <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.supervisor.profile.image?.path}`}
                          />
                          <AvatarFallback id={defect.supervisor.id.toString()}>
                            {getInitials(defect.supervisor.profile.name)}
                          </AvatarFallback>
                        </Avatar>
                      </UserTooltip>

                      <span className="text-card-foreground text-lg truncate">
                        {defect.supervisor.profile.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogHeader>

            {type === "resolve" || type === "edit-resolve" ? null : (
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold">{t("Detail")}</div>
                <Textarea
                  onChange={handleDefectDescription}
                  className="h-[100px] bg-secondary border-none"
                  placeholder={`${t("Detail")}...`}
                />
                {detailError && (
                  <p className="text-sm font-light text-destructive italic mt-1">
                    {detailError}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1 justify-between w-full">
              <div className="text-sm font-semibold">{t("Image")}</div>
              <div className="grid grid-cols-2 pr-2 gap-4">
                <div className="flex flex-col gap-1 flex-1 rounded-md custom-shadow">
                  <div
                    className="flex h-full w-full rounded-[10px] bg-secondary justify-center items-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex p-8 flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] font-normal text-primary">
                        upload
                      </span>
                      <div className="text-center mt-2">
                        {t("Drag&DropFile")}
                      </div>
                      <div className="text-center mt-1">{t("Or")}</div>
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
                          className="custom-shadow"
                          onClick={handleButtonClick}
                        >
                          <span className="material-symbols-outlined mr-1">
                            browser_updated
                          </span>
                          {t("Browse")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <ScrollArea className="sm:h-64 overflow-y-auto gap-5 rounded-md flex-1">
                  <div className="flex flex-col gap-2 w-full">
                    {selectedFiles?.map((file, index) => (
                      <div
                        key={index}
                        className=" flex flex-row justify-between px-4 py-2 w-full bg-secondary rounded-md"
                      >
                        <div className="flex flex-row gap-3">
                          <div className="flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-card-foreground">
                              image
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <div className="flex flex-col">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className=" truncate sm:w-56 xl:w-72">
                                      {file.name}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-foreground">
                                    <div className=" w-full ">{file.name}</div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <p className="text-sm font-semibold text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={"ghost"}
                          className="flex flex-col justify-center items-center w-[40px] h-[40px]"
                          onClick={() => handleRemoveFile(index)}
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
              {fileError && (
                <p className="text-sm font-light text-destructive italic mt-1">
                  {fileError}
                </p>
              )}
            </div>

            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-[10px]">
                <AlertDialogCancel
                  onClick={() => {
                    setDetailError(null);
                    setFileError(null);
                    setSelectedFiles(null);
                    setDefectDescription(null);
                  }}
                >
                  {t("Cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    handleSendClick(event);
                  }}
                  className={"bg-primary"}
                >
                  <span className="material-symbols-outlined text-2xl me-2">
                    send
                  </span>
                  {t("Send")}
                </AlertDialogAction>
              </div>
            </AlertDialogFooter>

            {isAlertOpen && (
              <AlertCustom
                title={
                  type === "report"
                    ? a("ReportDefectConfirmTitle")
                    : type === "edit"
                    ? a("ReportEditConfirmTitle")
                    : type === "edit-resolve"
                    ? a("ReportEditResolveConfirmTitle")
                    : a("ReportResolveConfirmTitle")
                }
                description={
                  type === "report"
                    ? a("ReportDefectConfirmDescription")
                    : type === "edit"
                    ? a("ReportEditConfirmDescription")
                    : type === "edit-resolve"
                    ? a("ReportEditResolveConfirmDescription")
                    : a("ReportResolveConfirmDescription")
                }
                primaryButtonText={t("Confirm")}
                primaryIcon="check"
                secondaryButtonText={t("Cancel")}
                backResult={(backResult) => {
                  if (backResult) {
                    switch (type) {
                      case "report":
                        handleCreateDefect(
                          item.name,
                          defectDescription,
                          item.type,
                          result.inspectorId || userId,
                          patrolResults.find(
                            (patrolResult: IPatrolResult) =>
                              result.id === patrolResult.id
                          )?.id || null,
                          patrolResults.find(
                            (patrolResult: IPatrolResult) =>
                              result.zoneId === patrolResult.zoneId
                          )?.supervisor.id || null,
                          selectedFiles
                        );
                        break;

                      case "resolve":
                        handleResolveDefect(
                          defect.id,
                          selectedFiles,
                          "resolve",
                          false
                        );
                        break;

                      case "edit":
                        handleEditDefect(
                          defect.id,
                          defect.name,
                          defectDescription,
                          defect.type,
                          defect.userId,
                          defect.patrolResultId,
                          defect.patrolResult.itemZone.zone.supervisor.id,
                          selectedFiles
                        );
                        break;

                      case "edit-resolve":
                        handleResolveDefect(
                          defect.id,
                          selectedFiles,
                          "edit",
                          true
                        );
                        break;

                      default:
                        console.error("Invalid type");
                    }
                  }
                  handleCloseDialog();
                }}
              />
            )}
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
