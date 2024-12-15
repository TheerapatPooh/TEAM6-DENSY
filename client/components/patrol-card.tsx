"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { patrolStatus, IUser, IPreset, IPatrol } from "@/app/type";
import { getInitials } from "@/lib/utils";
import { fetchData } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export interface IPatrolCard {
  id: number;
  date: Date;
  status: patrolStatus;
  preset: IPreset;
  itemCounts: number;
  inspectors: IUser[];
}

export function PatrolCard({
  id,
  date,
  status,
  preset,
  itemCounts,
  inspectors = [],
}: IPatrolCard) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState(0);
  const [fails, setFails] = useState(0);
  const [defects, setDefects] = useState(0);

  const [mounted, setMounted] = useState(false);

  const router = useRouter()
  const locale = useLocale()

  const formattedDate =
    date instanceof Date
      ? date.toLocaleDateString(`${locale}-GB`, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "N/A"; // Fallback if date is not valid

  const getPatrolData = async () => {
    try {
      let countItems = itemCounts;
      let countFails = 0;
      let countDefects = 0;

      if (status !== 'pending' && status !== 'scheduled') {
        const resultFetch: Partial<IPatrol> = await fetchData("get", `/patrol/${id}?result=true`, true);
        if (resultFetch?.results) {
          for (const patrolResult of resultFetch.results) {
            if (patrolResult.status === false) {
              countFails++;
              if (patrolResult.defects && patrolResult.defects.length !== 0) {
                countDefects += patrolResult.defects.length;
              }
            }
          }
        }
      }
      setItems(countItems);
      setFails(countFails);
      setDefects(countDefects);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  useEffect(() => {
    getPatrolData();
    setMounted(true);
  }, []);

  const t = useTranslations("General");

  const handleClick = () => {
    setIsClicked((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDetail = () => {
    router.push(`/${locale}/patrol/${id}`)
  }

  const uniqueInspectors: Partial<IUser[]> = inspectors.reduce((acc, insp) => {
    // เช็คว่าชื่อยังไม่อยู่ใน accumulator หรือไม่
    if (!acc.some(item => item.profile.name === insp.profile.name)) {
      acc.push(insp); // ถ้าไม่ซ้ำก็เพิ่มเข้าไป
    }
    return acc;
  }, []);

  if (!mounted) {
    return (
      null
    )
  }

  return (
    <Card className="flex flex-col custom-shadow border-none w-full px-6 py-4 h-fit gap-4  hover:bg-secondary cursor-pointer" onClick={() => handleDetail()}>
      <CardHeader className="flex flex-row gap-0 p-0">
        <div className="flex flex-col justify-between items-start gap-4 truncate">
          <CardDescription className="text-lg font-semibold text-muted-foreground">
            {formattedDate}
          </CardDescription>
          <CardTitle className="text-card-foreground text-2xl truncate">
            {preset.title}
          </CardTitle>
        </div>
        {status === ("pending" as patrolStatus) ? (
          <div className="flex items-center justify-center rounded-full bg-primary/20 w-9 h-9 custom-shadow">
            <span className="material-symbols-outlined text-primary">
              hourglass_top
            </span>
          </div>
        ) : status === ("scheduled" as patrolStatus) ? (
          <div className="flex items-center justify-center rounded-full bg-yellow/20 w-9 h-9 custom-shadow">
            <span className="material-symbols-outlined text-yellow">
              event_available
            </span>
          </div>
        ) : status === ("on_going" as patrolStatus) ? (
          <div className="flex items-center justify-center rounded-full bg-purple/20 w-9 h-9 custom-shadow">
            <span className="material-symbols-outlined text-purple">
              cached
            </span>
          </div>
        ) : status === ("completed" as patrolStatus) ? (
          <div className="flex items-center justify-center rounded-full bg-green/20 w-9 h-9 custom-shadow">
            <span className="material-symbols-outlined text-green">
              check
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-full bg-red-300/40 w-10 h-10 custom-shadow">
            <span className="material-symbols-outlined text-red-500">
              error
            </span>
          </div>
        )}

      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex text-muted-foreground items-center gap-1">
          <span className="material-symbols-outlined">description</span>
          <p className="text-lg font-normal">{id}</p>
        </div>
        <HoverCard open={isClicked || isHovered}>
          <HoverCardTrigger
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            asChild
          >
            <div className="flex text-muted-foreground items-center">
              <span className="material-symbols-outlined me-1">
                person_search
              </span>
              {uniqueInspectors.length > 0 && (
                <div className="flex items-center me-1 truncate max-w-[190px]">
                  <p className="text-xl me-2.5 truncate">{uniqueInspectors[0].profile.name}</p>
                </div>
              )}
              {uniqueInspectors.map((inspector, idx) => {
                return (
                  <Avatar key={idx} className="custom-shadow ms-[-10px]">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                    />
                    <AvatarFallback>
                      {getInitials(inspector.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}

              {uniqueInspectors.length > 5 && (
                <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                  <AvatarImage src="" />
                  <span className="absolute text-card-foreground text-[16px] font-semibold">
                    +{uniqueInspectors.length - 5}
                  </span>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col w-fit border-none gap-4 px-6 py-4 custom-shadow">
            <div className="flex items-center justify-center gap-1">
              <span className="material-symbols-outlined">
                person_search
              </span>
              <p className="text-lg font-semibold">
                {t("InspectorList")}
              </p>
            </div>
            {uniqueInspectors.map((inspector, idx) => {
              return (
                <div key={idx} className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary">
                  <Avatar className="custom-shadow ms-[-10px] me-2.5">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                    />
                    <AvatarFallback>
                      {getInitials(inspector.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-lg">{inspector.profile.name}</p>
                </div>
              );
            })}
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <p className="text-lg font-semibold">
                {t("Total")}
              </p>
              <p className="text-lg font-semibold">
                {uniqueInspectors.length}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardContent>
      <CardFooter className="p-0 gap-0">
        <div className="flex gap-2 items-center w-full">
          <div className="flex gap-1 text-primary items-center">
            <span className="material-symbols-outlined">checklist</span>
            <p className="text-xl font-semibold">{items}</p>
          </div>
          <div className="flex gap-1 text-orange items-center">
            <span className="material-symbols-outlined">close</span>
            <p className="text-xl font-semibold">{fails}</p>
          </div>
          <div className="flex gap-1 text-destructive items-center">
            <span className="material-symbols-outlined">
              error
            </span>
            <p className="text-xl font-semibold">{defects}</p>
          </div>
          <div className="ml-auto items-center">
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="w-[45px] h-[45px]">
                  <span className="material-symbols-outlined items-center text-input">
                    more_vert
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="p-0">
                <DropdownMenuItem onClick={() => handleDetail()}>
                  <h1>{t("Detail")}</h1>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="pl-2 py-2" onClick={(e) => e.stopPropagation()}>
                      <div
                        className=" text-destructive cursor-pointer w-full h-full flex"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {t("Delete")}
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your patrol and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>{t('Cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async (e) => {
                            try {
                              await fetchData(
                                "delete",
                                `/patrol/${id}`,
                                true
                              );
                              e.stopPropagation()
                              window.location.reload();
                            } catch (error) {
                              console.error("Error deleting patrol:", error);
                            }
                          }}
                        >
                          {t("Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
    <Card className="bg-accent-gradient border-none flex justify-center items-center min-h-[249px] w-full h-full hover:bg-accent-gradient-hover cursor-pointer custom-shadow">
      <span className="material-symbols-outlined text-card text-8xl">
        note_add
      </span>
    </Card>
  );
}
