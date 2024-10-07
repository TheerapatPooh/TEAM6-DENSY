'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from './ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    const { theme } = useTheme();
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

    //report
    const [isCardVisible, setIsCardVisible] = useState(false);
    const handleReportClick = () => {
        setIsCardVisible(true);
    };

    const handleCancelClick = () => {
        setIsCardVisible(false);
    };



    return (
        <div className={`relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {/* ส่วนที่เหลือของ component */}
            <div className='relative'>
                {/* Dropdown ด้านนอก */}
                <div className='absolute mt-2 w-full max-w-[1360px]rounded-[10px]'>
                    <Accordion type="multiple" className="w-full max-w-[1360px] p-4">
                        {/* ส่วนด้านนอก */}
                        <div className='flex items-center w-full max-w-[1360px] h-[109px] rounded-[10px] '>
                            <div className='flex flex-col justify-start w-[415px] h-[69px] ml-[20px] '>
                                <div className='font-bold bg-patrolCheckBG text-xl' id='namePatrol'> <span className="material-symbols-outlined">
                                    error
                                </span> General Cleanliness </div>
                                <div className='flex items-center h-[42px] pl-[20px] '>
                                    <p className='flex text-gray font-bold '> <span className="items-center material-symbols-outlined">
                                        engineering
                                    </span> Inspector </p>
                                    <p className='pl-[12px] '>Sorrawit sangmanee</p>
                                </div>
                            </div>

                            <div className=' ml-auto pr-[20px] cursor-pointer ' onClick={toggleDropdown}>
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
                                    <div className='flex flex-col rounded-[10px] p-4  '>
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
                                                    <Button className=' border-10px border-red-600 border-[1px] h-[45px] w-[134px] mt-[10px]' onClick={handleReportClick} > <span className="material-symbols-outlined" >
                                                        campaign
                                                    </span> Report
                                                    </Button>

                                                    {isCardVisible && (
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
                                                                                <div className='h-[230px] w-[230px] border-[2px] mr-[34px] mt-[12px] mb-[12px] ml-[12px]'>
                                                                                    Factory A
                                                                                </div>
                                                                                <div className='flex h-full w-[230px] rounded-[10px] bg-secondary justify-center items-center'>
                                                                                    <div className='flex w-[120px] h-[170px]  p-4 flex-col items-center justify-center'>
                                                                                        <span className="material-symbols-outlined text-[48px] font-normal" >
                                                                                            upload
                                                                                        </span>

                                                                                        <div className="text-center mt-2">
                                                                                            Drag & Drop file
                                                                                        </div>
                                                                                        <div className="text-center mt-1">
                                                                                            Or
                                                                                        </div>
                                                                                        <div className="mt-2">
                                                                                            <Button className='flex items-center justify-center'>
                                                                                                <span className="material-symbols-outlined mr-1">
                                                                                                    browser_updated
                                                                                                </span>
                                                                                                Browse
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="flex flex-col space-y-1.5 ">
                                                                                <Input className='mt-[20px] h-[121px] bg-secondary' id="Detail" placeholder="Details.." />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </CardContent>
                                                            <CardFooter className="flex justify-between">
                                                                <Button variant="outline" className='' onClick={handleCancelClick} >Cancel</Button>
                                                                <Button>Send</Button>
                                                            </CardFooter>
                                                        </Card>


                                                    )}

                                                    <Textarea className=" h-[94px] mt-3" placeholder="Comment..." />
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
                                    <div className='flex flex-col rounded-[10px] p-4'>
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
                                                    className={` w-[155px] mr-[5px] rounded-[10px]  ${responses['item-2']?.['content-2']?.yes ? 'bg-[#27BC31]' : 'bg-gray-300'
                                                        }`} onClick={() => handleYesClick('item-2', 'content-2')} >
                                                    Yes
                                                </Button>

                                                <Button className={` w-[155px] mr-[5px] rounded-[10px] ${responses['item-2']?.['content-2']?.no ? 'bg-[#FB0022]' : 'bg-gray-300'
                                                    }`} onClick={() => handleNoClick('item-2', 'content-2')}  >
                                                    No
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            {responses['item-2']?.['content-2']?.no && (
                                                <div className='w-full h-auto'>
                                                    <Textarea className=" h-[94px]  mt-3" placeholder="Comment..." />
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
        </div>

    );
}
