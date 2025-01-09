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
import { formatPatrolId, getInitials } from "@/lib/utils";
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
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";

export interface IPatrolCard {
  id: number;
  date: Date;
  status: patrolStatus;
  preset: IPreset;
  itemCounts: number;
  inspectors: IUser[];
  onRemoveSuccess,
}

export function PatrolCard({
  id,
  date,
  status,
  preset,
  itemCounts,
  inspectors = [],
  onRemoveSuccess
}: IPatrolCard) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState(0);
  const [fails, setFails] = useState(0);
  const [defects, setDefects] = useState(0);

  const [mounted, setMounted] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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
  const a = useTranslations("Alert");

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
    router.push(`/${locale}/patrol/${id}/detail`)
  }

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleRemovePatrol = () => {
    setPendingAction(() => () => removePatrol());
    handleOpenDialog();
  };

  const removePatrol = async () => {
    if (status !== 'pending') {
      toast({
        variant: "error",
        title: a("PatrolRemoveErrorTitle"),
        description: a("PatrolRemoveErrorDescription"),
      });
      return;
    }
    try {
      await fetchData("delete", `/patrol/${id}`, true);
    } catch (error) {
      console.error(error)
    }
    if (onRemoveSuccess) {
      onRemoveSuccess(id); // เรียก Callback หลังลบสำเร็จ
    }
  }

  if (!mounted) {
    return (
      null
    )
  }

  console.log("inspector patrolcard", inspectors)

  return (
    <Card className="flex flex-col custom-shadow border-none w-full px-6 py-4 h-fit gap-4  hover:bg-secondary cursor-pointer" onClick={() => handleDetail()}>
      <CardHeader className="flex flex-row gap-0 p-0 justify-between ">
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
          <p className="text-lg font-normal">{formatPatrolId(id)}</p>
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
              {inspectors.length > 0 && (
                <div className="flex items-center me-1 truncate max-w-[190px]">
                  <p className="text-xl me-2.5 truncate">{inspectors[0].profile.name}</p>
                </div>
              )}
              {inspectors.map((inspector, idx) => {
                return (
                  <Avatar key={idx} className="custom-shadow ms-[-10px]">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                    />
                    <AvatarFallback id={inspector.id.toString()}>
                      {getInitials(inspector.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}

              {inspectors.length > 5 && (
                <Avatar className="custom-shadow flex items-center justify-center ms-[-10px]">
                  <AvatarImage src="" />
                  <span className="absolute text-card-foreground text-[16px] font-semibold">
                    +{inspectors.length - 5}
                  </span>
                  <AvatarFallback id={'0'}></AvatarFallback>
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
            {inspectors.map((inspector, idx) => {
              return (
                <div key={idx} className="flex items-center w-full py-2 gap-1 border-b-2 border-secondary">
                  <Avatar className="custom-shadow ms-[-10px] me-2.5">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${inspector?.profile?.image?.path}`}
                    />
                    <AvatarFallback id={inspector.id.toString()}>
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
                {inspectors.length}
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
                <DropdownMenuItem onClick={(e) => {
                  handleDetail()
                }}>
                  <h1>{t("Detail")}</h1>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleRemovePatrol()
                }}>
                  <h1 className="text-destructive cursor-pointer">{t("Delete")}</h1>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isDialogOpen && (
            <AlertCustom
              title={a("PatrolRemoveConfirmTitle")}
              description={a("PatrolRemoveConfirmDescription")}
              primaryButtonText={t("Confirm")}
              primaryIcon="check"
              secondaryButtonText={t("Cancel")}
              backResult={handleDialogResult}
            ></AlertCustom>
          )}
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
