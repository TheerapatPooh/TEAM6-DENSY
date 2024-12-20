"use client";
import { IChecklist, IUser, role } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import BadgeCustom, { badgeVariants } from "@/components/badge-custom";
import Textfield from "@/components/textfield";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchData, formatTime, getInitials } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

export default function Page() {
  const a = useTranslations("Alert");
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  interface IChecklistWithExtras extends IChecklist {
    updateByUserName: string;
    imagePath: string;
    zones: string[]; // New field
    itemCounts: Record<string, number>; // Another new field
    versionCount: number;
  }

  const [allChecklists, setAllChecklistss] = useState<IChecklistWithExtras[]>(
    []
  );
  const getChecklistColor = (checklist: IChecklistWithExtras): string => {
    let safety = checklist.itemCounts.safety || 0;
    let environment = checklist.itemCounts.environment || 0;
    let maintenance = checklist.itemCounts.maintenance || 0;

    // Find the highest value
    const maxValue = Math.max(safety, environment, maintenance);

    // Log the values for debugging
    console.log(`${safety}:${environment}:${maintenance}`);

    // Handle if all are equal or if two are tied for the max value
    if (safety === environment && environment === maintenance) {
      return "border-rose-950"; // All are equal, return a mixed color (or any preferred color)
    }

    // Check for the highest value first
    if (safety === maxValue) {
      return "border-green"; // Safety has the highest value
    }
    if (environment === maxValue) {
      return "border-primary"; // Environment has the highest value
    }
    if (maintenance === maxValue) {
      return "border-destructive"; // Maintenance has the highest value
    }

    // Handle cases where two values are equal and not the maximum
    if (safety === environment) {
      return "border-mint"; // Safety and environment are equal
    }
    if (environment === maintenance) {
      return "border-purple"; // Environment and maintenance are equal
    }
    if (safety === maintenance) {
      return "border-orange"; // Safety and maintenance are equal
    }

    // Default fallback if no conditions are met
    return ""; // Default color when none of the above conditions are met
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData("get", "/checklists?item=true", true);
        setAllChecklistss(data);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen  p-6">
      {/* Top Section */}
      <div className=" justify-between items-center mb-6">
        <Tabs defaultValue="patrol_preset">
          <TabsList className="bg-secondary p-1 h-fit ">
            <TabsTrigger value="detail">
              <span className="material-symbols-outlined mr-2">
                data_info_alert
              </span>
              <p className="font-semibold">Patrol Preset</p>
            </TabsTrigger>
            <TabsTrigger value="patrol_checklist">
              <span className="material-symbols-outlined mr-2">Campaign</span>
              <p className="font-semibold">Patrol Checklist</p>
            </TabsTrigger>
            <TabsTrigger value="location_n_zone">
              <span className="material-symbols-outlined mr-2">Campaign</span>
              <p className="font-semibold">Location & Zone</p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patrol_preset"></TabsContent>
          <TabsContent value="patrol_checklist" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Textfield
                iconName="search"
                showIcon={true}
                placeholder="Search"
              />
              <div className="custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium">
                <span className="material-symbols-outlined">swap_vert</span>
                <div className="text-lg">Sort</div>
              </div>
              <div className="custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium">
                <span className="material-symbols-outlined">page_info</span>
                <div className="text-lg">Filter</div>
              </div>
            </div>

            {/* Checklist Cards */}

            <div className="space-y-4 bg-card p-4 rounded-lg">
              <div className="flex flex-row justify-between">
                <div className="text-2xl font-bold">Checklists</div>
                <Button className="flex flex-row gap-2">
                  <span className="material-symbols-outlined text-2xl">
                    add
                  </span>
                  <div className="text-lg">Create Checklist</div>
                </Button>
              </div>
              {allChecklists.map((checklist) => (
                <div key={checklist.id}>
                  <div>
                    <div
                      onClick={() => {
                        console.log("FUCK");
                      }}
                      className={`flex flex-row border-l-[10px] cursor-pointer  ${getChecklistColor(
                        checklist
                      )} border-destructive h-[166px]  bg-secondary rounded-lg shadow p-2  justify-between`}
                    >
                      <div className="flex flex-col gap-4 ">
                        {/* Left Section */}
                        <div className="gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="text-card-foreground text-[16px] flex items-center hover:bg-secondary m-0 p-0"
                                >
                                  <span className="material-symbols-outlined mr-1">
                                    history
                                  </span>
                                  Version {checklist.version}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="ml-[129px]"
                              >
                                <div className="flex flex-col gap-4 items-start bg-card rounded-lg h-[175px] w-[300px] px-6 py-4">
                                  <span className="text-card-foreground text-lg font-bold flex items-center ">
                                    <span className="material-symbols-outlined mr-1">
                                      history
                                    </span>
                                    Version {checklist.version}
                                  </span>
                                  <div className="flex flex-col justify-start items-start ">
                                    <div className="flex flex-row justify-center items-center gap-2 text-muted-foreground">
                                      <div className="text-muted-foreground">Update By</div>
                                      {checklist.imagePath === "" ? (
                                        <Avatar>
                                          <AvatarImage
                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${checklist.imagePath}`}
                                          />
                                          <AvatarFallback>
                                            {getInitials(
                                              checklist.updateByUserName
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                      )}

                                      {checklist.updateByUserName}
                                    </div>
                                    <div className="flex gap-2 text-muted-foreground" >
                                      <div className="text-muted-foreground" >Update At</div>
                                      {formatTime(checklist.updatedAt)}
                                    </div>
                                  </div>

                                  <div className="flex justify-between  w-full">
                                    <div className="font-bold text-lg text-muted-foreground">Total</div>
                                    <div className="font-bold text-lg text-muted-foreground">{checklist.versionCount}</div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <h2 className="text-2xl font-semibold">
                            {checklist.title}
                          </h2>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col gap-2 text-gray-500">
                          <div className="flex flex-row gap-2">
                            <span className="material-symbols-outlined  text-muted-foreground">
                              location_on
                            </span>
                            <p className="text-[16px] text-muted-foreground truncate">
                              {checklist.zones.join(", ")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-green text-xl">
                                verified_user
                              </span>
                              <span className="ml-1 text-green text-xl">
                                {checklist.itemCounts.safety || 0}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-blue-500 text-xl">
                                psychiatry
                              </span>
                              <span className="ml-1 text-blue-500 text-xl">
                                {checklist.itemCounts.environment || 0}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-destructive text-xl">
                                build
                              </span>
                              <span className="ml-1 text-destructive text-xl">
                                {checklist.itemCounts.maintenance || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className=" flex flex-row items-end ">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <span className="material-symbols-outlined">
                                more_vert
                              </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <h3 className="text-lg font-semibold">Version 1</h3>
                            <p className="text-sm text-gray-500">
                              {a("UpdatedBy")} 😎 {checklist.updatedBy}
                            </p>
                            <p className="text-sm text-gray-500">
                              {a("UpdatedAt")} {checklist.updatedAt}
                            </p>
                            <div className="mt-4">
                              <Button variant="secondary" className="mr-2">
                                Detail
                              </Button>
                              <Button variant="destructive">Delete</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="location_n_zone"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
