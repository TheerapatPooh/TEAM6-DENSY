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
import { Skeleton } from './ui/skeleton';

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
    const t = useTranslations("General");

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

    const handleResolveDefect = async (
        id: number,
        files: File[]
    ) => {
        const formData = new FormData();

        formData.append("supervisorId",
            defect.patrolResult.itemZone.zone.supervisor.profile.userId.toString()
        );
        formData.append("status", "resolved")
        files.forEach((file) => {
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
            response(resolveDefect)
        } catch (error) {
            console.error("Error resolve defect:", error);
        }
    }


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
    
    if(!patrolResults && type === "report"){
        return <Skeleton/>
    }

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger
                    disabled={disabled}
                >
                    <Button variant={type === "resolve" ? "primary" : type === "edit" ? "primary" : "outline"} size={"lg"} >
                        <span className="material-symbols-outlined pr-2 ">
                            {type === "edit" ? "edit" : type === "resolve" ? "published_with_changes" : "campaign"}
                        </span>
                        {t(type === "edit" ? "Edit" : type === "resolve" ? "Resolve" : "Report")}
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
                                        :
                                        defect.patrolResult.itemZone.zone.supervisor.profile.name
                                    }
                                </p>
                            </div>
                        </div>
                    </AlertDialogHeader>

                    {type === "resolve" ? null :
                        <div className='flex flex-col gap-1'>
                            <div className='text-sm font-semibold'>
                                Detail
                            </div>
                            <Textarea
                                onChange={handleDefectDescription}
                                className="h-[100px] bg-secondary border-none"
                                placeholder="Details..."
                            />
                        </div>
                    }

                    <div className="flex flex-col justify-between w-full">
                        <div className='text-sm font-semibold'>
                            Image
                        </div>
                        <div className='flex flex-row py-1 pr-2 gap-4'>
                            <div className='flex flex-col gap-1 flex-1'>
                                <div
                                    className="flex h-full w-full rounded-[10px] bg-secondary justify-center items-center"
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
                            </div>
                            <ScrollArea className="h-72 overflow-y-auto gap-5 rounded-md flex-1">
                                <div className="flex flex-col gap-2 w-full">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className=" flex flex-row justify-between px-4 py-2 w-full bg-secondary rounded-md">
                                            <div className='flex flex-row gap-3'>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <span className="material-symbols-outlined">
                                                        image
                                                    </span>
                                                </div>
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
                                            </div>
                                            <Button
                                                variant={"ghost"}
                                                className="flex flex-col justify-center items-center w-[40px] h-[40px]"
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
                    </div>

                    <AlertDialogFooter>
                        <div className="flex items-end justify-end gap-[10px]">
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    switch (type) {
                                        case "report":
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
                                            );
                                            break;

                                        case "resolve":
                                            handleResolveDefect(defect.id, selectedFiles);
                                            break;

                                        case "edit":
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
                                            );
                                            break;

                                        default:
                                            console.error("Invalid type");
                                    }
                                }}
                                disabled={
                                    (type === "resolve" && (selectedFiles.length === 0 || disabled)) ||
                                    (type !== "resolve" && (!defectDescription || selectedFiles.length === 0 || disabled))
                                }
                                className={`bg-primary hover:bg-primary/70 
        ${(type === "resolve" && selectedFiles.length === 0) ||
                                        (type !== "resolve" && (!defectDescription || selectedFiles.length === 0))
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
        </div >
    )
}
