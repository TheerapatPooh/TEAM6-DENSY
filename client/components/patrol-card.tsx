'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useEffect, useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

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
    const [isClicked, setIsClicked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const t = useTranslations('General');

    if (!mounted) {
        return null
    }

    const handleClick = () => {
        setIsClicked(prev => !prev);
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    return (
        <Card className="custom-shadow border-none w-full h-[230px] hover:bg-secondary cursor-pointer">
            <CardHeader className="gap-0 p-[10px]">
                <div className="flex justify-between items-center">
                    <CardDescription className="text-lg font-semibold">{formattedDate}</CardDescription>
                    {patrolSheetStatus === "Pending" ? (
                        <div className="flex items-center justify-center rounded-full bg-blue-300/40 w-10 h-10 custom-shadow">
                            <span className="material-symbols-outlined text-blue-500">hourglass_top</span>
                        </div>
                    ) : patrolSheetStatus === "Scheduled" ? (
                        <div className="flex items-center justify-center rounded-full bg-yellow-300/40 w-10 h-10 custom-shadow">
                            <span className="material-symbols-outlined text-yellow-500">event_available</span>
                        </div>
                    )
                     : patrolSheetStatus === "On Going" ? (
                        <div className="flex items-center justify-center rounded-full bg-purple-300/40 w-10 h-10 custom-shadow">
                            <span className="material-symbols-outlined text-purple-500">cached</span>
                        </div>
                    ) : patrolSheetStatus === "Completed" ? (
                        <div className="flex items-center justify-center rounded-full bg-green-300/40 w-10 h-10 custom-shadow">
                            <span className="material-symbols-outlined text-green-500">check</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-full bg-red-300/40 w-10 h-10 custom-shadow">
                            <span className="material-symbols-outlined text-red-500">error</span>
                        </div>
                    )}
                </div>
                <CardTitle className="card-foreground text-2xl">{patrolSheetTitle}</CardTitle>
            </CardHeader>
            <CardContent className="gap-0 px-[10px] py-0">
                <div className="flex gap-2.5 text-muted-foreground items-center">
                    <span className="material-symbols-outlined">description</span>
                    <p className="text-xl">{presetNumber}</p>
                </div>
                <HoverCard open={isClicked || isHovered}>
                    <HoverCardTrigger onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} asChild>
                        <div className="flex text-muted-foreground items-center overflow-hidden pb-2">
                            <span className="material-symbols-outlined me-2.5">engineering</span>
                            {inspectorNames.length > 0 && (
                                <div className="flex items-center me-2.5 truncate max-w-[190px]">
                                    <p className="text-xl me-2.5 truncate"> 
                                        {inspectorNames[0]}
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
                                    <span className="absolute text-card-foreground text-[16px] font-semibold">+{inspectorNames.length - 5}</span>
                                    <AvatarFallback></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full border-none custom-shadow">
                        <div className="flex items-center justify-center">
                            <span className="material-symbols-outlined me-2.5">engineering</span>
                            <p className="text-lg font-medium text-center">{t('InspectorListNames')}</p>
                        </div>
                        {inspectorNames.map((inspectorName) =>
                            <div className="flex items-center p-2">
                                <Avatar className="custom-shadow ms-[-10px] me-2.5">
                                    <AvatarImage src=""/>
                                    <AvatarFallback>{inspectorName.slice(0, 2)}.</AvatarFallback>
                                </Avatar>
                                <p className="text-[20px]"> 
                                    {inspectorName}
                                </p>
                            </div>
                        )}
                    </HoverCardContent>
                    </HoverCard>
            </CardContent>
            <CardFooter className="gap-0 px-[10px]">
                <div className="flex gap-2.5 items-center w-full">
                    <div className="flex gap-2.5 text-blue-500 items-center">
                        <span className="material-symbols-outlined">checklist</span>
                        <p className="text-[20px] font-semibold">{detectedItems}</p>
                    </div>
                    <div className="flex gap-2.5 text-yellow-500 items-center">
                        <span className="material-symbols-outlined">close</span>
                        <p className="text-[20px] font-semibold">{detectedComments}</p>
                    </div>
                    <div className="flex gap-2.5 text-red-500 items-center">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        <p className="text-[20px] font-semibold">{detectedDefects}</p>
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
                                    <h1>{t('Details')}</h1>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <h1 className="text-destructive hover:text-destructive">{t('Delete')}</h1>
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