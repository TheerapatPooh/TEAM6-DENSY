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
import { useParams, useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { defectStatus } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import { useLocale, useTranslations } from "next-intl";
import AlertDefect from "@/components/alert-defect";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [defect, setDefect] = useState<IDefect>();
  const param = useParams();
  const [isBeforeCarouselOpen, setIsBeforeCarouselOpen] = useState(false);
  const [isAfterCarouselOpen, setIsAfterCarouselOpen] = useState(false);
  const [beforeSlideIndex, setBeforeSlideIndex] = useState(0);
  const [afterSlideIndex, setAfterSlideIndex] = useState(0);
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");
  const router = useRouter()
  const locale = useLocale()

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

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setAfterSlideIndex(api.selectedScrollSnap());
      setBeforeSlideIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataDefect = await fetchData("get", `/defect/${param.id}`, true);
        setDefect(dataDefect);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
    setMounted(true);
  }, []);



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

  if (!mounted || !defect) {
    return <Loading />;
  }

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
                      }} />  :

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
            <p className="text-[16px] font-semibold">{t("Detail")}</p>

            <div className="bg-secondary rounded-lg h-40 w-full items-center p-4">
              <p className="text-[20px] text-card-foreground">
                {defect.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Before After */}
      <div className="flex w-full space-x-4 mb-4">
        <div className="flex space-x-4 w-full">
          {/* before */}
          <div className="w-full">
            <div className="flex items-center">
              <p className="text-[16px] font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
                {t("Before")}
              </p>
            </div>

            <div>
              <div
                className="p-4 rounded-md bg-secondary h-96 flex items-center justify-center cursor-default user-select-none"
                onClick={() => handleBeforeImageClick(0)}
              >
                {beforeImage &&
                  beforeImage.length > 0 &&
                  beforeImage[0].path ? (
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
              {isBeforeCarouselOpen &&
                beforeImage &&
                beforeImage?.length > 0 && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative">
                      <Carousel
                        setApi={setApi}
                        className="w-full max-w-screen-lg"
                      >
                        <CarouselContent>
                          {Array.from({ length: beforeImage.length }).map(
                            (_, index) => (
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
                            )
                          )}
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
                            className={`h-3 w-3 rounded-full mx-1 ${beforeSlideIndex === index
                              ? "bg-white"
                              : "bg-gray-400"
                              }`}
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
          <div className="w-full">
            <div className="flex items-center">
              <p className="text-[16px] font-semibold text-muted-foreground mb-1 cursor-default user-select-none">
                {t("After")}
              </p>
            </div>

            <div>
              <div
                className="p-4 rounded-md bg-secondary h-96 flex items-center justify-center cursor-default user-select-none"
                onClick={() => handleAfterImageClick(0)}
              >
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
                    <Carousel
                      setApi={setApi}
                      className="w-full max-w-screen-lg"
                    >
                      <CarouselContent>
                        {Array.from({ length: afterImage.length }).map(
                          (_, index) => (
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
                          )
                        )}
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
                          className={`h-3 w-3 rounded-full mx-1 ${afterSlideIndex === index
                            ? "bg-white"
                            : "bg-gray-400"
                            }`}
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
    </div>
  );
}
