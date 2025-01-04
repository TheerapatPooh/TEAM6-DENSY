'use client'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import BadgeCustom from "@/components/badge-custom";
import Loading from "@/components/loading";
import { fetchData, getItemTypeVariant } from "@/lib/utils";
import { IChecklist, IItem, IItemZone } from "@/app/type";
import { useTranslations } from "next-intl";

export default function page() {
    const [allChecklists, setAllChecklists] = useState<[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [selectChecklists, setSelectChecklists] = useState<number[]>([])
    const [tempSelectChecklists, setTempSelectChecklists] = useState<number[]>([])
    const [formPreset, setFormPreset] = useState({
        title: '',
        description: '',
        checklists: []
    })

    const t = useTranslations("General");
    const s = useTranslations("Status");
    const z = useTranslations("Zone");

    const getAllChecklists = async () => {
        try {
            const allData = await fetchData("get", "/checklists", true);
            setAllChecklists(allData);
        } catch (error) {
            console.error("Failed to fetch all defect:", error);
        }
    };

    const handleSelectChecklists = ((checklistId: number) => {
        setTempSelectChecklists((prev) => {
            if (prev.includes(checklistId)) {
                return prev.filter((id) => id !== checklistId);
            } else {
                return [...prev, checklistId]
            }
        })
    })

    const handleDoneChecklist = (() => {
        setSelectChecklists(tempSelectChecklists)
    })

    const handleRemoveChecklist = ((checklistId: number) => {
        setSelectChecklists((prev) => prev.filter((id) => id !== checklistId))
        setTempSelectChecklists((prev) => prev.filter((id) => id !== checklistId))
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormPreset((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreatePreset = async () => {
        const presetForm = new FormData()

        presetForm.append("title", formPreset.title)
        presetForm.append("description", formPreset.description)

        selectChecklists.forEach((checklistId: number) => {
            presetForm.append("checklists[]", checklistId.toString());
        });

        try {
            await fetchData("post", `/preset`, true, presetForm)
            alert("Preset Created successfully!");
        } catch (error) {
            console.error("Error Creating Preset:", error);
            alert("Failed to Create Preset");
        }
    }

    useEffect(() => {
        getAllChecklists()
        setLoading(false)
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className='bg-card px-6 py-4 '>
            {/* create patrol preset and button */}
            <div className='flex flex-row justify-between mb-4'>
                <div className='text-2xl font-bold'>
                    Create Patrol Preset
                </div>

                <div className='flex flex-row gap-2'>
                    <Button variant='secondary'>Cancel</Button>

                    <Button variant='primary' onClick={handleCreatePreset}>
                        <span className="material-symbols-outlined mr-2">save</span>
                        Save
                    </Button>
                </div>
            </div>

            {/* title */}
            <div className="flex flex-col mb-4">
                <div className='text-base font-semibold mb-2'>
                    Title
                </div>

                <div>
                    <Input name="title" value={formPreset.title} className='bg-secondary w-1/3 border-none text-xl' placeholder='title' onChange={handleInputChange}></Input>
                </div>
            </div>

            {/* description */}
            <div className="flex flex-col mb-4">
                <div className='text-base font-semibold mb-2'>
                    Description
                </div>

                <div>
                    <Textarea name="description" value={formPreset.description} className='bg-secondary border-none text-xl h-44' placeholder='description' onChange={handleInputChange}></Textarea>
                </div>
            </div>

            {/* new checklist */}
            <div className='flex flex-row gap-2'>
                <div className='text-2xl font-bold'>
                    Checklist
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-8 h-8" variant="primary">
                            <span className="material-symbols-outlined">add</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-semibold">
                                Checklist Group
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                                Please add a checklist group
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {allChecklists ? (
                            <>
                                <ScrollArea className="h-[400px] overflow-y-auto rounded-lg w-full">
                                    {allChecklists.map((checklist: IChecklist) => {
                                        return (
                                            <div className="flex flex-row justify-between bg-secondary px-6 py-4 mb-2 rounded-lg">
                                                <div>
                                                    <div className="flex text-base gap-1 mb-2 ">
                                                        <span className="material-symbols-outlined">history</span>
                                                        Version {checklist.version}
                                                    </div>

                                                    <div className="text-2xl font-bold">
                                                        {checklist.title}
                                                    </div>
                                                </div>

                                                <div className="flex justify-center items-center">
                                                    <Checkbox
                                                        key={checklist.id}
                                                        value={checklist.id}
                                                        checked={tempSelectChecklists.includes(checklist.id)}
                                                        className="bg-card"
                                                        onCheckedChange={() => handleSelectChecklists(checklist.id)}>
                                                    </Checkbox>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </ScrollArea>
                                <AlertDialogFooter>
                                    <div className="flex items-end justify-end gap-[10px]">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-primary" onClick={handleDoneChecklist}>
                                            Done
                                        </AlertDialogAction>
                                    </div>
                                </AlertDialogFooter>

                            </>
                        ) : (
                            <>
                                <div>
                                    <div className="flex flex-col justify-center items-center h-[400px] gap-4">
                                        <div className="text-2xl font-semibold">
                                            You don't have any Checklist want to create now?
                                        </div>
                                        <AlertDialogFooter>
                                            <div className="flex gap-[10px]">
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-primary">
                                                    Sure
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </div>

                                </div>

                            </>
                        )}
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* checklist info */}
            {
                selectChecklists.map((checklistId: number) => {
                    return allChecklists.map((checklist: IChecklist) => {
                        if (checklist.id === checklistId) {
                            return (
                                <div className="px-6 py-4">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1" className="border-none">
                                            <div className="flex flex-row gap-1 text-base">
                                                <span className="material-symbols-outlined">history</span>
                                                Version {checklist.version}
                                            </div>
                                            <div className="flex flex-col">
                                                <AccordionTrigger className="flex flex-row justify-between hover:no-underline">
                                                    <div className="flex flex-row text-2xl font-bold">
                                                        <Button variant="ghost" onClick={() => handleRemoveChecklist(checklist.id)}>
                                                            <span className="material-symbols-outlined flex justify-center items-center text-destructive">delete</span>
                                                        </Button>
                                                        {checklist.title}
                                                    </div>
                                                </AccordionTrigger>

                                                {checklist.items.map((item: IItem) => {
                                                    return (
                                                        <AccordionContent>
                                                            <Accordion type="single" collapsible>
                                                                <AccordionItem value="item-1" className="border-none px-6">
                                                                    <AccordionTrigger className="hover:no-underline">
                                                                        <div className="flex items-center justify-between w-full pe-2">
                                                                            <p className="text-xl font-semibold">{item.name}</p>
                                                                            {(() => {
                                                                                const { iconName, variant } = getItemTypeVariant(item.type);
                                                                                return (
                                                                                    <BadgeCustom
                                                                                        variant={variant}
                                                                                        showIcon={true}
                                                                                        shape={"square"}
                                                                                        iconName={iconName}
                                                                                    >
                                                                                        {s(item.type)}
                                                                                    </BadgeCustom>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="flex flex-col gap-4">
                                                                        {item.itemZones.map((itemZone: IItemZone) => {
                                                                            return (
                                                                                <div key={itemZone.zone.id} className="bg-background rounded-md px-4 py-2">
                                                                                    <div className="flex flex-row justify-between items-center">
                                                                                        <div className="flex flex-col">
                                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                                <span className="material-symbols-outlined">
                                                                                                    location_on
                                                                                                </span>
                                                                                                <p className="font-semibold text-lg">
                                                                                                    Zone
                                                                                                </p>
                                                                                                <p className="text-lg">{z(itemZone.zone.name)}</p>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="material-symbols-outlined">
                                                                                                    badge
                                                                                                </span>
                                                                                                <p className="font-semibold text-lg">
                                                                                                    Supervisor
                                                                                                </p>
                                                                                                <div className="flex flex-row items-center">
                                                                                                    <Avatar className="mr-1 h-6 w-6" >
                                                                                                        <AvatarImage />
                                                                                                        <AvatarFallback>
                                                                                                        </AvatarFallback>
                                                                                                    </Avatar>
                                                                                                    <p className="text-lg">
                                                                                                        {itemZone.zone.supervisor.profile.name}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex gap-2 pe-2">
                                                                                            <Button variant="secondary" className="w-[155px] cursor-not-allowed opacity-50">
                                                                                                <span className="material-symbols-outlined">
                                                                                                    check
                                                                                                </span>
                                                                                                Yes
                                                                                            </Button>
                                                                                            <Button variant="secondary" className="w-[155px] cursor-not-allowed opacity-50">
                                                                                                <span className="material-symbols-outlined">
                                                                                                    close
                                                                                                </span>
                                                                                                No
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </AccordionContent>
                                                    )
                                                })}
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            );
                        }
                    });
                })
            }
        </div >
    )
}
