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
                                                    <div key={zone.id} className='bg-card rounded-md p-2 flex flex-row justify-between items-center'>
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