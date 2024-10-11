'use client';

import { SetStateAction } from 'react';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { DefectStatus, DefectType } from "@/app/type";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Checklist, Item, Zone } from '@/app/type';
import { fetchData } from '@/lib/api';
import React, { useState, useEffect } from 'react';


// TYPE
type ContentResponse = {
    yes: boolean;
    no: boolean;
};
type ItemResponses = {
    [key: string]: ContentResponse;
};
type Responses = {
    [key: string]: ItemResponses;
};

interface PatrolChecklistProps {
    checklist: Checklist;
}

interface User {
    id_user: number;
    username: string;
    role: string[];
}

interface Zones {
    ze_id: number;
    ze_name: string;
}

export default function PatrolChecklist({ checklist }: PatrolChecklistProps) {
    console.log("patrol checklist: ", checklist)
    const { theme } = useTheme();
    const getTitleVariant = (title_checklist: string) => {
        switch (title_checklist) {
            case "Safety":
                return "mint";
            case "Environment":
                return "orange";
            default:
                return "red";
        }
    };

    // ใช้ useState สำหรับเก็บสถานะของ Yes/No แยกตามแต่ละไอเท็ม
    const [responses, setResponses] = useState<Responses>({});
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
    // ฟังก์ชันสำหรับกด Yes สำหรับ AccordionContent แต่ละอัน

    const handleYesClick = (item: string, content: string) => {
        setResponses((prevState) => ({
            ...prevState,
            [item]: {
                ...prevState[item],
                [content]: { yes: true, no: false },
            },
        }));
    };

    const handleNoClick = (item: string, content: string) => {
        setResponses((prevState) => ({
            ...prevState,
            [item]: {
                ...prevState[item],
                [content]: { yes: false, no: true },
            },
        }));
    };

    const [is_card_visible, setIsCardVisible] = useState(false);
    const handleReportClick = () => {
        setIsCardVisible(true);
    };
    const handleCancelClick = () => {
        setIsCardVisible(false);
    };

    const [selected_file, setSelectedFile] = useState<File | null>(null);
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

    const [is_open, set_is_open] = useState(false);

    // ฟังก์ชันสำหรับสลับสถานะการเปิด/ปิด
    const toggleDropdown = (id: number) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };


    const handleSendFile = async () => {
        if (selected_file) {
            const formData = new FormData();
            formData.append('file', selected_file);
            try {
                const response = await fetch('', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.error('File upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const [comment, setComment] = useState("");
    const [submitted_comment, setSubmittedComment] = useState("");
    const [submitted_time, setSubmittedTime] = useState("");
    const handleSendClick = () => {
        setSubmittedComment(comment);
        setSubmittedTime(new Date().toLocaleString());
        setComment("");
    };

    return (
        <div className={`relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className='relative'>
                <div className='absolute mt-2 w-full max-w-[1360px] rounded-[10px]'>
                    <Accordion type="multiple" className="w-full max-w-[1360px] p-4">
                        <div key={checklist.id} className='flex items-center w-full max-w-[1360px] h-[109px] rounded-[10px]'>
                            <div className='flex flex-col justify-start w-[415px] h-[69px] ml-[20px]'>
                                <div className='font-bold bg-patrolCheckBG text-xl' id='namePatrol'>
                                    <span className="material-symbols-outlined">
                                        error
                                    </span> {checklist.title}
                                </div>
                                <div className='flex items-center h-[42px] pl-[20px]'>
                                    <p className='flex text-gray font-bold'>
                                        <span className="items-center material-symbols-outlined">
                                            engineering
                                        </span> Inspector
                                    </p>
                                    <p className='pl-[12px]'>{checklist.inspector.name}</p>
                                </div>
                            </div>

                            <div
                                className="ml-auto pr-[20px] cursor-pointer bg-gray-100"
                                onClick={() => toggleDropdown(checklist.id)}
                            >
                                {openItems[checklist.id] ? '▲' : '▼'}
                            </div>
                        </div>
                        {openItems[checklist.id] && (
                            checklist.item.map((item: Item) => (
                                <AccordionItem key={item.id} className="ml-[40px]" value={`item-${item.id}`}>
                                    <div className="flex justify-between items-center">
                                        <AccordionTrigger className="flex">
                                            <div className='text-[18px]'>
                                                {item.name}
                                            </div>
                                        </AccordionTrigger>
                                        <div className='w-[150px] h-[30px] rounded-[20px] justify-center items-center font-bold'>
                                            <BadgeCustom
                                                variant={getTitleVariant(item.type)}
                                                className="w-full h-full p-2 rounded"
                                            >
                                                <h1 className='flex text-center ml-[40px]'>{item.type}</h1>
                                            </BadgeCustom>
                                        </div>
                                    </div>

                                    {item.zone?.map((zone: Zone) => (
                                        <AccordionContent key={zone.id}>
                                            <div className='flex flex-col rounded-[10px] p-4'>
                                                <div className='flex'>
                                                    <div className='w-full flex-col'>
                                                        <p className='flex font-bold items-center mb-[5px]'>
                                                            <span className="material-symbols-outlined mr-1">location_on</span>
                                                            Zone <h1 className='ml-2'>{zone.name}</h1>
                                                        </p>
                                                        <p className='flex font-bold items-center mb-[5px]'>
                                                            <span className="material-symbols-outlined mr-1">badge</span>
                                                            Responsible Man <h1 className='ml-2'>{zone.name}</h1>
                                                        </p>
                                                        <h1 className='mt-[5px] flex'>
                                                            <small className='text-[17px] text-gray-500'>{submitted_time}</small>
                                                            <div className='text-[15px] text-black ml-[5px]'>
                                                                {submitted_comment}
                                                            </div>
                                                        </h1>
                                                    </div>
                                                    <div className="flex justify-center items-center">
                                                        <Button
                                                            className={`w-[155px] mr-[5px] rounded-[10px] text-black ${responses[`item-${item.id}`]?.[`content-${zone.id}`]?.yes ? 'bg-[#27BC31]' : 'bg-gray-300'}`}
                                                            onClick={() => handleYesClick(`item-${item.id}`, `content-${zone.id}`)}
                                                        >
                                                            Yes
                                                        </Button>
                                                        <Button
                                                            className={`w-[155px] mr-[5px] rounded-[10px] text-black ${responses[`item-${item.id}`]?.[`content-${zone.id}`]?.no ? 'bg-[#FB0022]' : 'bg-gray-300'}`}
                                                            onClick={() => handleNoClick(`item-${item.id}`, `content-${zone.id}`)}
                                                        >
                                                            No
                                                        </Button>
                                                    </div>
                                                </div>

                                                {responses[`item-${item.id}`]?.[`content-${zone.id}`]?.no && (
                                                    <div className='w-full h-auto'>
                                                        <Button className='border-10px border-red-600 border-[1px] h-[45px] w-[134px] mt-[10px]' onClick={handleReportClick}>
                                                            <span className="material-symbols-outlined">campaign</span> Report
                                                        </Button>

                                                        {is_card_visible && (
                                                            <Card className="absolute w-[560px] h-[540px] mt-[10px] transform transition-transform scale-100 opacity-100 z-50">
                                                                <CardHeader>
                                                                    <CardTitle>Select Report Type</CardTitle>
                                                                    <CardDescription></CardDescription>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <form>
                                                                        <div className="grid w-full items-center gap-4">
                                                                            <div className="flex flex-col space-y-1.5">
                                                                                <div className='flex h-[255px]'>
                                                                                    <div className='h-[230px] w-full max-w-[230px] border-[2px] mr-[34px] mt-[12px] mb-[12px] ml-[12px]'>
                                                                                        Factory A
                                                                                    </div>
                                                                                    <div className='flex h-full w-full max-w-[230px] rounded-[10px] bg-secondary justify-center items-center' onDragOver={handleDragOver} onDrop={handleDrop}>
                                                                                        <div className='flex w-[120px] h-[170px] p-4 flex-col items-center justify-center'>
                                                                                            <span className="material-symbols-outlined text-[48px] font-normal">upload</span>

                                                                                            {!selected_file ? (
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
                                                                                                        <Button className='flex items-center justify-center' onClick={handleButtonClick}>
                                                                                                            <span className="material-symbols-outlined mr-1">browser_updated</span> Browse
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div className='text-center mt-1'>
                                                                                                    <p>Selected file: {selected_file.name}</p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Input className='mt-[20px] h-[121px] bg-secondary' id="Detail" placeholder="Details.." />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </CardContent>
                                                                <CardFooter className="flex justify-between">
                                                                    <Button variant="outline" onClick={handleCancelClick}>Cancel</Button>
                                                                    <Button onClick={handleSendFile}>Send</Button>
                                                                </CardFooter>
                                                            </Card>
                                                        )}

                                                        <Textarea
                                                            className="h-[94px] mt-3"
                                                            placeholder="Comment..."
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        />
                                                        <div className='flex justify-end'>
                                                            <Button className='mt-2 bg-[#698AFF]' onClick={handleSendClick}>
                                                                <span className="material-symbols-outlined">send</span> Send
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    ))}
                                </AccordionItem>
                            ))
                        )}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}