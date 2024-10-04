'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from './ui/textarea';

//TYPE
// กำหนด type สำหรับ response ของแต่ละไอเท็ม และแยกตาม content
type ContentResponse = {
    yes: boolean;
    no: boolean;
};
type ItemResponses = {
    [key: string]: ContentResponse;
};
// กำหนด type สำหรับ state responses ที่ใช้เก็บสถานะของหลายไอเท็มและหลาย content
type Responses = {
    [key: string]: ItemResponses;
};

//INTERFACE
interface Preset { //
    id: number;
    title: string;
    description: string;
    version: number;
    latest: boolean;
    updated_at: string;
    updated_by: number;
    checklists: Checklist[];
}

interface Checklist {
    id: number;
    title: string;
    version: number;
    updated_at: string;
    updated_by: number;
    inspector_id: number;
    items: Item[];
}

interface Item {
    id: number;
    name: string;
    type: string;
    zones_id: number;
}


export default function PatrolChecklist({ id, title, description, version, latest, updated_at, updated_by, checklists }: Preset) {
    // ใช้ useState สำหรับเก็บสถานะของ Yes/No แยกตามแต่ละไอเท็ม
    const [responses, setResponses] = useState<Responses>({});
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
    // ฟังก์ชันสำหรับกด No สำหรับ AccordionContent แต่ละอัน
    const handleNoClick = (item: string, content: string) => {
        setResponses((prevState) => ({
            ...prevState,
            [item]: {
                ...prevState[item],
                [content]: { yes: false, no: true },
            },
        }));
    };

    const [is_open, set_is_open] = useState(false);
    const toggleDropdown = () => {
        set_is_open(!is_open);
    };



    return (
        <div className='relative'>
            {/* Dropdown ด้านนอก */}
            <div className='absolute mt-2 w-full max-w-[1360px] bg-gray-100 rounded-[10px]'>
                <Accordion type="multiple" className="w-full max-w-[1360px] p-4">
                    {/* ส่วนด้านนอก */}
                    <div className='flex items-center w-full max-w-[1360px] h-[109px] rounded-[10px] bg-gray-100 '>
                        <div className='flex flex-col justify-start w-[415px] h-[69px] ml-[20px] bg-gray-100 '>
                            <div className='font-bold bg-patrolCheckBG text-xl' id='namePatrol'> <span className="material-symbols-outlined">
                                error
                            </span> General Cleanliness </div>
                            <div className='flex items-center h-[42px] pl-[20px] bg-gray-100'>
                                <p className='flex text-gray font-bold bg-gray-100 '> <span className="items-center material-symbols-outlined">
                                    engineering
                                </span> Inspector </p>
                                <p className='pl-[12px] bg-gray-100 '>Sorrawit sangmanee</p>
                            </div>
                        </div>

                        <div className=' ml-auto pr-[20px] cursor-pointer bg-gray-100 ' onClick={toggleDropdown}>
                            {is_open ? '▲' : '▼'}
                        </div>

                    </div>
                    {is_open && (
                        <AccordionItem className="ml-[40px]" value="item-2">
                            <div className="flex justify-between items-center">
                                <AccordionTrigger className="flex">
                                    <div className='text-[18px]'>
                                        ตรวจสอบสภาพพื้นในทุกโซนว่าไม่มีความเสียหายหรือสิ่งกีดขวาง
                                    </div>
                                </AccordionTrigger>
                                <div className='w-[150px] h-[30px] rounded-[20px] bg-teal-100 justify-center items-center text-emerald-400 font-bold flex'>
                                    Safety
                                </div>
                            </div>
                            <AccordionContent >
                                <div className='flex flex-col rounded-[10px] p-4 bg-white '>
                                    <div className='flex '>
                                        <div className='w-full flex-col'>
                                            <p className='flex font-bold items-center'><span className="material-symbols-outlined mr-1">
                                                location_on </span> Zone <h1 className='ml-2'>A</h1 ></p>

                                            <p className='flex font-bold items-center'><span className="material-symbols-outlined mr-1">
                                                badge
                                            </span>ResponsibleMan  <h1 className='ml-2'>John Doe</h1 > </p>

                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <Button
                                                className={` w-[155px] mr-[5px] rounded-[10px] text-black ${responses['item-2']?.['content-1']?.yes ? 'bg-[#27BC31]' : 'bg-gray-300'
                                                    }`} onClick={() => handleYesClick('item-2', 'content-1')} >
                                                Yes
                                            </Button>

                                            <Button className={` w-[155px] mr-[5px] rounded-[10px] text-black ${responses['item-2']?.['content-1']?.no ? 'bg-[#FB0022]' : 'bg-gray-300'
                                                }`} onClick={() => handleNoClick('item-2', 'content-1')}  >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        {responses['item-2']?.['content-1']?.no && (
                                            <div className='w-full h-auto'>
                                                <Textarea className=" h-[94px]  bg-gray-100 mt-3" placeholder="Comment..." />
                                                <div className='flex justify-end'>
                                                    <Button className='mt-2 bg-[#698AFF]'><span className="material-symbols-outlined">
                                                        send
                                                    </span> Send</Button>
                                                </div>

                                            </div>

                                        )}

                                    </div>
                                </div>


                            </AccordionContent>

                            <AccordionContent >
                                <div className='flex flex-col rounded-[10px] p-4 bg-white '>
                                    <div className='flex '>
                                        <div className='w-full flex-col'>
                                            <p className='flex font-bold items-center'><span className="material-symbols-outlined mr-1">
                                                location_on </span> Zone <h1 className='ml-2'>B</h1 ></p>

                                            <p className='flex font-bold items-center'><span className="material-symbols-outlined mr-1">
                                                badge
                                            </span>ResponsibleMan  <h1 className='ml-2'>John Doe</h1 > </p>

                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <Button
                                                className={` w-[155px] mr-[5px] rounded-[10px] text-black ${responses['item-2']?.['content-2']?.yes ? 'bg-[#27BC31]' : 'bg-gray-300'
                                                    }`} onClick={() => handleYesClick('item-2', 'content-2')} >
                                                Yes
                                            </Button>

                                            <Button className={` w-[155px] mr-[5px] rounded-[10px] text-black ${responses['item-2']?.['content-2']?.no ? 'bg-[#FB0022]' : 'bg-gray-300'
                                                }`} onClick={() => handleNoClick('item-2', 'content-2')}  >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        {responses['item-2']?.['content-2']?.no && (
                                            <div className='w-full h-auto'>
                                                <Textarea className=" h-[94px]  bg-gray-100 mt-3" placeholder="Comment..." />
                                                <div className='flex justify-end'>
                                                    <Button className='mt-2 bg-[#698AFF]'><span className="material-symbols-outlined">
                                                        send
                                                    </span> Send</Button>
                                                </div>

                                            </div>

                                        )}

                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                </Accordion>

            </div>
        </div>
    );
}
