'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useEffect, useState } from "react"

interface props {
    patrolSheetStatus: patrolSheetStatus,
    patrolSheetDate: Date,
    patrolSheetTitle: string,
    presetNumber: string,
    inspectorNames: string[],
    detectedItems: number,
    detectedComments: number,
    detectedDefects: number
}

export function PatrolCard({ patrolSheetStatus, patrolSheetDate, patrolSheetTitle, presetNumber, inspectorNames, detectedItems, detectedComments, detectedDefects }: props) {
    const formattedDate = patrolSheetDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const t = useTranslations('PatrolPage');

    if (!mounted) {
        return null
    }

    return (
        <Card className="custom-shadow border-none w-full h-[225px] hover:bg-secondary cursor-pointer">
            <CardHeader className="gap-0 p-[10px]">
                <div className="flex justify-between flex items-center justify-center">
                    <CardDescription className="text-[20px] font-semibold">{formattedDate}</CardDescription>
                    {patrolSheetStatus === "Pending" ? (
                        <div className="flex items-center justify-center rounded-full bg-blue-300/40 w-10 h-10 shadow-md">
                            <span className="material-symbols-outlined text-blue-500">hourglass_top</span>
                        </div>
                    ) : patrolSheetStatus === "Scheduled" ? (
                        <div className="flex items-center justify-center rounded-full bg-yellow-300/40 w-10 h-10 shadow-md">
                            <span className="material-symbols-outlined text-yellow-500">event_available</span>
                        </div>
                    )
                     : patrolSheetStatus === "On Going" ? (
                        <div className="flex items-center justify-center rounded-full bg-orange-300/40 w-10 h-10 shadow-md">
                            <span className="material-symbols-outlined text-orange-500">autorenew</span>
                        </div>
                    ) : patrolSheetStatus === "Completed" ? (
                        <div className="flex items-center justify-center rounded-full bg-green-300/40 w-10 h-10 shadow-md">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-full bg-red-300/40 w-10 h-10 shadow-md">
                            <span className="material-symbols-outlined text-red-500">error</span>
                        </div>
                    )}
                </div>
                <CardTitle className="card-foreground text-[24px]">{patrolSheetTitle}</CardTitle>
            </CardHeader>
            <CardContent className="gap-0 px-[10px] py-0">
                <div className="flex gap-2.5 text-muted-foreground items-center">
                    <span className="material-symbols-outlined">description</span>
                    <p className="text-[20px]">{presetNumber}</p>
                </div>
                <div className="flex text-muted-foreground items-center">
                    <span className="material-symbols-outlined me-2.5">engineering</span>
                    {inspectorNames.length > 0 && (
                        <div className="flex items-center me-2.5">
                            <p className="text-[20px] me-2.5">
                                {inspectorNames[0].length > 12 
                                    ? `${inspectorNames[0].slice(0, 9)}...` 
                                    : inspectorNames[0]}
                            </p>
                        </div>
                    )}
                    {inspectorNames.slice(0, 4).map((inspectorName) => (
                        <Avatar className="custom-shadow ms-[-10px]">
                            <AvatarImage src=""/>
                            <AvatarFallback>{inspectorName.slice(0, 2)}.</AvatarFallback>
                        </Avatar>
                    ))}
                    {inspectorNames.length === 5 && (
                        <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                            <AvatarImage src="https://github.com/shadcn.png"/> 
                            <AvatarFallback>{inspectorNames[4].slice(0, 2)}.</AvatarFallback> 
                        </Avatar>
                    )}
                    {inspectorNames.length > 5 && (
                        <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                            <AvatarImage src=""/> 
                            <span className="absolute text-card-foreground text-[16px]">+{inspectorNames.length - 5}</span>
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </CardContent>
            <CardFooter className="gap-0 px-[10px]">
                <div className="flex gap-2.5 items-center w-full">
                    <div className="flex gap-2.5 text-blue-500 items-center">
                        <span className="material-symbols-outlined">checklist</span>
                        <p className="text-[20px]">{detectedItems}</p>
                    </div>
                    <div className="flex gap-2.5 text-yellow-500 items-center">
                        <span className="material-symbols-outlined">close</span>
                        <p className="text-[20px]">{detectedComments}</p>
                    </div>
                    <div className="flex gap-2.5 text-red-500 items-center">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-[20px]">{detectedDefects}</p>
                    </div>
                    <div className="ml-auto items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant='ghost' className="w-[45px] h-[45px]">
                                    <span className="material-symbols-outlined items-center text-muted-foreground">more_vert</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='p-0'>
                                <DropdownMenuItem>
                                    <h1>{t('PatrolDetails')}</h1>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <h1 className="text-destructive hover:text-destructive">{t('PatrolDelete')}</h1>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export function CreatePatrolCard() {
    return (
        <Card className="bg-accent-gradient border-none flex justify-center items-center w-full h-[225px] hover:bg-accent-gradient-hover cursor-pointer custom-shadow">
            <span className="material-symbols-outlined text-card text-9xl">note_add</span>
        </Card>
    );
}