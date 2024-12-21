'use client'

import { IDefect } from '@/app/type'
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
import {
    IItem,
    IItemZone,
    IPatrolResult,
} from "@/app/type";
import React, { useState } from "react";
import { fetchData } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface AlertDefectProps {
    defect?: IDefect,
    item?: IItem,
    type: "edit" | "report" | "resolve",
    patrolResults?: IPatrolResult[],
    result?: { inspectorId: number, itemId: number; zoneId: number; status: boolean },
    response: (defect: IDefect) => void;
}

export default function AlertDefect({ defect, item, type, patrolResults, result, response }: AlertDefectProps) {
    const disabled = false
    const z = useTranslations("Zone");

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [defectDescription, setDefectDescription] = useState<string>("");

    const handleDefectDescription = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { value } = event.target;
        setDefectDescription(value);
    };

    const handleCreateDefect = async (
        name: string,
        description: string,
        type: string,
        userId: number,
        patrolResultId: number | null,
        supervisorId: number,
        files: File[]
    ) => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("status", "reported");
        formData.append("defectUserId", userId.toString());
        formData.append("patrolResultId", patrolResultId.toString());
        formData.append("supervisorId", supervisorId.toString());

        files.forEach((file) => {
            formData.append("imageFiles", file);
        });
        try {
            const createDefect = await fetchData(
                "post",
                "/defect",
                true,
                formData,
                true
            );
            response(createDefect)
        } catch (error) {
            console.error("Error creating defect:", error);
        }
    };

    const handleEditDefect = async (
        id: number,
        name: string,
        description: string,
        type: string,
        status: string,
        userId: number,
        patrolResultId: number | null,
        supervisorId: number,
        files: File[]
    ) => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("status", status);
        formData.append("defectUserId", userId.toString());
        formData.append("patrolResultId", patrolResultId.toString());
        formData.append("supervisorId", supervisorId.toString());

        files.forEach((file) => {
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
            response(updateDefect)
        } catch (error) {
            console.error("Error edit defect:", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
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

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger
                    disabled={disabled}
                >
                    <Button variant={"outline"} size={"lg"} >
                        <span className="material-symbols-outlined pr-2 ">
                            {type === "edit" ? "edit" : type === "resolve" ? "published_with_changes" : "campaign"}
                        </span>
                        {type === "edit" ? "Edit" : type === "resolve" ? "Resolved" : "Report"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-semibold">
                            {type === "edit" ? "Edit Defect" : type === "resolve" ? "Resolve Defect" : "Report Defect"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                            Please provide details for the defect
                        </AlertDialogDescription>
                        <div className="flex flex-col justify-start">
                            <p className="font-semibold">
                                {type === "report" ? item.name : defect.name}
                            </p>
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-2xl me-2">
                                    location_on
                                </span>
                                <p className="font-semibold me-2">
                                    Zone
                                </p>
                                <p>
                                    <p>
                                        {type === "report"
                                            ? item.itemZones.map((itemZone: IItemZone) => {
                                                return result.zoneId === itemZone.zone.id
                                                    ? z(itemZone.zone.name)
                                                    : null; // 
                                            })
                                            : z(defect.patrolResult.itemZone.zone.name)}
                                    </p>
                                </p>
                            </div>

                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-2xl me-2">
                                    badge
                                </span>
                                <p className="font-semibold me-2">
                                    Supervisor
                                </p>
                                <p>
                                    {type === "report"
                                        ? item.itemZones.map((itemZone: IItemZone) => {
                                            return result.zoneId === itemZone.zone.id
                                                ? itemZone.zone.supervisor.profile.name
                                                : null; // 
                                        })
                                        : defect.patrolResult.itemZone.zone.supervisor.profile.name}
                                </p>
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
                                onClick={() => {
                                    type === "report" ?
                                        handleCreateDefect(
                                            item.name,
                                            defectDescription,
                                            item.type,
                                            result.inspectorId,
                                            patrolResults.find((patrolResult: IPatrolResult) =>
                                                result.itemId === patrolResult.itemId && result.zoneId === patrolResult.zoneId
                                            )?.id || null,
                                            item.itemZones.find((itemZone: IItemZone) =>
                                                result.zoneId === itemZone.zone.id
                                            )?.zone.supervisor.id || null,
                                            selectedFiles
                                        )
                                        :
                                        handleEditDefect(
                                            defect.id,
                                            defect.name,
                                            defectDescription,
                                            defect.type,
                                            defect.status,
                                            defect.userId,
                                            defect.patrolResultId,
                                            defect.patrolResult.itemZone.zone.supervisor.id,
                                            selectedFiles
                                        )
                                }
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
        </div>
    )
}
