/**
 * คำอธิบาย:
 *  หน้าแสดงรายการ Preset ทั้งหมดในระบบ โดยสามารถค้นหา Preset ได้ และสามารถค้นหา Preset ตาม Zone และ Date ได้
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงรายการ Preset ทั้งหมดในระบบ โดยแสดงรายละเอียดของ Preset แต่ละรายการ และสามารถค้นหา Preset ได้ และสามารถค้นหา Preset ตาม Zone และ Date ได้
 * - สามารถคลิกเพื่อดูรายละเอียดของ Preset แต่ละรายการ
 * - สามารถคลิกเพื่อสร้าง Preset ใหม่ได้
 **/

"use client";
import { IPreset, IZone } from "@/app/type";
import Textfield from "@/components/textfield";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchData } from "@/lib/utils";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import dynamic from "next/dynamic";
import { DatePickerWithRange } from "@/components/date-picker";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import NotFound from "@/components/not-found";
import { VersionTooltip } from "@/components/version-tooltip";
import { ZoneTooltip } from "@/components/zone-tooltip";
import { TextTooltip } from "@/components/text-tooltip";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Page() {
  //แปลภาษา
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations("Zone");

  const router = useRouter();
  const locale = useLocale();
  interface IPresetWithExtras extends IPreset {
    updateByUserName: string;
    updateByUserImagePath: string;
  }

  // ลบจาก API removePreset
  const removePreset = async (id: number) => {
    toast({
      variant: "success",
      title: a("PresetRemoveSuccessTitle"),
      description: a("PresetRemoveSuccessDescription"),
    });
    try {
      const response = await fetchData("delete", `/preset/${id}`, true);

      if (response) {
        setAllPreset((prevPresets) =>
          prevPresets.filter((preset) => preset.id !== id)
        );
        setFilteredPresets((prev) => prev.filter((preset) => preset.id !== id));
      } else {
        console.error("Failed to delete Preset: No response from API");
      }
    } catch (error) {
      console.error("An error occurred while deleting the preset:", error);
    }
  };

  const handleRemovePreset = (id: number) => {
    setPendingAction(() => () => removePreset(id)); // ตั้งค่า Action ที่จะลบ
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const [allPreset, setAllPreset] = useState<IPresetWithExtras[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State สำหรับเปิด/ปิด Dialog
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null); // เก็บ Action ที่จะลบ
  const [dialogType, setDialogType] = useState<string>("");

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
      setDialogType("");
    }
  };

  const handleCreatePreset = () => {
    router.push(`/${locale}/admin/settings/patrol-preset/create`);
  };

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
        `/presets?${params.toString()}`,
        true
      );

      // Validate data format
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return []; // Return empty array if data format is incorrect
      }

      setFilteredPresets(data); // Initially set filtered data to all data

      return data; // Return fetched data
    } catch (error) {
      console.error("Failed to fetch preset data:", error); // Log error
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // search bar
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<"Name" | "ModifiedDate">("Name");
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
  const [filteredPreset, setFilteredPresets] =
    useState<IPresetWithExtras[]>(allPreset);

  // Filter by search term
  const filterBySearchTerm = (presets: IPresetWithExtras[]) => {
    if (!searchTerm) return presets;

    const cleanSearch = searchTerm.toLowerCase().trim();

    return presets.filter((preset) => {
      const titleMatch = preset.title.toLowerCase().includes(cleanSearch);
      const descMatch = preset.description?.toLowerCase().includes(cleanSearch);
      return titleMatch || descMatch;
    });
  };
  // Fetch and apply search filter on search term change
  useEffect(() => {
    const fetchAndFilter = async () => {
      const freshData = await getData(); // Fetch fresh data
      const filtered = filterBySearchTerm(freshData); // Apply search term filter
      setFilteredPresets(filtered); // Update state with filtered data
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
    const filtered = freshData.filter((preset) => {
      const matchesZones =
        tempSelectedZones.length === 0 || // If no zones are selected, show all
        preset.zones.some((zone) =>
          tempSelectedZones.some(
            (selectedZone) =>
              selectedZone.name.toLowerCase() === zone.name.toLowerCase()
          )
        );

      const matchesDateRange =
        (!tempDateRange?.from ||
          new Date(preset.updatedAt) >= tempDateRange.from) &&
        (!tempDateRange?.to || new Date(preset.updatedAt) <= tempDateRange.to);

      return matchesZones && matchesDateRange;
    });

    // Apply search term filter
    const filteredWithSearch = filterBySearchTerm(filtered);
    setFilteredPresets(filteredWithSearch); // Update the filtered state
  };

  const resetFilters = async () => {
    await fetchData("get", `/presets`, true);
    setTempSelectedZones([]);
    setTempDateRange({});
    setSelectedZones([]);
    setSelectedDateRange({});
  };

  const [sortedPresets, setSortedPresets] = useState<IPresetWithExtras[]>([]);

  useEffect(() => {
    const sorted = [...filteredPreset].sort((a, b) => {
      let comparison = 0;

      if (sortOption === "Name") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortOption === "ModifiedDate") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setSortedPresets(sorted); // Update sorted checklists state
  }, [filteredPreset, sortOption, sortOrder]); // Dependencies to trigger the effect

  const handleEdit = (id: number) => {
    // Find the preset by id from the sortedPresets array
    const preset = sortedPresets.find((p) => p.id === id);

    // Redirect to the error page if preset or zones are missing
    if (!preset?.zones?.length || !preset.zones.every((zone) => zone.userId)) {
      router.push(
        `/${locale}/admin/settings/patrol-preset/error/unassinged-zone`
      );
    } else {
      // If all zones have a userId, navigate to the patrol preset page
      router.push(`/${locale}/admin/settings/patrol-preset/${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row justify-between pt-2">
        <div className="text-2xl font-bold">{t("SettingsPatrolPreset")}</div>
        <Button
          variant="primary"
          className="flex flex-row gap-2"
          onClick={handleCreatePreset}
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <div className="text-lg">{t("CreatePreset")}</div>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium `}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg">{t("Sort")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 gap-2">
            {/* Sort By */}
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("SortBy")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortOption}
              onValueChange={(value) =>
                setSortOption(value as "Name" | "ModifiedDate")
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
            </DropdownMenuRadioGroup>

            {/* Sort Order */}
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
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium`}
          >
            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg">{t("Filter")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div>
              <div>
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
              </div>
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
                    className="w-full h-[36px] rounded-md bg-secondary justify-start text-left gap-[13px] font-normal text-base pl-2 flex"
                  >
                    <span className="material-symbols-outlined ml-1 shrink-0">
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

                  <AlertDialogContent className="w-full sm:w-[50%] md:w-[70%] lg:w-[100%] max-w-[1200px] rounded-md px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                        <p>{t("Zone")}</p>
                      </div>
                      <div className=" flex justify-center bg-secondary rounded-md py-4">
                        <Map
                          disable={false}
                          initialSelectedZones={selectedZones.map(
                            (zone) => zone.id
                          )}
                          onZoneSelect={(zones: IZone[]) =>
                            setTempSelectedZones(zones)
                          } // อัปเดต tempSelectedZones
                        />
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-primary"
                        onClick={() => {
                          // กด Done แค่เซฟชั่วคราวใน tempSelectedZones
                          setSelectedZones(tempSelectedZones);
                        }}
                      >
                        {t("Done")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
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
      <ScrollArea className="h-full overflow-hidden rounded-md flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-290px)]">
        <div className="space-y-4">
          {(() => {
            return sortedPresets.length > 0 ? (
              sortedPresets.map((preset) => (
                <div
                  onClick={() => {
                    handleEdit(preset.id);
                  }}
                  key={preset.id}
                  className="bg-card rounded-lg custom-shadow p-4 cursor-pointer h-[219px]"
                >
                  {/* Title and Details */}
                  <div className="flex justify-between overflow-hidden text-ellipsis">
                    <div className="flex flex-col gap-4 min-w-0">
                      <div className="flex flex-col gap-1 justify-start items-start">
                        {/* Version with Tooltip */}
                        <VersionTooltip object={preset}>
                          <div className="flex justify-center">
                            <span className="material-symbols-outlined mr-1">
                              history
                            </span>
                            {t("Version")} {preset.version}
                          </div>
                        </VersionTooltip>
                        {/* Title */}
                        <h2 className="text-xl font-semibold truncate">
                          {preset.title}
                        </h2>
                      </div>
                      {/* Zones */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                        <ZoneTooltip zones={preset.zones}>
                          <div className="text-base text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap w-[600px] truncate min-w-0">
                            {preset.zones && preset.zones.length > 0
                              ? preset.zones.map((zone, index) => (
                                <span
                                  key={index}
                                  className={
                                    zone.userId ? "" : "  text-destructive"
                                  }
                                >
                                  {z(zone.name)}
                                  {index < preset.zones.length - 1 && ", "}
                                </span>
                              ))
                              : z("NoZonesAvailable")}
                          </div>
                        </ZoneTooltip>
                      </div>
                      {/* Description */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="material-symbols-outlined">
                          data_info_alert
                        </span>
                        <TextTooltip object={preset.description}>

                          <div className="text-sm text-muted-foreground truncate w-[700px]">
                            {preset.description}
                          </div>
                        </TextTooltip>

                      </div>
                    </div>

                    {/* Action Buttons */}
                  </div>
                  <div className="flex flex-row justify-end items-end ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild
                        className={
                          buttonVariants({
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
                        <div
                          onClick={() => {
                            handleEdit(preset.id);
                          }}
                          key={preset.id}
                          className="text-lg cursor-pointer "
                        >
                          {t("Edit")}
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePreset(preset.id);
                          }}
                          className="text-destructive text-lg cursor-pointer hover:text-transparent-50"
                        >
                          {t("Delete")}
                        </div>

                        {/* แสดง AlertCustom เฉพาะเมื่อ dialogType === "delete" */}
                        {isDialogOpen && dialogType === "delete" && (
                          <AlertCustom
                            title={a("PresetRemoveConfirmTitle")}
                            description={a("PresetRemoveConfirmDescription")}
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
              ))
            ) : (
              <div className="col-span-full min-h-[261px]">
                <NotFound
                  icon="quick_reference_all"
                  title="NoFoundPresetsAvailable"
                  description="NotFoundPresetsDescription"
                />
              </div>
            );
          })()}
        </div>
      </ScrollArea>
    </div>
  );
}
