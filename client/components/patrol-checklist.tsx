'use client';

import { Button } from './ui/button';
import BadgeCustom from "@/components/badge-custom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from './ui/alert-dialog';
import { Checklist, Item, ItemType, PatrolResult, Zone } from '@/app/type';
import React, { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';

// TYPE


interface PatrolChecklistProps {
    checklist: Checklist;
    disabled: boolean
    handleResult: (result: { itemId: number, zoneId: number, status: boolean }) => void;
    results: Array<{ itemId: number, zoneId: number, status: boolean }>;
    patrolResult: PatrolResult[];
}

export default function PatrolChecklist({ checklist, disabled, handleResult, results = [], patrolResult }: PatrolChecklistProps) {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resultStatus, setResultStatus] = useState<{ [key: string]: boolean | null }>({});

    const checkStatus = (itemId: number, zoneId: number) => {
        const result = results.find(res => res.itemId === itemId && res.zoneId === zoneId);
        return result ? result.status : null;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleButtonClick = (event: React.FormEvent) => {
        event.preventDefault();
        document.getElementById('file-input')?.click();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const getBadgeVariant = (type: ItemType) => {
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

    useEffect(() => {
        if (patrolResult && checklist.item) {
            console.log("patrolResult:", patrolResult); // ตรวจสอบค่าของ patrolResult
            console.log("checklist item:", checklist.item); // ตรวจสอบค่าของ checklist.item

            const initialStatus = checklist.item.reduce((acc, item) => {
                item.zone.forEach((zone) => {
                    const matchingResult = patrolResult.find(
                        (result) => {
                            console.log("result.itemId:", result.itemId, "item.id:", item.id); // Debug ดูค่า itemId
                            console.log("result.zoneId:", result.zoneId, "zone.id:", zone.id); // Debug ดูค่า zoneId
                            return result.itemId === item.id && result.zoneId === zone.id;
                        }
                    );

                    // ถ้ามี matchingResult และ status ไม่เป็น null ให้เก็บค่า status
                    if (matchingResult && matchingResult.status !== null) {
                        acc[`${item.id}-${zone.id}`] = matchingResult.status;
                    }
                });
                return acc;
            }, {} as { [key: string]: boolean | null });

            setResultStatus(initialStatus); // เก็บค่า resultStatus ที่อัพเดตแล้ว
            console.log("initialStatus:", initialStatus); // Debug ดูค่า resultStatus ว่าถูกต้องหรือไม่
        }
    }, [checklist, patrolResult]);

    const handleClick = (itemId: number, zoneId: number, status: boolean) => {
        handleResult({ itemId, zoneId, status });
        setResultStatus((prev) => ({
            ...prev,
            [`${itemId}-${zoneId}`]: status,
        }));
    };

    return (
        <div className='bg-secondary rounded-md px-4 py-2'>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className='border-none'>
                    <AccordionTrigger className='hover:no-underline text-2xl font-semibold py-2'>{checklist.title}</AccordionTrigger>
                    <AccordionContent>
                        <div className='flex flex-rows items-center gap-2 text-muted-foreground text-base ps-4 py-2  border-t-2 '>
                            <span className="material-symbols-outlined">
                                engineering
                            </span>
                            <p className='font-semibold'>
                                Inspector
                            </p>
                            <p className='text-card-foreground'>
                                {checklist.inspector.name}
                            </p>
                        </div>
                        <div className='ps-2'>
                            {checklist.item?.map((item: Item) => (
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1" className='border-none'>
                                        <AccordionTrigger className='hover:no-underline'>
                                            <div className='flex items-center justify-between w-full pe-2'>
                                                <p className='text-xl font-semibold'>{item.name}</p>
                                                <BadgeCustom variant={getBadgeVariant(item.type as ItemType)}>
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </BadgeCustom>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className='flex flex-col py-2 gap-2'>
                                            {item?.zone.map((zone: Zone) => {
                                                const status = checkStatus(item.id, zone.id);
                                                return (
                                                    <div key={zone.id} className='bg-card rounded-md p-2'>
                                                        <div className='flex flex-row justify-between items-center'>
                                                            <div className='flex flex-col'>
                                                                <div className='flex items-center gap-2 mb-2'>
                                                                    <span className="material-symbols-outlined">
                                                                        location_on
                                                                    </span>
                                                                    <p className='font-semibold'>Zone</p>
                                                                    <p>
                                                                        {zone.name}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center gap-2'>
                                                                    <span className="material-symbols-outlined">
                                                                        badge
                                                                    </span>
                                                                    <p className='font-semibold'>Supervisor</p>
                                                                    <p>
                                                                        {zone.supervisor.profile.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='flex gap-2 pe-2'>
                                                                <Button
                                                                    variant={resultStatus[`${item.id}-${zone.id}`] === true ? 'success' : 'secondary'}
                                                                    className={`w-[155px] ${resultStatus === null ? 'bg-secondary text-card-foreground' : ''}`}
                                                                    onClick={() => handleClick(item.id, zone.id, true)}
                                                                    disabled={disabled}
                                                                >
                                                                    <span className="material-symbols-outlined">check</span>
                                                                    <p>Yes</p>
                                                                </Button>
                                                                <Button
                                                                    variant={resultStatus[`${item.id}-${zone.id}`] === false ? 'fail' : 'secondary'}
                                                                    className={`w-[155px] ${resultStatus === null ? 'bg-secondary text-card-foreground' : ''}`}
                                                                    onClick={() => handleClick(item.id, zone.id, false)}
                                                                    disabled={disabled}

                                                                >
                                                                    <span className="material-symbols-outlined">close</span>
                                                                    <p>No</p>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {status === false && (
                                                            <div className="mt-4 flex flex-col items-start">
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger>
                                                                        <Button variant={'outline'} size={'lg'}>
                                                                            <span className="material-symbols-outlined">campaign</span>
                                                                            Report
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
                                                                                <p className='font-semibold'>{item.name}</p>
                                                                                <div className='flex items-center'>
                                                                                    <span className="material-symbols-outlined text-2xl me-2">
                                                                                        location_on
                                                                                    </span>
                                                                                    <p className='font-semibold me-2'>
                                                                                        Zone
                                                                                    </p>
                                                                                    <p>{zone.name}</p>
                                                                                </div>
                                                                                <div className='flex items-center'>
                                                                                    <span className="material-symbols-outlined text-2xl me-2">
                                                                                        badge
                                                                                    </span>
                                                                                    <p className='font-semibold me-2'>
                                                                                        Supervisor
                                                                                    </p>
                                                                                    <p>{zone.supervisor.profile.name}</p>
                                                                                </div>
                                                                            </div>
                                                                        </AlertDialogHeader>
                                                                        <Textarea
                                                                            className="h-[100px] mt-3 bg-secondary border-none"
                                                                            placeholder="Details..."
                                                                        />
                                                                        <div className='flex flex-row justify-between gap-2'>
                                                                            <div className='flex h-full w-full max-w-[230px] rounded-[10px] bg-secondary justify-center items-center' onDragOver={handleDragOver} onDrop={handleDrop}>
                                                                                <div className='flex p-8 flex-col items-center justify-center'>
                                                                                    <span className="material-symbols-outlined text-[48px] font-normal">
                                                                                        upload
                                                                                    </span>
                                                                                    {!selectedFile ? (
                                                                                        <>
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
                                                                                                    style={{ display: 'none' }}
                                                                                                    onChange={handleFileChange}
                                                                                                />
                                                                                                <Button variant={'outline'} onClick={handleButtonClick}>
                                                                                                    <span className="material-symbols-outlined mr-1">browser_updated</span>
                                                                                                    Browse
                                                                                                </Button>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className='text-center mt-1'>
                                                                                            <p>Selected file: {selectedFile.name}</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <ScrollArea className='flex justify-between w-full'>
                                                                                <div className='flex justify-between items-center p-2 w-full bg-secondary rounded-md'>
                                                                                    <div className='flex items-center gap-2'>
                                                                                        <span className="material-symbols-outlined">
                                                                                            image
                                                                                        </span>
                                                                                        <div className='flex flex-col'>
                                                                                            <p>Defect-1.jpg</p>
                                                                                            <p className='text-sm font-semibold text-muted-foreground'>2KB</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <Button variant={'ghost'} className='w-[40px] h-[40px]'>
                                                                                        <span className="material-symbols-outlined text-destructive">
                                                                                            delete
                                                                                        </span>
                                                                                    </Button>
                                                                                </div>
                                                                            </ScrollArea>
                                                                        </div>

                                                                        <AlertDialogFooter>
                                                                            <div className="flex items-end justify-end gap-[10px]">
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction className='bg-primary hover:bg-primary/70'>
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
                                                                    placeholder="Comment..."

                                                                />
                                                                <div className='flex justify-end w-full mt-2'>
                                                                    <Button variant={'primary'} size={'lg'}>
                                                                        <span className="material-symbols-outlined me-2">send</span> Send
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