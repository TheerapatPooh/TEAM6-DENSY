/**
 * คำอธิบาย:
 *  หน้าแสดงรายละเอียดข้อบกพร่องตาม id ที่ระบุ
 * Input: 
 * - ไม่มี
 * Output:
 * - แสดงรายละเอียดข้อบกพร่องตาม id ที่ระบุ และสามารถดำเนินการต่อได้ตามสถานะของข้อบกพร่องนั้นๆ
 * - สามารถ Accept ข้อบกพร่อง หรือ Resolve ข้อบกพร่องได้
 * - สามารถแนบรูปภาพหลังการแก้ไขข้อบกพร่องได้
 **/

"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import { fetchData, formatTime, getDefectStatusVariant, getItemTypeVariant } from "@/lib/utils";
import { IDefect } from "@/app/type";
import { notFound, useParams, useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { defectStatus } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import { useLocale, useTranslations } from "next-intl";
import AlertDefect from "@/components/alert-defect";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [defect, setDefect] = useState<IDefect>();
  const param = useParams();
  const [isBeforeCarouselOpen, setIsBeforeCarouselOpen] = useState(false);
  const [isAfterCarouselOpen, setIsAfterCarouselOpen] = useState(false);
  const [beforeSlideIndex, setBeforeSlideIndex] = useState(0);
  const [afterSlideIndex, setAfterSlideIndex] = useState(0);
  const [beforeApi, setBeforeApi] = useState<CarouselApi | null>(null);
  const [afterApi, setAfterApi] = useState<CarouselApi | null>(null);

  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");
  const router = useRouter()
  const locale = useLocale()

  // Handle before image click
  const handleBeforeImageClick = () => {
    setIsBeforeCarouselOpen(true);
  };

  // Handle after image click
  const handleAfterImageClick = () => {
    setIsAfterCarouselOpen(true);
  };

  // Close before carousel
  const handleCloseBeforeCarousel = () => {
    setIsBeforeCarouselOpen(false);
  };

  // Close after carousel
  const handleCloseAfterCarousel = () => {
    setIsAfterCarouselOpen(false);
  };

  useEffect(() => {
    if (beforeApi) {
      beforeApi.on("select", () => {
        setBeforeSlideIndex(beforeApi.selectedScrollSnap());
      });
    }
  }, [beforeApi]);

  useEffect(() => {
    if (beforeApi && beforeSlideIndex !== null) {
      beforeApi.scrollTo(beforeSlideIndex);
    }
  }, [beforeSlideIndex, beforeApi]);

  useEffect(() => {
    if (afterApi) {
      afterApi.on("select", () => {
        setAfterSlideIndex(afterApi.selectedScrollSnap());
      });
    }
  }, [afterApi]);

  useEffect(() => {
    if (afterApi && afterSlideIndex !== null) {
      afterApi.scrollTo(afterSlideIndex);
    }
  }, [afterSlideIndex, afterApi]);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataDefect = await fetchData("get", `/defect/${param.id}`, true);
        setDefect(dataDefect);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      } finally {
        setMounted(true);
      }
    };
    getData();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleDefectUpdate = async (status: string) => {
    const data = {
      status: status,
      defectUserId: defect.userId,
      patrolResultId: defect.patrolResultId,
    };

    try {
      const response = await fetchData("put", `/defect/${defect.id}`, true, data);
      if (response) {
        setDefect(response)
      };
    } catch (error) {
      console.error("Update Fail", error);
    }
  };

  const handleAcceptDefect = () => {
    setPendingAction(() => () => {
      handleDefectUpdate("in_progress")
      toast({
        variant: "success",
        title: a("DefectAcceptTitle"),
        description: a("DefectAcceptDescription"),
      });
    });
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const fetchRealtimeData = (defect: IDefect) => {
    setDefect(defect)
  }

  if (!mounted) {
    return <Loading />;
  }

  if (!defect?.images) {
    return notFound();
  }

  const beforeImage = defect?.images
    .sort((a, b) => b.image.id - a.image.id) // เรียงจาก id ล่าสุดไปเก่าสุด
    .filter((image) => image.image.user.id === defect.userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null;

  const afterImage = defect?.images
    .sort((a, b) => b.image.id - a.image.id) // เรียงจาก id ล่าสุดไปเก่าสุด
    .filter((image) => image.image.user.id !== defect.userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null;

  return (
    <div className="bg-card rounded-md custom-shadow flex flex-col px-6 py-4 gap-4">
      {/* Title section */}
      <div className="w-full  flex justify-between">
        <div>
          <div className="text-xl font-semibold text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-2xl">
              schedule
            </span>
            <p>{formatTime(defect.startTime)}</p>
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            {defect.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant={"secondary"} size="lg" onClick={() => router.push(`/${locale}/defect`)}>{t("Back")}</Button>
          {(() => {
            let iconName: string;
            let text: string;
            let variant:
              | "link"
              | "default"
              | "secondary"
              | "destructive"
              | "success"
              | "fail"
              | "outline"
              | "ghost"
              | "primary"
              | null
              | undefined;
            let disabled: boolean;
            let handleFunction: any;
            switch (defect.status as defectStatus) {
              case "completed":
                variant = "primary";
                iconName = "published_with_changes";
                text = "Resolve";
                disabled = true;
                break;
              case "pending_inspection":
                variant = "primary";
                iconName = "update";
                text = "Accept";
                disabled = false;
                handleFunction = () => {
                  handleAcceptDefect();
                };
                break;
              case "in_progress":
                variant = "primary";
                iconName = "published_with_changes";
                text = "Resolve";
                disabled = false;
                handleFunction = () => {
                  // handleStartPatrol();
                };
                break;
              case "resolved":
                variant = "primary";
                iconName = "edit";
                text = "Edit";
                disabled = false;
                break;
              default:
                variant = "primary";
                iconName = "update";
                text = "Accept";
                disabled = false;
                handleFunction = () => {
                  handleAcceptDefect();
                };
                break;
            }
            return (
              <>
                {defect.status === "in_progress" ?
                  <AlertDefect
                    defect={defect}
                    type={"resolve"}
                    response={(defect: IDefect) => {
                      fetchRealtimeData(defect)
                    }} /> :

                  defect.status === "resolved" ?
                    <AlertDefect
                      defect={defect}
                      type={"edit-resolve"}
                      response={(defect: IDefect) => {
                        fetchRealtimeData(defect)
                      }} /> :

                    <Button
                      size="lg"
                      variant={variant}
                      onClick={handleFunction}
                      disabled={disabled}
                    >
                      <span className="material-symbols-outlined">{iconName}</span>
                      {t(text)}
                    </Button>
                }
              </>
            );
          })()}

          {isDialogOpen && (
            <AlertCustom
              title={a("AcceptDefectConfirmTitle")}
              description={a("AcceptDefectConfirmDescription")}
              primaryButtonText={t("Confirm")}
              primaryIcon="check"
              secondaryButtonText={t("Cancel")}
              backResult={handleDialogResult}
            ></AlertCustom>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="material-symbols-outlined text-2xl ">
            location_on
          </span>
          <h1 className="text-base font-semibold">{t("Zone")}</h1>
        </div>
        <h1 className="">{z(defect.patrolResult.itemZone.zone.name)}</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <BadgeCustom variant={getDefectStatusVariant(defect.status).variant} showIcon={true}>
            <div className="flex justify-center gap-2">
              <span className="material-symbols-outlined">
                {getDefectStatusVariant(defect.status).iconName}
              </span>
              {s(defect.status)}
            </div>
          </BadgeCustom>

          <BadgeCustom shape="square" variant={getItemTypeVariant(defect.type).variant} showIcon={true}>
            <div className="flex justify-center gap-2">
              <span className="material-symbols-outlined">
                {getItemTypeVariant(defect.type).iconName}
              </span>
              {s(defect.type)}
            </div>
          </BadgeCustom>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-col items-center gap-2">
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-base font-semibold text-muted-foreground">
                <span className="material-symbols-outlined ">person_search</span>
                <p>{t("inspector")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-[35px] w-[35px]">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                  />
                  <AvatarFallback id={defect.user.id.toString()}>
                    {getInitials(defect.user.profile.name)}
                  </AvatarFallback>
                </Avatar>
                <p>{defect.user.profile.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <div className="grid grid-cols-12 gap-6 ">
          <div className="col-span-full text-muted-foreground ">
            <p className="text-base font-semibold">{t("Detail")}</p>

            <div className="bg-secondary rounded-md h-40 w-full items-center p-4">
              <p className="text-[20px] text-card-foreground">
                {defect.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Before After */}
      <div className="grid grid-cols-2 gap-4 w-full h-full mb-4">
        {/* before */}
        <div className="flex flex-col w-full min-h-full">
          <div className="flex items-center">
            <p className="text-base font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
              {t("Before")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex sm:max-h-[263px] lg:min-h-[500px] lg:max-h-[700px]">
              <AspectRatio ratio={4 / 3} className="bg-secondary rounded-md sm:max-h-[263px] lg:min-h-[500px] lg:max-h-[700px]">
                <div
                  className="flex items-center justify-center cursor-default user-select-none w-full h-full"
                  onClick={() => handleBeforeImageClick()}
                >
                  {beforeImage &&
                    beforeImage.length > 0 &&
                    beforeImage[beforeSlideIndex].path ? ( // ใช้ beforeSlideIndex ที่อัปเดต
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${beforeImage[beforeSlideIndex].path}`} // ใช้ path จาก state
                      alt="First Image"
                      width={800}
                      height={600}
                      className="rounded-md object-cover cursor-pointer w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <span className="material-symbols-outlined text-border text-4xl">
                        hourglass_empty
                      </span>
                      <p className="text-muted-foreground text-lg font-medium">
                        {t('WaitingForResults')}
                      </p>
                    </div>
                  )}
                </div>
              </AspectRatio>
            </div>

            {/* Thumbnail images slider */}
            <ScrollArea className="min-w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 pb-4">
                {beforeImage &&
                  beforeImage.length > 0 &&
                  beforeImage.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setBeforeSlideIndex(index)}
                      className={`flex justify-center w-[128px] h-[128px] cursor-pointer rounded-md ${beforeSlideIndex === index ? 'border border-destructive' : ''
                        }`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image.path}`}
                        alt={`Thumbnail ${index}`}
                        width={128}
                        height={128}
                        className="object-cover rounded-md"
                        unoptimized
                      />
                    </div>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {isBeforeCarouselOpen && beforeImage && beforeImage.length > 0 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative">
                  <Carousel setApi={setBeforeApi} className="sm:max-w-screen-sm lg:max-w-[1600px]">
                    <CarouselContent>
                      {beforeImage.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center">
                            <Card className="bg-card border-none">
                              <CardContent className="flex items-center justify-center h-[400px] w-full md:h-[500px] lg:h-[700px] overflow-hidden p-4">
                                <div className="flex items-center justify-center h-full w-full">
                                  <Image
                                    className="object-contain w-full h-full"
                                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image.path}`}
                                    alt={`${image.path}`}
                                    width={800}
                                    height={600}
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
                        onClick={() => setBeforeSlideIndex(index)} // ใช้ index ในการเลือก slide
                        className={`h-3 w-3 rounded-full mx-1 ${beforeSlideIndex === index ? "bg-white" : "bg-gray-400"}`}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleCloseBeforeCarousel}
                  className="absolute top-4 right-4 text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* after */}
        <div className="flex flex-col w-full min-h-full">
          <div className="flex items-center">
            <p className="text-base font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
              {t("After")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex sm:max-h-[263px] lg:min-h-[500px] lg:max-h-[700px]">
              <AspectRatio ratio={4 / 3} className="bg-secondary rounded-md sm:max-h-[263px] lg:min-h-[500px] lg:max-h-[700px]">
                <div
                  className="flex items-center justify-center cursor-default user-select-none w-full h-full"
                  onClick={() => handleAfterImageClick()}
                >
                  {afterImage && afterImage.length > 0 && afterImage[afterSlideIndex].path ? ( // ใช้ afterSlideIndex ที่อัปเดต
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${afterImage[afterSlideIndex].path}`} // ใช้ path จาก state
                      alt="Second Image"
                      width={800}
                      height={600}
                      className="rounded-md object-cover cursor-pointer w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <span className="material-symbols-outlined text-border text-4xl">
                        hourglass_empty
                      </span>
                      <p className="text-muted-foreground text-lg font-medium">
                        {t('WaitingForResults')}
                      </p>
                    </div>
                  )}
                </div>
              </AspectRatio>
            </div>


            {/* Thumbnail images slider */}
            <ScrollArea className="min-w-full w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 pb-4">
                {afterImage &&
                  afterImage.length > 0 &&
                  afterImage.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setAfterSlideIndex(index)}
                      className={`flex justify-center min-w-[128px] h-[128px] cursor-pointer rounded-md ${afterSlideIndex === index ? 'border border-destructive' : ''
                        }`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image.path}`}
                        alt={`Thumbnail ${index}`}
                        width={128}
                        height={128}
                        className="object-cover rounded-md"
                        unoptimized
                      />
                    </div>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>


            {isAfterCarouselOpen && afterImage && afterImage.length > 0 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative">
                <Carousel setApi={setAfterApi} className="sm:max-w-screen-sm lg:max-w-[1600px]">
                    <CarouselContent>
                      {afterImage.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center">
                            <Card className="bg-card border-none">
                              <CardContent className="flex items-center justify-center h-[400px] w-full md:h-[500px] lg:h-[700px] overflow-hidden p-4">
                                <div className="flex items-center justify-center h-full w-full">
                                  <Image
                                    className="object-contain w-full h-full"
                                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image.path}`}
                                    alt={`${image.path}`}
                                    width={800}
                                    height={600}
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
                        onClick={() => setAfterSlideIndex(index)} // ใช้ index ในการเลือก slide
                        className={`h-3 w-3 rounded-full mx-1 ${afterSlideIndex === index ? "bg-white" : "bg-gray-400"}`}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleCloseAfterCarousel}
                  className="absolute top-4 right-4 text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
