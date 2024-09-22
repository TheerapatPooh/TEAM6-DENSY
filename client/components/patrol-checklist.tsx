"use client";
import { useState } from 'react';
import { Button } from './ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function PatrolChecklist() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [isOpenInside, setIsOpenInside] = useState(false);
    const toggleInsideDropdown = () => {
        setIsOpenInside(!isOpenInside);
    };

    const [isYesClicked, setIsYesClicked] = useState(false);
    const handleYesClick = () => {
        setIsYesClicked(!isYesClicked);
        setIsNoClicked(false);
    };

    const [isNoClicked, setIsNoClicked] = useState(false);
    const handleNoClick = () => {
        setIsNoClicked(!isNoClicked);
        setIsYesClicked(false);
    };

    return (
        <div className='relative'>
            {/* ส่วนด้านนอก */}
            <div className='flex items-center w-[1360px] h-[109px] rounded-[10px] bg-patrolCheckBG'>
                <div className='flex flex-col justify-start w-[415px] h-[69px] ml-[20px] bg-patrolCheckBG'>
                    <div className='font-bold bg-patrolCheckBG text-xl' id='namePatrol'>General Cleanliness</div>
                    <div className='flex h-[42px] pl-[20px] bg-patrolCheckBG'>
                        <p className='text-gray font-bold bg-patrolCheckBG'>Inspector </p>
                        <p className='pl-[12px] bg-patrolCheckBG'>Sorrawit sangmanee</p>
                    </div>
                </div>
                <div className='ml-auto pr-[20px] cursor-pointer bg-patrolCheckBG' onClick={toggleDropdown}>
                    {isOpen ? '▲' : '▼'}
                </div>
            </div>

            {/* Dropdown ด้านนอก */}
            {isOpen && (
                <div className='absolute mt-2'>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is it styled?</AccordionTrigger>
                            <AccordionContent>
                                <div className='flex rounded-[10px] p-4'>

                                    <div className=' w-full'>
                                        <p className='font-bold'>Zone A</p>
                                        <p>ResponsibleMan John Doe</p>
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <Button
                                            className={` w-[155px] mr-[5px] rounded-[10px] text-white ${isYesClicked ? 'bg-green-500' : 'bg-gray'
                                                }`} onClick={handleYesClick} >
                                            Yes
                                        </Button>

                                        <Button className={` w-[155px] mr-[5px] rounded-[10px] text-white ${isNoClicked ? 'bg-green-500' : 'bg-gray'
                                            }`} onClick={handleNoClick} >
                                            No
                                        </Button>
                                    </div>
                                </div>
                                components&apos; aesthetic.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is it animated?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It's animated by default, but you can disable it if you prefer.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <hr className=" ml-[20px] mr-[20px] border-t border-slate-400 border-[2px]" />
                    <div className='flex flex-col w-[1360px] bg-patrolCheckBG rounded-[10px] p-4'>
                        <div className='flex items-center justify-between font-bold w-full bg-patrolCheckBG'>
                            <p className='bg-patrolCheckBG'>ตรวจสอบสภาพพื้นในทุกโซนว่าไม่มีความเสียหายหรือสิ่งกีดขวาง</p>
                            <div className='flex items-center bg-patrolCheckBG'>
                                <div className='w-[150px] h-[30px] rounded-[20px] bg-green-200 justify-center items-center text-emerald-400 flex'>
                                    Safety
                                </div>
                                <div className='ml-4 cursor-pointer bg-patrolCheckBG' onClick={toggleInsideDropdown}>
                                    {isOpenInside ? '▲' : '▼'}
                                </div>
                            </div>
                        </div>
                        <div className='rounded-[10px] mt-4  bg-gray-100 '>

                            {/* Dropdown ด้านใน */}
                            {isOpenInside && (

                                <div className='flex rounded-[10px] p-4'>

                                    <div className=' w-full'>
                                        <p className='font-bold'>Zone A</p>
                                        <p>ResponsibleMan John Doe</p>
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <Button
                                            className={` w-[155px] mr-[5px] rounded-[10px] text-white ${isYesClicked ? 'bg-green-500' : 'bg-gray'
                                                }`} onClick={handleYesClick} >
                                            Yes
                                        </Button>

                                        <Button className={` w-[155px] mr-[5px] rounded-[10px] text-white ${isNoClicked ? 'bg-green-500' : 'bg-gray'
                                            }`} onClick={handleNoClick} >
                                            No
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
