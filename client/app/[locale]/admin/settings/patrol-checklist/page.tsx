/**
 * คำอธิบาย:
 *  หน้าแสดงรายการ Checklist ทั้งหมดในระบบ โดยสามารถค้นหา Checklist ได้ และสามารถค้นหา Checklist ตาม Zone และ Date ได้
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงรายการ Checklist ทั้งหมดในระบบ โดยแสดงรายละเอียดของ Checklist แต่ละรายการ และสามารถค้นหา Checklist ได้ และสามารถค้นหา Checklist ตาม Zone และ Date ได้
 * - สามารถคลิกเพื่อดูรายละเอียดของ Checklist แต่ละรายการ
 * - สามารถคลิกเพื่อสร้าง Checklist ใหม่ได้
**/
"use client";
import { IChecklist, IZone } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import Textfield from "@/components/textfield";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fetchData } from "@/lib/utils";

import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DatePickerWithRange } from "@/components/date-picker";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotFound from "@/components/not-found";
import { VersionTooltip } from "@/components/version-tooltip";
import { ZoneTooltip } from "@/components/zone-tooltip";
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function PatrolChecklistListPage() {
  const z = useTranslations("Zone");
  const t = useTranslations("General");
  const a = useTranslations("Alert");

  const router = useRouter();
  const locale = useLocale();
  interface IChecklistWithExtras extends IChecklist {
    zones: string[]; // New field
    itemCounts: Record<string, number>; // Another new field
    versionCount: number;
  }

  const handleDeleteChecklist = async (id: number) => {
    toast({
      variant: "success",
      title: a("ChecklistRemoveSuccessTitle"),
      description: a("ChecklistRemoveSuccessDescription"),
    });
    try {
      const response = await fetchData("delete", `/checklist/${id}`, true);

      if (response) {
        setFilteredChecklists((prevChecklists) =>
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
    router.push(`/${locale}/admin/settings/patrol-checklist/${id}`);
  };

  const handleGoToCreateChecklist = () => {
    router.push(`/${locale}/admin/settings/patrol-checklist/create`);
  };
  // Modify the getData function to use fetchData
  const getData = async () => {
    try {
      // Construct query params for the filters
      const params = new URLSearchParams();

      // Add search term to params
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      // Add selected zones to params
      if (selectedZones.length > 0) {
        params.append(
          "zones",
          selectedZones.map((zone) => zone.name).join(",")
        );
      }

      // Add date range to params
      if (selectedDateRange?.from) {
        params.append("startDate", selectedDateRange.from.toISOString());
      }
      if (selectedDateRange?.to) {
        params.append("endDate", selectedDateRange.to.toISOString());
      }

      // Fetch data using fetchData utility with query params
      const data = await fetchData(
        "get",
        `/checklists?${params.toString()}`,
        true
      );

      // Validate data format
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return []; // Return empty array if data format is incorrect
      }

      setFilteredChecklists(data); // Initially set filtered data to all data

      return data; // Return fetched data
    } catch (error) {
      console.error("Failed to fetch checklist data:", error); // Log error
      return []; // Return empty array on error
    }
  };

  // Trigger the fetch on component mount using useEffect
  useEffect(() => {
    getData();
  }, []); // Initial fetch when the component mounts

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<
    "Name" | "ModifiedDate" | "Type"
  >("Name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedZones, setSelectedZones] = useState<IZone[]>([]);
  const [tempSelectedZones, setTempSelectedZones] = useState<IZone[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [tempDateRange, setTempDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [filteredChecklists, setFilteredChecklists] = useState<
    IChecklistWithExtras[]
  >([]);

  // Filter by search term
  const filterBySearchTerm = (checklists: IChecklistWithExtras[]) => {
    if (!searchTerm) return checklists; // If no search term, return all checklists
    return checklists.filter((checklist) =>
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Fetch and apply search filter on search term change
  useEffect(() => {
    const fetchAndFilter = async () => {
      const freshData = await getData(); // Fetch fresh data
      const filtered = filterBySearchTerm(freshData); // Apply search term filter
      setFilteredChecklists(filtered); // Update state with filtered data
    };

    fetchAndFilter();
  }, [searchTerm]); // Trigger fetch when search term changes

  // Apply filters (zones, date range, and search term)
  const applyFilters = async () => {
    const freshData = await getData(); // Fetch fresh data

    // Update selected filters
    setSelectedZones(tempSelectedZones);
    setSelectedDateRange(tempDateRange);

    // Apply filters for zones and date range
    const filtered = freshData.filter((checklist) => {
      const matchesZones =
        tempSelectedZones.length === 0 || // If no zones are selected, show all
        checklist.zones.some((zone) =>
          tempSelectedZones.some(
            (selectedZone) =>
              selectedZone.name.toLowerCase() === zone.toLowerCase()
          )
        );

      const matchesDateRange =
        (!tempDateRange?.from ||
          new Date(checklist.updatedAt) >= tempDateRange.from) &&
        (!tempDateRange?.to ||
          new Date(checklist.updatedAt) <= tempDateRange.to);

      return matchesZones && matchesDateRange;
    });

    // Apply search term filter
    const filteredWithSearch = filterBySearchTerm(filtered);
    setFilteredChecklists(filteredWithSearch); // Update the filtered state
  };

  // Reset filters to default
  const resetFilters = async () => {
    setTempSelectedZones([]); // Reset temp selected zones
    setTempDateRange({}); // Reset temp date range
    setSelectedZones([]); // Clear applied zones
    setSelectedDateRange({}); // Clear applied date range
  };

  const [sortedChecklists, setSortedChecklists] = useState<
    IChecklistWithExtras[]
  >([]);

  useEffect(() => {
    const sorted = [...filteredChecklists].sort((a, b) => {
      let comparison = 0;

      if (sortOption === "Name") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortOption === "ModifiedDate") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortOption === "Type") {
        const typeA = getChecklistColor(a);
        const typeB = getChecklistColor(b);

        comparison = typeA.localeCompare(typeB);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setSortedChecklists(sorted); // Update sorted checklists state
  }, [filteredChecklists, sortOption, sortOrder]); // Dependencies to trigger the effect
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row justify-between pt-2">
        <div className="text-2xl font-bold">{t("SettingsPatrolChecklist")}</div>
        <Button
          onClick={() => {
            handleGoToCreateChecklist();
          }}
          className="flex flex-row gap-2 custom-shadow"
          variant="primary"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <div className="text-lg">{t("CreateChecklist")}</div>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px]
                     bg-card w-auto h-[40px] gap-[10px] inline-flex items-center
                     justify-center rounded-md text-sm font-medium`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg">{t("Sort")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 gap-2">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("SortBy")}
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
                {t("Name")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="ModifiedDate"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("DateModified")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Type"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Type")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("Order")}
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
                {t("Ascending")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="desc"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Descending")}
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
            <div className="text-lg">{t("Filter")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div className="flex flex-col gap-2">
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Date")}
              </DropdownMenuLabel>
              <DatePickerWithRange
                className="my-date-picker"
                startDate={tempDateRange?.from || selectedDateRange?.from}
                endDate={tempDateRange?.to || selectedDateRange?.to}
                onSelect={(range) => {
                  if (range?.from || range?.to) {
                    setTempDateRange(range);
                  }
                }}
              />
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Zone")}
              </DropdownMenuLabel>
              <AlertDialog>
                <AlertDialogTrigger
                  asChild
                  className="flex items-center gap-2 rounded cursor-pointer"
                >
                  <Button
                    variant={"secondary"}
                    className="w-full h-[36px] rounded-md bg-secondary justify-start text-left gap-[2px] font-normal text-base"
                  >
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    <p className="truncate w-[200px]">
                      {selectedZones.length > 0
                        ? selectedZones.map((zone) => z(zone.name)).join(", ")
                        : t("SelectZones")}
                    </p>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="w-full sm:w-[40%] md:w-[50%] lg:w-[100%] max-w-[1200px] rounded-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">
                      {t("FilterByZoneTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      {t("FilterByZoneDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div>
                    <div className="text-muted-foreground flex items-center">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      {t("Zone")}
                    </div>
                    <div className="flex justify-center bg-secondary rounded-lg py-4">
                      <Map
                        disable={false}
                        initialSelectedZones={selectedZones.map(
                          (zone) => zone.id
                        )}
                        onZoneSelect={(zones: IZone[]) =>
                          setTempSelectedZones(zones)
                        }
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogAction
                      className="bg-primary"
                      onClick={() => {
                        setSelectedZones(tempSelectedZones); // Apply selected zones
                      }}
                    >
                      {t("Done")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex w-full justify-end mt-4 gap-2">
              <Button size="sm" variant="secondary" onClick={resetFilters}>
                {t("Reset")}
              </Button>
              <Button variant="primary" size="sm" onClick={applyFilters}>
                {t("Apply")}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Checklist Cards */}
      <ScrollArea className="h-full w-full rounded-md flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-280px)]">
        <div className="space-y-4  rounded-lg">
          {sortedChecklists.length > 0 ? (
            sortedChecklists.map((checklist) => (
              <div key={checklist.id}>
                <div
                  onClick={() => {
                    handleChecklist(checklist.id);
                  }}
                  className={`flex flex-row border-l-[10px] truncate h-full cursor-pointer ${getChecklistColor(
                    checklist
                  )} border-destructive h-[166px] bg-card rounded-lg custom-shadow px-6 py-4 justify-between`}
                >
                  <div className="flex flex-col gap-4 min-w-0">
                    {/* Left Section */}
                    <div className="flex flex-col gap-1 justify-start items-start">
                      <VersionTooltip object={checklist}>
                        <div className="flex justify-center">
                          <span className="material-symbols-outlined mr-1">
                            history
                          </span>
                          {t("Version")} {checklist.version}
                        </div>
                      </VersionTooltip>
                      <h2 className="text-2xl font-semibold truncate">
                        {checklist.title}
                      </h2>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col gap-2 text-muted-foreground">
                      <div className="flex flex-row gap-2">
                        <span className="material-symbols-outlined text-muted-foreground">
                          location_on
                        </span>
                        <ZoneTooltip zonesName={checklist.zones}>
                          <p className="text-base text-muted-foreground font-semibold truncate w-[700px] whitespace-nowrap min-w-0">
                            {checklist.zones.map((zone) => z(zone)).join(", ")}
                          </p>
                        </ZoneTooltip>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-green text-2xl">
                            verified_user
                          </span>
                          <span className="ml-1 text-green font-semibold text-xl">
                            {checklist.itemCounts.safety || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-primary text-2xl">
                            psychiatry
                          </span>
                          <span className="ml-1 text-primary font-semibold text-xl">
                            {checklist.itemCounts.environment || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-destructive text-2xl">
                            build
                          </span>
                          <span className="ml-1 text-destructive font-semibold text-xl">
                            {checklist.itemCounts.maintenance || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky right-[0px]  flex flex-row items-end ">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        })}
                      >
                        <span className="material-symbols-outlined text-input">
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
                        <div className="text-lg cursor-pointer ">
                          {t("Edit")}
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePatrolChecklistDialog(checklist.id);
                          }}
                          className="text-destructive text-lg cursor-pointer hover:text-transparent-50"
                        >
                          {t("Delete")}
                        </div>
                        {isDialogOpen && dialogType === "delete" && (
                          <AlertCustom
                            title={a("ChecklistRemoveConfirmTitle")}
                            description={a("ChecklistRemoveConfirmDescription")}
                            primaryButtonText={t("Confirm")}
                            primaryIcon="check"
                            secondaryButtonText={t("Cancel")}
                            backResult={(result) => handleDialogResult(result)}
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full min-h-[261px]">
              <NotFound
                icon="quick_reference_all"
                title="NoChecklistsAvailable"
                description="NoChecklistsDescription"
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
