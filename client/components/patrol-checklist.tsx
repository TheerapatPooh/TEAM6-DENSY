'use client';

import { Button } from './ui/button';
import BadgeCustom from "@/components/badge-custom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from './ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Checklist, Item, ItemType, Zone } from '@/app/type';
import React, { useState, useEffect } from 'react';


// TYPE


interface PatrolChecklistProps {
    checklist: Checklist;
    handleResult: (result: { itemId: number, zoneId: number, status: boolean }) => void;
    results: Array<{ itemId: number, zoneId: number, status: boolean }>;
}

export default function PatrolChecklist({ checklist, handleResult, results = [] }: PatrolChecklistProps) {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const checkResultStatus = (itemId: number, zoneId: number) => {
        const result = results.find(res => res.itemId === itemId && res.zoneId === zoneId);
        console.log(result)
        return result ? result.status : null;
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
                                                const resultStatus = checkResultStatus(item.id, zone.id);
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
                                                                    variant={resultStatus === true ? 'success' : 'secondary'}
                                                                    className={`w-[155px] ${resultStatus === null ? 'bg-secondary text-card-foreground' : ''}`}
                                                                    onClick={() => handleResult({ itemId: item.id, zoneId: zone.id, status: true })}
                                                                >
                                                                    <span className="material-symbols-outlined">check</span>
                                                                    <p>Yes</p>
                                                                </Button>
                                                                <Button
                                                                    variant={resultStatus === false ? 'fail' : 'secondary'}
                                                                    className={`w-[155px] ${resultStatus === null ? 'bg-secondary text-card-foreground' : ''}`}
                                                                    onClick={() => handleResult({ itemId: item.id, zoneId: zone.id, status: false })}
                                                                >
                                                                    <span className="material-symbols-outlined">close</span>
                                                                    <p>No</p>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {resultStatus === false && (
                                                            <div className="mt-4 flex flex-col items-start">
                                                                <DropdownMenu onOpenChange={(open) => setIsReportOpen(open)}>
                                                                    <DropdownMenuTrigger
                                                                        className={`custom-shadow px-[10px] bg-card  w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isReportOpen ? "border border-destructive" : ""}`}
                                                                    >
                                                                        <span className="material-symbols-outlined">campaign</span>
                                                                        <div className="text-lg	">Report</div>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="start" className='border'>
                                                                        <CardHeader>
                                                                            <CardTitle>Select Report Type</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className='flex'>
                                                                            <form>
                                                                                <div className="grid w-full items-center gap-4">
                                                                                    <div className="flex flex-col">
                                                                                        <div className='flex gap-2 '>
                                                                                            <div className='flex w-full max-w-[250px] border-2'>
                                                                                                Factory A
                                                                                            </div>
                                                                                            <div className='flex w-[250px] rounded-md bg-secondary justify-center items-center'>
                                                                                                <div className='flex p-4 flex-col items-center justify-center'>
                                                                                                    <span className="material-symbols-outlined text-5xl">upload</span>

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
                                                                                                                />
                                                                                                                <Button variant={'outline'} className='flex items-center justify-center'>
                                                                                                                    <span className="material-symbols-outlined mr-1">browser_updated</span> Browse
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
                                                                                        </div>
                                                                                        <Textarea
                                                                                            className="h-[94px] mt-3 bg-secondary border-none"
                                                                                            placeholder="Details..."

                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </CardContent>
                                                                        <CardFooter className="flex justify-end gap-4">
                                                                            <Button variant="secondary" size={'lg'}>Cancel</Button>
                                                                            <Button variant={'primary'} size={'lg'}>
                                                                                <span className="material-symbols-outlined">send</span>
                                                                                Send
                                                                            </Button>
                                                                        </CardFooter>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                                <Textarea
                                                                    className="h-[94px] mt-3 bg-secondary border-none"
                                                                    placeholder="Comment..."

                                                                />
                                                                <div className='flex justify-end w-full mt-2'>
                                                                    <Button variant={'primary'} size={'lg'}>
                                                                        <span className="material-symbols-outlined">send</span> Send
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