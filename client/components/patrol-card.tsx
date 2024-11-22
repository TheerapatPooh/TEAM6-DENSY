"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { PatrolChecklist, patrolStatus, User } from "@/app/type";
import { getInitials } from "@/lib/utils";
import { fetchData } from "@/lib/api";
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
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";

export interface patrolCardProps {
  patrolStatus: patrolStatus;
  patrolDate: Date;
  patrolPreset: string;
  patrolId: number;
  patrolChecklist: PatrolChecklist[]
  inspector: User[];
}

export function PatrolCard({
  patrolStatus,
  patrolDate,
  patrolPreset,
  patrolId,
  patrolChecklist,
  inspector = [],
}: patrolCardProps) {
  const formattedDate =
    patrolDate instanceof Date
      ? patrolDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "N/A"; // Fallback if patrolDate is not valid
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [profile, setProfile] = useState<User[]>();
  const [items, setItems] = useState(0);
  const [fails, setFails] = useState(0);
  const [defects, setDefects] = useState(0);

  const [mounted, setMounted] = useState(false);

  const router = useRouter()
  const locale = useLocale()
  const getData = async () => {
    try {
      const profilefetch = await fetchData("get", "/profiles", true);
      setProfile(profilefetch);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const getPatrolData = async () => {
    try {
      let countItems = 0;
      let countFails = 0;
      let countDefects = 0;

      if (patrolChecklist) {
        for (const patrolChecklistObj of patrolChecklist) {
          if (patrolChecklistObj.checklist && patrolChecklistObj.checklist.item) {
            for (const item of patrolChecklistObj.checklist.item) {
              if (item.itemZone) {
                countItems += item.itemZone.length;
              }
            }
          }
        }
      }

      if (patrolStatus !== 'pending' && patrolStatus !== 'scheduled') {
        const resultFetch = await fetchData("get", `/patrol/${patrolId}/result`, true);
        if (resultFetch?.result) {
          for (const patrolResult of resultFetch.result) {
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
    getData();
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
    router.push(`/${locale}/patrol/${patrolId}`)
  }

  const inspectorNames = inspector.map((insp) => insp.profile.name).filter(Boolean);
  if (!mounted) {
    return (
      null
    )
  }

  return (
    <Card className="custom-shadow border-none w-full h-[230px] hover:bg-secondary cursor-pointer" onClick={() => handleDetail()}>
      <CardHeader className="gap-0 p-[10px]">
        <div className="flex justify-between items-center">
          <CardDescription className="text-lg font-semibold">
            {formattedDate}
          </CardDescription>
          {patrolStatus === ("pending" as patrolStatus) ? (
            <div className="flex items-center justify-center rounded-full bg-blue-300/40 w-10 h-10 custom-shadow">
              <span className="material-symbols-outlined text-blue-500">
                hourglass_top
              </span>
            </div>
          ) : patrolStatus === ("scheduled" as patrolStatus) ? (
            <div className="flex items-center justify-center rounded-full bg-yellow-300/40 w-10 h-10 custom-shadow">
              <span className="material-symbols-outlined text-yellow-500">
                event_available
              </span>
            </div>
          ) : patrolStatus === ("on_going" as patrolStatus) ? (
            <div className="flex items-center justify-center rounded-full bg-purple-300/40 w-10 h-10 custom-shadow">
              <span className="material-symbols-outlined text-purple-500">
                cached
              </span>
            </div>
          ) : patrolStatus === ("completed" as patrolStatus) ? (
            <div className="flex items-center justify-center rounded-full bg-green-300/40 w-10 h-10 custom-shadow">
              <span className="material-symbols-outlined text-green-500">
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
        </div>
        <CardTitle className="card-foreground text-2xl truncate">
          {patrolPreset}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-0 px-[10px] py-0">
        <div className="flex gap-2.5 text-muted-foreground items-center">
          <span className="material-symbols-outlined">description</span>
          <p className="text-xl">{patrolId}</p>
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
            <div className="flex text-muted-foreground items-center overflow-hidden pb-2">
              <span className="material-symbols-outlined me-2.5">
                engineering
              </span>
              {inspectorNames.length > 0 && (
                <div className="flex items-center me-2.5 truncate max-w-[190px]">
                  <p className="text-xl me-2.5 truncate">{inspectorNames[0]}</p>
                </div>
              )}
              {Array.from(new Set(inspectorNames.slice(0, 4))).map((inspectorName, idx) => {
                const matchingProfile = profile?.find(
                  (profile) => profile.profile.name === inspectorName
                );

                return (
                  <Avatar key={idx} className="custom-shadow ms-[-10px]">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${matchingProfile?.profile?.image?.path}`}
                      alt={inspectorName}
                    />
                    <AvatarFallback>
                      {getInitials(inspectorName)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}

              {inspectorNames.length > 5 && (
                <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                  <AvatarImage src="" />
                  <span className="absolute text-card-foreground text-[16px] font-semibold">
                    +{inspectorNames.length - 5}
                  </span>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-full border-none custom-shadow">
            <div className="flex items-center justify-center">
              <span className="material-symbols-outlined me-2.5">
                engineering
              </span>
              <p className="text-lg font-medium text-center">
                {t("InspectorList")}
              </p>
            </div>
            {Array.from(new Set(inspectorNames.slice(0, 4))).map((inspectorName, idx) => {
              const matchingProfile = profile?.find(
                (profile) => profile.profile.name === inspectorName
              );
              return (
                <div key={idx} className="flex items-center p-2">
                  <Avatar className="custom-shadow ms-[-10px] me-2.5">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${matchingProfile?.profile?.image?.path}`}
                    />
                    <AvatarFallback>
                      {getInitials(inspectorName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-[20px]">{inspectorName}</p>
                </div>
              );
            })}
          </HoverCardContent>
        </HoverCard>
      </CardContent>
      <CardFooter className="gap-0 px-[10px]">
        <div className="flex gap-2.5 items-center w-full">
          <div className="flex gap-2.5 text-blue-500 items-center">
            <span className="material-symbols-outlined">checklist</span>
            <p className="text-[20px] font-semibold">{items}</p>
          </div>
          <div className="flex gap-2.5 text-yellow-500 items-center">
            <span className="material-symbols-outlined">close</span>
            <p className="text-[20px] font-semibold">{fails}</p>
          </div>
          <div className="flex gap-2.5 text-red-500 items-center">
            <span className="material-symbols-outlined text-red-500">
              error
            </span>
            <p className="text-[20px] font-semibold">{defects}</p>
          </div>
          <div className="ml-auto items-center">
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="w-[45px] h-[45px]">
                  <span className="material-symbols-outlined items-center text-muted-foreground">
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
                                `/patrol/${patrolId}`,
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
    <Card className="bg-accent-gradient border-none flex justify-center items-center w-full h-[225px] hover:bg-accent-gradient-hover cursor-pointer custom-shadow">
      <span className="material-symbols-outlined text-card text-9xl">
        note_add
      </span>
    </Card>
  );
}
