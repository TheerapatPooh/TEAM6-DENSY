import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarImage } from "./ui/avatar"

interface props {
    patrolStatus: patrolStatus,
    patrolDate: Date,
    patrolTitle: string,
    patrolPreset : string,
    patrolorName : string,
    patrolAllItems : number,
    patrolAllComments : number,
    patrolAllDefects : number
}

export function PatrolCard( { patrolStatus ,patrolDate , patrolTitle, patrolPreset, patrolorName, patrolAllItems, patrolAllComments, patrolAllDefects }: props ) {
    const formattedDate = patrolDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const t = useTranslations('PatrolPage');

    return (
        <Card className="shadow-md border-none w-full h-[225px]">
            <CardHeader className="gap-0 p-[10px]">
                <div className="flex justify-between flex items-center justify-center">
                <CardDescription className="text-[20px] font-semibold">{ formattedDate }</CardDescription>
                    {patrolStatus === "Scheduled" ? (
                        <div className="flex items-center justify-center rounded-full bg-yellow-100 w-10 h-10 shadow-md">
                        <span className="material-symbols-outlined text-yellow-500">event_available</span>
                        </div>
                    ) : patrolStatus === "On Going" ? (
                        <div className="flex items-center justify-center rounded-full bg-blue-100 w-10 h-10 shadow-md">
                        <span className="material-symbols-outlined text-blue-500">hourglass_top</span>
                        </div>
                    ) : patrolStatus === "Completed" ? (
                        <div className="flex items-center justify-center rounded-full bg-green-100 w-10 h-10 shadow-md">
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-full bg-red-100 w-10 h-10 shadow-md">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        </div>
                    )}
                </div>
                <CardTitle className="card-foreground text-[24px]">{ patrolTitle }</CardTitle>
            </CardHeader>
            <CardContent className="gap-0 px-[10px] py-0">
                <div className="flex gap-2.5 text-muted-foreground items-center">
                    <span className="material-symbols-outlined">description</span>
                    <p className="text-[20px]">{ patrolPreset }</p>
                </div>
                <div className="flex gap-2.5 text-muted-foreground items-center">
                    <span className="material-symbols-outlined">badge</span>
                    <p className="text-[20px]">{ patrolorName }</p>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
                    </Avatar>
                </div>
            </CardContent>
            <CardFooter className="gap-0 px-[10px]">
                <div className="flex gap-2.5 items-center w-full">
                    <div className="flex gap-2.5 text-blue-500 items-center">
                        <span className="material-symbols-outlined">checklist</span>
                        <p className="text-[20px]">{ patrolAllItems }</p>
                    </div>
                    <div className="flex gap-2.5 text-yellow-500 items-center">
                        <span className="material-symbols-outlined">checklist</span>
                        <p className="text-[20px]">{ patrolAllComments }</p>
                    </div>
                    <div className="flex gap-2.5 text-red-500 items-center">
                        <span className="material-symbols-outlined">checklist</span>
                        <p className="text-[20px]">{ patrolAllDefects }</p>
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
                                {t('PatrolDetails')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                {t('PatrolDelete')}
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
        <Card className="bg-accent-gradient flex justify-center items-center w-full h-[225px]">
            <span className="material-symbols-outlined text-card text-9xl">note_add</span>
        </Card>
    );
}