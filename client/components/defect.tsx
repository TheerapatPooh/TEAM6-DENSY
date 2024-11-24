"use client";
import React, { useEffect, useState } from "react";
import { IDefect, defectStatus, itemType, IZone } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";



export default function ReportDefect({
  id,
  name,
  description,
  type,
  status,
  timestamp,
  userId,
  patrolResult,
  image,
}: IDefect) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "blue";
      case "reported":
        return "mint";
      case "completed":
        return "green";
      case "in_progress":
        return "orange";
      default:
        return "red";
    }
  };

  const getIconForStatus = (status: string) => {
    switch (status) {
      case "resolved":
        return "autorenew";
      case "reported":
        return "campaign";
      case "completed":
        return "check_circle";
      case "in_progress":
        return "hourglass_top";
      default:
        return "pending";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "safety":
        return "mint";
      case "maintenance":
        return "purple"
      default:
        return "orange";
    }
  };

  const formatText = (name: string) => {
    switch (name) {
      case "safety":
        return "Safety";
      case "maintenance":
        return "Maintenance"
      case "environment":
        return "Environment"
      case "reported":
        return "Reported";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "completed":
        return "Completed";
      default:
        return "Pending Inspection";
    }
  }

  const date = new Date(timestamp).toLocaleDateString(
    "th-TH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const time = new Date(timestamp).toLocaleTimeString(
    "th-TH",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

  const beforeImage = image.filter((image) => image.image.user.id === userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null

  const afterImage = image.filter((image) => image.image.user.id !== userId)
    .map((image: any) => ({
      path: image.image.path,
    })) || null

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

  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }
    api.on("select", () => {
      setAfterSlideIndex(api.selectedScrollSnap())
      setBeforeSlideIndex(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="bg-secondary rounded-md w-full px-4 py-2 border-none"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#707A8A] cursor-default ">
              schedule
            </span>
            <span className="text-lg font-bold text-[#707A8A] cursor-default ">
              {date}
            </span>
            <span className="text-lg font-bold text-[#707A8A] cursor-default ">
              {time}
            </span>
            <h2 className="text-lg font-bold text-card-foreground cursor-default ">
              {name}
            </h2>
          </div>
        </AccordionTrigger>

        {/* โชว์ส่วนของ status, type, และปุ่ม Verify/Rework */}
        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex space-x-2">
            <BadgeCustom
              variant={getStatusVariant(status)}
              showIcon={true}
              iconName={getIconForStatus(status)}
            >
              {formatText(status)}
            </BadgeCustom>
            <BadgeCustom variant={getTypeVariant(type)}>{formatText(type)}</BadgeCustom>
          </div>

          {/* แสดงปุ่ม Verify และ Rework เฉพาะเมื่อ status เป็น Resolved */}
          {status === "resolved" && (
            <div className="flex space-x-2">
              <Button variant="success" size={"lg"}>
                <span className="material-symbols-outlined mr-2 text-[20px]">
                  check_circle
                </span>
                Verify
              </Button>
              <Button variant="destructive" size={"lg"}>
                <span className="material-symbols-outlined mr-2 text-[20px]">
                  cancel
                </span>
                Rework
              </Button>
            </div>
          )}
        </div>

        <AccordionContent>
          <div className="flex flex-col mt-4">
            <Textarea
              className="w-full h-40 bg-card "
              placeholder="Description"
              value={description}
              readOnly
            />
            <div className="flex space-x-4 justify-between mt-4">
              <div className="flex space-x-4">
                <div>
                  <div className="flex items-center">
                    <p className="text-gray-500 mb-2 cursor-default user-select-none">
                      Before
                    </p>
                    <button className="ml-2 focus:outline-none cursor-default user-select-none">
                      <span className="material-symbols-outlined text-gray-500 cursor-default user-select-none">
                        edit
                      </span>
                    </button>
                  </div>

                  <div>
                    <div className="border p-2 rounded-md bg-background h-40 w-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleBeforeImageClick(0)}>
                      {beforeImage && beforeImage.length > 0 && beforeImage[0].path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${beforeImage[0].path}`}
                          alt="First Image"
                          width={130}
                          height={130}
                          className="object-cover cursor-pointer"
                        />
                      ) : (
                        <p>No image available.</p>
                      )}
                    </div>
                    {isBeforeCarouselOpen && beforeImage && beforeImage?.length > 0 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative">
                          <Carousel setApi={setApi} className="w-full max-w-screen-lg">
                            <CarouselContent>
                              {Array.from({ length: beforeImage.length }).map((_, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1 flex justify-center">
                                    <Card>
                                      <CardContent className="flex items-center justify-center h-[500px] w-[800px] overflow-hidden">
                                        <div className="flex items-center justify-center h-full w-full">
                                          <Image
                                            className="object-contain"
                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${beforeImage[index].path}`}
                                            alt={`${beforeImage[index].path}`}
                                            width={800}
                                            height={500}
                                            priority
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

                <div>
                  <div className="flex items-center">
                    <p className="text-gray-500 mb-2 cursor-default user-select-none">
                      After
                    </p>
                  </div>

                  <div>
                    <div className="border p-2 rounded-md bg-background h-40 w-40 flex items-center justify-center cursor-default user-select-none" onClick={() => handleAfterImageClick(0)}>
                      {afterImage && afterImage.length > 0 && afterImage[0].path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${afterImage[0].path}`}
                          alt="First Image"
                          width={130}
                          height={130}
                          className="object-cover cursor-pointer"
                        />
                      ) : (
                        <p>No image available.</p>
                      )}
                    </div>
                    {isAfterCarouselOpen && afterImage && afterImage?.length > 0 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative">
                          <Carousel setApi={setApi} className="w-full max-w-screen-lg">
                            <CarouselContent>
                              {Array.from({ length: afterImage.length }).map((_, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1 flex justify-center">
                                    <Card>
                                      <CardContent className="flex items-center justify-center h-[500px] w-[800px]">
                                        <Image
                                          className="object-contain"
                                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${afterImage[index].path}`}
                                          alt={`${afterImage[index].path}`}
                                          width={750}
                                          height={450}
                                          priority
                                        />
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

              <div className="ml-auto">
                <p className="text-gray-500 mb-2 cursor-default user-select-none"></p>
                <div className="border p-2 rounded-md bg-background flex items-center justify-center h-48 w-48 cursor-default user-select-none">
                  {patrolResult.zoneId}
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion >
  );
}
