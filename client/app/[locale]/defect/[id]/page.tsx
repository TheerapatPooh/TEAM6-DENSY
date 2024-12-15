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
import { fetchData, formatTime } from "@/lib/utils";
import { IDefect } from "@/app/type";
import { useParams } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { defectStatus } from "../../../type";
import { AlertCustom } from '../../../../components/alert-custom';
import { title } from "process";
import { badgeVariants } from '../../../../components/badge-custom';
import { timeStamp } from "console";


export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [defect, setDefect] = useState<IDefect>();
  const param = useParams();
  const [isBeforeCarouselOpen, setIsBeforeCarouselOpen] = useState(false);
  const [isAfterCarouselOpen, setIsAfterCarouselOpen] = useState(false);
  const [beforeSlideIndex, setBeforeSlideIndex] = useState(0);
  const [afterSlideIndex, setAfterSlideIndex] = useState(0);

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
        console.log(dataDefect)
        setDefect(dataDefect);
        setStatusColorDefect(statusColor[dataDefect.status]);
        setTypeColorDefect(typeColor[dataDefect.type]);
        setstatusIconDefect(statusIcon[dataDefect.status]);
        setTypeIconDefect(typeIcon[dataDefect.type]);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
    setMounted(true);
  }, []);
  console.log(defect);

  
  let beforeImage =
    defect?.images
      .filter((image) => image.image.user.id === defect.userId)
      .map((image: any) => ({
        path: image.image.path,
      })) || null;

  let afterImage =
    defect?.images
      .filter((image) => image.image.user.id !== defect.userId)
      .map((image: any) => ({
        path: image.image.path,
      })) || null;

  const statusColor: Record<
    | "reported"
    | "in_progress"
    | "pending_inspection"
    | "resolved"
    | "completed",
    string
  > = {
    reported: "orange",
    in_progress: "yellow",
    pending_inspection: "red",
    resolved: "blue",
    completed: "green",
  };
  const [statusColorDefect, setStatusColorDefect] = useState();

  const typeColor: Record<"safety" | "environment" | "maintenance", string> = {
    safety: "green",
    environment: "cyan",
    maintenance: "purple",
  };
  const [typeColorDefect, setTypeColorDefect] = useState();

  const statusIcon: Record<
    | "reported"
    | "in_progress"
    | "pending_inspection"
    | "resolved"
    | "completed",
    string
  > = {
    reported: "campaign",
    in_progress: "cached",
    pending_inspection: "pending_actions",
    resolved: "published_with_changes",
    completed: "check_circle",
  };
  const [statusIconDefect, setstatusIconDefect] = useState();

  const typeIcon: Record<"safety" | "environment" | "maintenance", string> = {
    safety: "verified_user",
    environment: "source_environment",
    maintenance: "manufacturing",
  };
  const [typeIconDefect, setTypeIconDefect] = useState();


const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  
  const handleDefectUpdate = async (status: string) => {
    const data = {
      status: status, 
      defectUserId: defect.userId, 
      patrolResultId: defect.patrolResultId,
    }
    console.log(data)

    try {
      await fetchData(
        'put', 
        `/defect/${defect.id}`,
         true, 
         data
        );
    } catch (error) {
      console.error("Accept Fail", error);
    }
    
  };
  const handleAcceptDefect = () => {
    setPendingAction(() => () => handleDefectUpdate("in_progress"));
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

  if (!defect) {
    return <Loading />;
  }



  return (

    <div className="min-h-screen ">
      <div className="p-4 ">
        <div className="bg-card rounded-lg shadow-lg p-4 ">
          {/* Title section */}
          <div className="h-[64px] w-full  flex justify-between ">
            <div>
              <h1 className="text-xl font-bold flex items-center">
                <span className="material-symbols-outlined text-2xl mr-2">
                  schedule
                </span>
                {formatTime(defect.startTime)}
              </h1>
              <div>{defect.name}</div>
            </div>
            <div className="flex gap-2 ">
              <Button variant={"secondary"} className="h-[45px] w-[100px]">
                Back
              </Button>
              
              <Button onClick={handleAcceptDefect} variant={"primary"} className="h-[45px] w-[132px]">
                <span className="material-symbols-outlined">update</span>
                Accept
              </Button>
              {isDialogOpen && (
                <AlertCustom 
              title={"Are you sure to accept defect?"} 
              description={"Please confirm to accept defect."} 
              primaryBottonText={"Confirm"} 
              primaryIcon="check"
              secondaryBottonText={"Cancel"} 
              backResult={handleDialogResult} >
              </AlertCustom>)}
              

              
              
              
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <div className="flex gap-2">
              <BadgeCustom
                variant={statusColorDefect}
                showIcon={true}
              >
                <div className="flex justify-center gap-2">
                  <span className="material-symbols-outlined">
                    {statusIconDefect}
                  </span>
                  {defect.status}
                </div>
              </BadgeCustom>

              <BadgeCustom
                shape="squre"
                variant={typeColorDefect}
                showIcon={true}
              >
                <div className="flex justify-center gap-2">
                  <span className="material-symbols-outlined">
                    {typeIconDefect}
                  </span>
                  {defect.type}
                </div>
              </BadgeCustom>
            </div>

            <div className="flex items-center mt-2 justify-between gap-[100px]">
              <div className="flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="flex">
                    <span className="material-symbols-outlined ">
                      person_alert
                    </span>
                    <div className="ml-2 text-sm text-gray-500">Reporter</div>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <Avatar className="h-[24px] w-[24px]">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                      />
                      <AvatarFallback>
                        {getInitials(defect.user.profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className=" text-sm text-gray-500">Joe Dohn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="grid grid-cols-12 gap-6 ">
              
              <div className="col-span-full text-gray-500 ">
                <p className="text-[16px]">
                  Detail
                  </p>
                
                <div className="bg-secondary rounded-lg  h-40 w-full items-center p-4">
                  <p className="text-[20px] text-card-foreground" >{defect.description}</p>
                </div>
                
              </div>
            </div>
            <div>
              {/* Right section - takes 5 columns */}
              <div className="col-span-full">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-gray-500">location_on</span>
                  <div className=" text-sm text-gray-500 text-[16px]" >Zone</div>
                </div>

                <div className="bg-secondary rounded-lg p-4 w-full h-[894px] flex items-center justify-center">
                  {/* Display image */}
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
                    <p className="text-base font-semibold text-gray-500 mb-1 cursor-default user-select-none">
                      Before
                    </p>
                  </div>

                  <div>
                    <div className="p-4 rounded-md bg-background h-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleBeforeImageClick(0)}>
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
                    <p className="text-base font-semibold text-gray-500 mb-1 cursor-default user-select-none">
                      After
                    </p>
                  </div>

                  <div>
                    <div className="p-4 rounded-md bg-background h-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleAfterImageClick(0)}>
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
          
          
        </div>
      </div>
    </div>
  );
}