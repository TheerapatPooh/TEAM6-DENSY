"use client";
import { IChecklist, IItem, IUser, role } from "@/app/type";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";

export default function Page() {
  const z = useTranslations("Zone");

  const router = useRouter();
  const locale = useLocale();
  const a = useTranslations("Alert");
  interface IChecklistWithExtras extends IChecklist {
    updateByUserName: string;
    imagePath: string;
    zones: string[]; // New field
    itemCounts: Record<string, number>; // Another new field
    versionCount: number;
  }

  const [allChecklists, setAllChecklists] = useState<IChecklistWithExtras[]>(
    []
  );

  const handleDeleteChecklist = async (id: number) => {
    try {
      const response = await fetchData("delete", `/checklist/${id}`, true);

      if (response) {
        setAllChecklists((prevChecklists) =>
          prevChecklists.filter((checklist) => checklist.id !== id)
        );
      } else {
        console.error("Failed to delete checklist: No response from API");
      }
    } catch (error) {
      console.error("An error occurred while deleting the checklist:", error);
    }
  };

  const handleDeletePatrolChecklistDialog = async (id: number) => {
    setPendingAction(() => () => handleDeleteChecklist(id));
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
      setDialogType(""); // Reset the dialog type after action is completed
    }
  };

  const getChecklistColor = (checklist: IChecklistWithExtras): string => {
    let safety = checklist.itemCounts.safety || 0;
    let environment = checklist.itemCounts.environment || 0;
    let maintenance = checklist.itemCounts.maintenance || 0;

    // Find the highest value
    const maxValue = Math.max(safety, environment, maintenance);

    // Log the values for debugging
    console.log(`${safety}:${environment}:${maintenance}`);

    // Handle if all are equal
    if (safety === environment && environment === maintenance) {
      return "border-yellow"; // All are equal
    }

    // Handle cases where two values are tied and are the max
    if (safety === maxValue && environment === maxValue) {
      return "border-mint"; // Safety and environment are tied
    }
    if (environment === maxValue && maintenance === maxValue) {
      return "border-purple"; // Environment and maintenance are tied
    }
    if (safety === maxValue && maintenance === maxValue) {
      return "border-orange"; // Safety and maintenance are tied
    }

    // Handle single highest value
    if (safety === maxValue) {
      return "border-green"; // Safety has the highest value
    }
    if (environment === maxValue) {
      return "border-primary"; // Environment has the highest value
    }
    if (maintenance === maxValue) {
      return "border-destructive"; // Maintenance has the highest value
    }

    // Default fallback
    return ""; // Default color when none of the above conditions are met
  };

  const handleChecklist = (id: number) => {
    router.push(`/${locale}/admin/settings/checklistview/${id}`);
  };

  const handleGoToCreateChecklist = () => {
    router.push(`/${locale}/admin/settings/create/checklist`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData("get", "/checklists?item=true", true);
        setAllChecklists(data);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<
    "Name" | "ModifiedDate" | "Type"
  >("Name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtered Checklists
  const filteredChecklists = allChecklists.filter(
    (checklist) =>
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.zones.some((zone) =>
        zone.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const sortedChecklists = [...filteredChecklists].sort((a, b) => {
    let comparison = 0;

    if (sortOption === "Name") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortOption === "ModifiedDate") {
      comparison =
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortOption === "Type") {
      // Use `getChecklistColor` to determine type-based sorting
      const typeA = getChecklistColor(a);
      const typeB = getChecklistColor(b);

      comparison = typeA.localeCompare(typeB); // Compare the colors (or types)
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between pt-2">
        <div className="text-2xl font-bold">Checklists</div>

        <Button
          onClick={() => {
            handleGoToCreateChecklist();
          }}
          className="flex flex-row gap-2"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <div className="text-lg">Create Checklist</div>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px]
                     bg-card w-auto h-[40px] gap-[10px] inline-flex items-center
                     justify-center rounded-md text-sm font-medium`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg">Sort</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 gap-2">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              SortBy
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortOption}
              onValueChange={(value) =>
                setSortOption(value as "Name" | "ModifiedDate" | "Type")
              }
            >
              <DropdownMenuRadioItem
                value="Name"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                Name
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="ModifiedDate"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                Date modified
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Type"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                Type
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              Order
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "desc" | "asc")}
            >
              <DropdownMenuRadioItem
                value="asc"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="desc"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
                `}
          >
            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg">Filter</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                Type
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem onSelect={(e) => e.preventDefault()}>
                <BadgeCustom
                  width="w-full"
                  variant="green"
                  shape="square"
                  showIcon={true}
                  iconName="hourglass_top"
                  children="Pending"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onSelect={(e) => e.preventDefault()}>
                <BadgeCustom
                  width="w-full"
                  variant="blue"
                  shape="square"
                  showIcon={true}
                  iconName="hourglass_top"
                  children="Pending"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onSelect={(e) => e.preventDefault()}>
                <BadgeCustom
                  width="w-full"
                  variant="red"
                  shape="square"
                  showIcon={true}
                  iconName="hourglass_top"
                  children="Pending"
                />
              </DropdownMenuCheckboxItem>
            </div>

            <div className="flex w-full justify-end mt-4 gap-2">
              <Button size="sm" variant="secondary">
                Reset
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Checklist Cards */}

      <div className="space-y-4 p-4 rounded-lg">
        {filteredChecklists.length > 0 ? (
          sortedChecklists.map((checklist) => (
            <div key={checklist.id}>
              <div>
                <div
                  onClick={() => {
                    handleChecklist(checklist.id);
                  }}
                  className={`flex flex-row border-l-[10px] h-[166px] cursor-pointer ${getChecklistColor(
                    checklist
                  )} border-destructive h-[166px] bg-secondary rounded-lg shadow p-2 justify-between`}
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
                          <TooltipContent side="bottom" className="ml-[129px]">
                            <div className="flex flex-col gap-4 items-start bg-card rounded-lg h-[175px] w-[300px] px-6 py-4">
                              <span className="text-card-foreground text-lg font-bold flex items-center ">
                                <span className="material-symbols-outlined mr-1">
                                  history
                                </span>
                                Version {checklist.version}
                              </span>
                              <div className="flex flex-col justify-start items-start ">
                                <div className="flex flex-row justify-center items-center gap-2 text-muted-foreground">
                                  <div className="text-muted-foreground">
                                    Update By
                                  </div>
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
                                <div className="flex gap-2 text-muted-foreground">
                                  <div className="text-muted-foreground">
                                    Update At
                                  </div>
                                  {formatTime(checklist.updatedAt)}
                                </div>
                              </div>

                              <div className="flex justify-between  w-full">
                                <div className="font-bold text-lg text-muted-foreground">
                                  Total
                                </div>
                                <div className="font-bold text-lg text-muted-foreground">
                                  {checklist.versionCount}
                                </div>
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
                          {checklist.zones.map((zone) => z(zone)).join(", ")}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-[80px] px-4 py-2"
                        side="bottom"
                      >
                        <div className="text-lg cursor-pointer ">Detail</div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePatrolChecklistDialog(checklist.id);
                          }}
                          className="text-destructive text-lg cursor-pointer hover:text-transparent-50"
                        >
                          Delete
                        </div>
                        {isDialogOpen && dialogType === "delete" && (
                          <AlertCustom
                            title={
                              "Are you sure to delete this Patrol Checklist?"
                            }
                            description={
                              "Please confirm to delete this Patrol Checklist."
                            }
                            primaryBottonText={"Confirm"}
                            primaryIcon="check"
                            secondaryBottonText={"Cancel"}
                            backResult={(result) => handleDialogResult(result)}
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No checklists found.</p>
        )}
      </div>
    </div>
  );
}
