"use client";
import React, { useEffect, useState } from "react";
import { defectStatus, IDefect, IImage, IZone } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { fetchData, formatPatrolId, formatTime, getDefectStatusVariant, getInitials, getItemTypeVariant } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AlertDefect from "./alert-defect";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Map from "@/components/map";
import { AlertCustom } from "./alert-custom";
import { toast } from "@/hooks/use-toast";

interface ReportDefectProps {
  defect: IDefect,
  page: "patrol-view-detail" | "patrol-defect" | "patrol-view-report"
  response: (defect: IDefect) => void
}

export default function ReportDefect({ defect, page, response }: ReportDefectProps) {
  const s = useTranslations("Status");
  const t = useTranslations("General")
  const a = useTranslations("Alert")

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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


  const beforeImage = defect.images
    .sort((a, b) => b.image.id - a.image.id) // เรียงจาก id ล่าสุดไปเก่าสุด
    .filter((image) => image.image.user.id === defect.userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null;

  const afterImage = defect.images
    .sort((a, b) => b.image.id - a.image.id) // เรียงจาก id ล่าสุดไปเก่าสุด
    .filter((image) => image.image.user.id !== defect.userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null;

  const [isBeforeCarouselOpen, setIsBeforeCarouselOpen] = useState(false);
  const [isAfterCarouselOpen, setIsAfterCarouselOpen] = useState(false);
  const [beforeSlideIndex, setBeforeSlideIndex] = useState(0);
  const [afterSlideIndex, setAfterSlideIndex] = useState(0);

  const [alertBoxTitle, setAlertBoxTitle] = useState();
  const [alertBoxDescription, setAlertBoxDescription] = useState();
  const router = useRouter();
  const locale = useLocale();

  // Handle before image click
  const handleBeforeImageClick = (index: number) => {
    setBeforeSlideIndex(index);
    setIsBeforeCarouselOpen(true);
  };

  // Handle after image click
  const handleAfterImageClick = (index: number) => {
    setAfterSlideIndex(index);
    setIsAfterCarouselOpen(true);
  };

  // Close before carousel
  const handleCloseBeforeCarousel = () => {
    setIsBeforeCarouselOpen(false);
    setBeforeSlideIndex(0);
  };

  // Close after carousel
  const handleCloseAfterCarousel = () => {
    setIsAfterCarouselOpen(false);
    setAfterSlideIndex(0);
  };
  const handleReworkOrVerifyDefect = async (
    id: number,
    status: defectStatus,
    supervisorId: number
  ) => {
    let title
    let description
    if (status === 'pending_inspection') {
      title = 'ConfirmReworkTitle'
      description = 'ConfirmReworkDescription'
    } else if (status === 'completed') {
      title = 'ConfirmCompleteTitle'
      description = 'ConfirmCompleteDescription'
    }

    setPendingAction(() => () => {
      reworkOrVerifyDefect(id, status, supervisorId)
    });
    setAlertBoxTitle(title)
    setAlertBoxDescription(description)
    handleOpenDialog();
  };

  const reworkOrVerifyDefect = async (
    id: number,
    status: defectStatus,
    supervisorId: number
  ) => {
    const data = {
      status: status,
      supervisorId: supervisorId
    }

    try {
      let title
      let description
      if (data.status === 'pending_inspection') {
        title = 'ReworkDefectTitle'
        description = 'ReworkDefectDescription'
      } else if (status === 'completed') {
        title = 'CompleteDefectTitle'
        description = 'CompleteDefectDescription'
      }
      const updateStatusDefect = await fetchData(
        "put",
        `/defect/${id}`,
        true,
        data,
      );
      response(updateStatusDefect)
      toast({
        variant: "success",
        title: a(title),
        description: a(description),
      });
    } catch (error) {
      console.error("Error creating defect:", error);
    }
  }

  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }
    api.on("select", () => {
      setAfterSlideIndex(api.selectedScrollSnap())
      setBeforeSlideIndex(api.selectedScrollSnap())
    })
  }, [api])

  const fetchRealtimeData = (defect: IDefect) => {
    response(defect)
  }

  const navigateToPatrol = (patrolId: number) => {
    router.push(`/${locale}/patrol/${patrolId}/detail`)
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="bg-card rounded-md w-full px-4 py-2 border-none"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-muted-foreground cursor-default ">
              schedule
            </span>
            <span className="text-lg font-bold text-muted-foreground cursor-default ">
              {formatTime(defect.startTime)}
            </span>
            <h2 className="text-lg font-bold text-card-foreground cursor-default ">
              {defect.name}
            </h2>
          </div>
        </AccordionTrigger>

        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex space-x-2">
            {(() => {
              const { iconName, variant } = getDefectStatusVariant(defect.status);
              return (
                <BadgeCustom
                  variant={variant}
                  showIcon={true}
                  iconName={iconName}
                >
                  {s(defect.status)}
                </BadgeCustom>
              );
            })()}
            {(() => {
              const { iconName, variant } = getItemTypeVariant(defect.type);
              return (
                <BadgeCustom
                  variant={variant}
                  showIcon={true}
                  shape={"square"}
                  iconName={iconName}
                >
                  {s(defect.type)}
                </BadgeCustom>
              );
            })()}
          </div>
        </div>

        {/* หลังจากกดเปิด */}
        <AccordionContent>
          <div className="flex flex-col p-1">
            {/* supervisor */}
            <div className="flex flex-row justify-between w-full h-9 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="material-symbols-outlined">engineering</span>
                  <p className="text-lg font-semibold">{t("supervisor")}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Avatar className="custom-shadow h-[35px] w-[35px]">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.patrolResult.itemZone.zone.supervisor.profile.image?.path}`}
                    />
                    <AvatarFallback id={defect.patrolResult.itemZone.zone.supervisor.id.toString()}>
                      {getInitials(defect.patrolResult.itemZone.zone.supervisor.profile.name)}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-card-foreground text-lg">{defect.patrolResult.itemZone.zone.supervisor.profile.name}</p>
                </div>
              </div>
              <div>
                {defect.status === "reported" as defectStatus && (
                  <AlertDefect
                    defect={defect}
                    type={page == "patrol-view-detail" ? "report" : "edit"}
                    response={(defect: IDefect) => fetchRealtimeData(defect)}
                  />
                )}
              </div>
            </div>

            {/* Patrol */}
            {page === "patrol-defect" && (<div className="flex flex-col mb-4">
              <div className="flex flex-row mb-1">
                <div className="flex flex-row pr-2 items-center pt-1">
                  <span className="material-symbols-outlined text-muted-foreground cursor-default user-select-none mr-1">
                    task
                  </span>
                  <p className="text-base font-semibold text-muted-foreground  cursor-default user-select-none">
                    Patrol
                  </p>
                </div>
              </div>

              <Button className="w-fit h-fit bg-secondary" variant="ghost" onClick={() => navigateToPatrol(defect.patrolResult.patrol.id)}>
                <div className="flex flex-col items-start py-4 px-6">
                  <p className="text-xl font-semibold text-card-foreground mb-2 cursor-default user-select-none ">
                    {defect.patrolResult.patrol.preset.title}
                  </p>

                  <div className="flex flex-row items-center">
                    <span className="material-symbols-outlined text-muted-foreground cursor-default user-select-none pr-2">
                      description
                    </span>
                    <p className="text-muted-foreground cursor-default user-select-none">
                      {formatPatrolId(defect.patrolResult.patrol.id)}
                    </p>
                  </div>
                </div>
              </Button>
            </div>)}

            {/* Detail */}
            <div className="flex flex-col mb-4">
              <div className="flex flex-row mb-1">
                <div className="flex flex-row pr-2 items-center pt-1">
                  <span className="material-symbols-outlined text-muted-foreground cursor-default user-select-none mr-1">
                    data_info_alert
                  </span>
                  <p className="text-base font-semibold text-muted-foreground cursor-default user-select-none">
                    Detail
                  </p>
                </div>
              </div>

              <div>
                <Textarea
                  className="text-xl text-text w-full h-40 border-none bg-secondary pointer-events-none"
                  placeholder="Description"
                  value={defect.description}
                  readOnly
                />
              </div>
            </div>

            {/* Zone */}
            <div className="flex flex-col mb-4">
              <div className="flex flex-row mb-1">
                <div className="flex flex-row pr-2 items-center pt-1">
                  <span className="material-symbols-outlined text-muted-foreground cursor-default user-select-none mr-1">
                    location_on
                  </span>
                  <p className="text-base font-semibold text-muted-foreground cursor-default user-select-none">
                    Zone
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-md bg-secondary map-container cursor-default user-select-none ">
                <Map disable={true} initialSelectedZones={[defect.patrolResult.zoneId]} />
              </div>
            </div>

            {/* Before After */}
            <div className="flex w-full space-x-4 mb-4">
              <div className="flex space-x-4 w-full">
                {/* before */}
                <div className="w-full">
                  <div className="flex items-center">
                    <p className="text-base font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
                      Before
                    </p>
                  </div>

                  <div>
                    <div className="p-4 rounded-md bg-secondary h-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleBeforeImageClick(0)}>
                      {beforeImage && beforeImage.length > 0 && beforeImage[0].path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${beforeImage[0].path}`}
                          alt="First Image"
                          width={270}
                          height={250}
                          className="object-contain cursor-pointer w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <p>Waiting for the results.</p>
                      )}
                    </div>
                    {isBeforeCarouselOpen && beforeImage && beforeImage?.length > 0 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative">
                          <Carousel setApi={setApi} className="w-full max-w-screen-lg">
                            <CarouselContent>
                              {Array.from({ length: beforeImage.length }).map((_, index) => (
                                <CarouselItem key={index}>
                                  <div className="flex justify-center">
                                    <Card>
                                      <CardContent className="flex items-center justify-center h-[600px] w-[900px] overflow-hidden p-4">
                                        <div className="flex items-center justify-center h-full w-full">
                                          <Image
                                            className="object-contain w-full h-full"
                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${beforeImage[index].path}`}
                                            alt={`${beforeImage[index].path}`}
                                            width={800}
                                            height={500}
                                            priority
                                            unoptimized
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                          <div className="flex justify-center mt-4">
                            {beforeImage.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setBeforeSlideIndex(index);
                                }}
                                disabled
                                className={`h-3 w-3 rounded-full mx-1 ${beforeSlideIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                                aria-label={`Slide ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        <button onClick={handleCloseBeforeCarousel} className="absolute top-4 right-4 text-white">
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* after */}
                <div className="w-full">
                  <div className="flex items-center">
                    <p className="text-base font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
                      After
                    </p>
                  </div>

                  <div>
                    <div className="p-4 rounded-md bg-secondary h-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleAfterImageClick(0)}>
                      {afterImage && afterImage.length > 0 && afterImage[0].path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${afterImage[0].path}`}
                          alt="First Image"
                          width={270}
                          height={250}
                          className="object-contain cursor-pointer w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <p>Waiting for the results.</p>
                      )}
                    </div>
                    {isAfterCarouselOpen && afterImage && afterImage?.length > 0 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative">
                          <Carousel setApi={setApi} className="w-full max-w-screen-lg">
                            <CarouselContent>
                              {Array.from({ length: afterImage.length }).map((_, index) => (
                                <CarouselItem key={index}>
                                  <div className="flex justify-center">
                                    <Card>
                                      <CardContent className="flex items-center justify-center h-[600px] w-[900px] overflow-hidden p-4">
                                        <div className="flex items-center justify-center h-full w-full">
                                          <Image
                                            className="object-contain w-full h-full"
                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${afterImage[index].path}`}
                                            alt={`${afterImage[index].path}`}
                                            width={800}
                                            height={500}
                                            priority
                                            unoptimized
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                          <div className="flex justify-center mt-4">
                            {afterImage.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setAfterSlideIndex(index);
                                }}
                                disabled
                                className={`h-3 w-3 rounded-full mx-1 ${afterSlideIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                                aria-label={`Slide ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        <button onClick={handleCloseAfterCarousel} className="absolute top-4 right-4 text-white">
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {isDialogOpen && (
              <AlertCustom
                title={a(alertBoxTitle)}
                description={a(alertBoxDescription)}
                primaryButtonText={t("Confirm")}
                primaryIcon="check"
                primaryVariant="destructive"
                secondaryButtonText={t("Cancel")}
                backResult={handleDialogResult}
              ></AlertCustom>
            )}
            <div>
              {defect.status === "resolved" && page === "patrol-defect" && (
                <div className="flex space-x-2 justify-end">
                  <Button variant="destructive" size={"lg"} onClick={() => handleReworkOrVerifyDefect(defect.id, "pending_inspection", defect.patrolResult.itemZone.zone.supervisor.id)}>
                    <span className="material-symbols-outlined mr-2 text-[20px]">
                      cancel
                    </span>
                    Rework
                  </Button>
                  <Button variant="success" size={"lg"} onClick={() => handleReworkOrVerifyDefect(defect.id, "completed", defect.patrolResult.itemZone.zone.supervisor.id)}>
                    <span className="material-symbols-outlined mr-2 text-[20px]">
                      check_circle
                    </span>
                    Verify
                  </Button>
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion >
  );
}
