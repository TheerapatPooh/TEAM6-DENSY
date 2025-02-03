"use client";
import { IPreset, IZone } from "@/app/type";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchData, formatTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
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

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Page() {
  //แปลภาษา
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations("Zone");

  const [allPreset, setAllPreset] = useState<IPreset[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State สำหรับเปิด/ปิด Dialog
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null); // เก็บ Action ที่จะลบ

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

  const router = useRouter();
  const locale = useLocale();

  const handleEdit = (id: number) => {
    router.push(`/${locale}/admin/settings/patrol-preset/${id}`);
  };
  const handleCreatePreset = () => {
    router.push(`/${locale}/admin/settings/patrol-preset/create`);
  };

  const getData = async () => {
    try {
      const data = await fetchData("get", "/presets", true);
      setAllPreset(data);
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRemovePreset = (id: number) => {
    setPendingAction(() => () => removePreset(id)); // ตั้งค่า Action ที่จะลบ
    handleOpenDialog(); // เปิด Dialog ยืนยัน
  };
  const handleRemoveSuccess = (id: number) => {
    setAllPreset((prevPresets) =>
      prevPresets.filter((preset) => preset.id !== id)
    );

    toast({
      variant: "success",
      title: a("PresetRemoveSuccessTitle"),
      description: a("PresetRemoveSuccessDescription"),
    });
  };
  // ลบจาก API removePreset
  const removePreset = async (id: number) => {
    try {
      await fetchData("delete", `/preset/${id}`, true);
      handleRemoveSuccess(id);
    } catch (error) {
      console.error(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  // search bar

  const [isSortOpen, setIsSortOpen] = useState(false);
  // State สำหรับเก็บ sort type และ order
  const [sort, setSort] = useState<{ by: string; order: string }>({
    by: "ID", // default: sort by ID
    order: "Ascending", // default: ascending order
  });

  // ฟังก์ชันเปลี่ยนค่า Sort Type และ Order
  const handleSortChange = (type: string, value: string) => {
    setSort((prevSort) => ({
      ...prevSort,
      [type]: value,
    }));
  };

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
  const [filteredPreset, setFilteredPresets] = useState<IPreset[]>(allPreset);

  const filteredPresets = allPreset.filter((preset) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    // ค้นหาใน title, description และ zones
    const titleMatch = preset.title.toLowerCase().includes(lowerSearchTerm);
    const descriptionMatch = preset.description
      .toLowerCase()
      .includes(lowerSearchTerm);
    const zonesMatch =
      preset.zones &&
      Array.isArray(preset.zones) &&
      preset.zones.some((zone: string | { name: string }) => {
        const zoneKey = typeof zone === "string" ? zone : zone?.name;
        if (!zoneKey) return false;

        const translatedZone = z(zoneKey);
        return translatedZone.toLowerCase().includes(lowerSearchTerm);
      });

    // เพิ่มเงื่อนไข selectedZones
    const selectedZonesMatch =
      selectedZones.length === 0 || // ถ้าไม่มีการเลือกโซน จะแสดงทั้งหมด
      (preset.zones &&
        preset.zones.some((zone: string | { name: string }) => {
          const zoneKey = typeof zone === "string" ? zone : zone?.name;
          return selectedZones.some(
            (selectedZone) =>
              selectedZone.name.toLowerCase() === zoneKey.toLowerCase()
          );
        }));

    return (titleMatch || descriptionMatch || zonesMatch) && selectedZonesMatch;
  });

  // ฟังก์ชันจัดเรียงข้อมูล
  const sortedPresets = filteredPresets.sort((a, b) => {
    if (sort.by === "Date") {
      // จัดเรียงตามวันที่อัปเดต
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

      if (sort.order === "Ascending") {
        return dateA - dateB; // น้อยไปมาก (วันที่เก่าก่อน)
      } else {
        return dateB - dateA; // มากไปน้อย (วันที่ใหม่ก่อน)
      }
    } else if (sort.by === "Alphabet") {
      // จัดเรียงตามชื่อ (title)
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      if (sort.order === "Ascending") {
        return titleA.localeCompare(titleB); // A-Z
      } else {
        return titleB.localeCompare(titleA); // Z-A
      }
    }
    return 0; // หากไม่มีเงื่อนไข
  });

  const applyFilters = () => {
    const filtered = allPreset.filter((preset) => {
      const matchesZones =
        tempSelectedZones.length === 0 || // ถ้าไม่มีการเลือก Zone จะแสดงทั้งหมด
        preset.zones.some((zone) =>
          tempSelectedZones.some((selectedZone) => {
            const zoneName = zone?.name?.toLowerCase(); // ตรวจสอบ zone.name
            const selectedZoneName = selectedZone?.name?.toLowerCase(); // ตรวจสอบ selectedZone.name
  
            return zoneName && selectedZoneName && zoneName === selectedZoneName;
          })
        );
  
      const matchesDateRange =
        (!tempDateRange?.from ||
          new Date(preset.updatedAt) >= tempDateRange.from) &&
        (!tempDateRange?.to || new Date(preset.updatedAt) <= tempDateRange.to);
  
      return matchesZones && matchesDateRange;
    });
  
    // อัปเดต filteredPreset
    setSelectedZones(tempSelectedZones);
    setSelectedDateRange(tempDateRange);
    setFilteredPresets(filtered);
  };
  

  useEffect(() => {
    const fetchAndFilter = async () => {
      const freshData = allPreset; // ใช้ข้อมูลที่มีอยู่
      const filtered = freshData.filter((preset) => {
        const matchesDateRange =
          (!tempDateRange?.from ||
            new Date(preset.updatedAt) >= tempDateRange.from) &&
          (!tempDateRange?.to ||
            new Date(preset.updatedAt) <= tempDateRange.to);

        return matchesDateRange;
      });

      setFilteredPresets(filtered); // อัปเดตข้อมูลที่กรองแล้ว
    };

    fetchAndFilter();
  }, [tempDateRange]); // ทำงานเมื่อ tempDateRange เปลี่ยนแปลง

  const resetFilters = () => {
    setTempSelectedZones([]);
    setTempDateRange({});
    setSelectedZones([]);
    setSelectedDateRange({});
    setFilteredPresets(allPreset); // รีเซ็ตข้อมูลที่กรองแล้วเป็นทั้งหมด
  };

  return (
    <div>
      <div className="mb-4"></div>
      <div className="flex flex-row justify-between mb-4">
        <div className="text-2xl font-bold">{t("Settings Patrol Preset")}</div>
        <Button className="flex flex-row gap-2" onClick={handleCreatePreset}>
          <span className="material-symbols-outlined text-2xl">add</span>
          <div className="text-lg">{t("Create Preset")}</div>
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
          onChange={handleSearch}
          value={searchTerm}
        />
        <DropdownMenu onOpenChange={(open) => setIsSortOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
      ${isSortOpen ? "border border-destructive" : "border-none"}`}
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
              value={sort.by}
              onValueChange={(value) => handleSortChange("by", value)}
            >
              <DropdownMenuRadioItem
                value="Alphabet"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("SortByAlphabet")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Date"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("SortByDateModify")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            {/* Sort Order */}
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("Order")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.order}
              onValueChange={(value) => handleSortChange("order", value)}
            >
              <DropdownMenuRadioItem
                value="Ascending"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Ascending")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Descending"
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
                    className="w-full h-[36px] rounded-md bg-secondary justify-start text-left gap-[13px] font-normal text-base pl-2"
                  >
                    <span className="material-symbols-outlined ml-1">
                      location_on
                    </span>
                    {selectedZones.length > 0
                      ? selectedZones.map((zone) => z(zone.name)).join(", ")
                      : t("Select Zones")}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="w-full sm:w-[40%] md:w-[50%] lg:w-[100%] max-w-[1200px] rounded-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">
                      {t("Filter by Zone")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      {t(
                        "Please select the zones to display only the relevant data"
                      )}
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
                        setTempSelectedZones(tempSelectedZones);
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
              <Button size="sm" onClick={applyFilters}>
                {t("Apply")}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="bg-card rounded-lg shadow p-4  h-[220px]"
          >
            {/* Version with Tooltip */}
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
                    {t("Version")} {preset.version}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="ml-[129px]">
                  <div className="flex flex-col gap-4 items-start bg-card rounded-lg h-[175px] w-[300px] px-6 py-4">
                    <span className="text-card-foreground text-lg font-bold flex items-center ">
                      <span className="material-symbols-outlined mr-1">
                        history
                      </span>
                      {t("Version")} {preset.version}
                    </span>
                    <div className="flex flex-col justify-start items-start ">
                      <div className="flex flex-row justify-center items-center gap-2 text-muted-foreground">
                        <div className="text-muted-foreground">
                          {t("Update By")}
                        </div>
                        {(preset as any).updateByUserImagePath ? (
                          <Avatar>
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${
                                (preset as any).updateByUserImagePath
                              }`}
                            />
                            <AvatarFallback>
                              {(preset as any).updateByUserName
                                ?.charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Skeleton className="h-12 w-12 rounded-full" />
                        )}
                        {(preset as any).updateByUserName}
                      </div>
                      <div className="flex gap-2 text-muted-foreground">
                        <div className="text-muted-foreground">
                          {t("Update At")}
                        </div>
                        {formatTime(preset.updatedAt)}
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="font-bold text-lg text-muted-foreground">
                          {t("Total")}
                        </div>
                        <div className="font-bold text-lg text-muted-foreground">
                          {preset.version} {t("Version")}
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Title and Details */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                {/* Title */}
                <h2 className="text-xl font-semibold">{preset.title}</h2>

                {/* Zones */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="material-symbols-outlined">location_on</span>
                  <p className="truncate">
                    {preset.zones && preset.zones.length > 0
                      ? preset.zones.map((zone) => z(zone)).join(", ")
                      : z("NoZonesAvailable")}{" "}
                  </p>
                </div>

                {/* Description */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="material-symbols-outlined">
                    data_info_alert
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {preset.description}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
            </div>
            <div className="flex flex-col items-end gap-2 mt-5">
              <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="w-[45px] h-[45px]">
                    <span className="material-symbols-outlined items-center text-input">
                      more_vert
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="p-0">
                  <DropdownMenuItem
                    onClick={() => {
                      handleEdit(preset.id);
                    }}
                  >
                    <h1>{t("Detail")}</h1>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePreset(preset.id);
                    }}
                  >
                    <h1 className="text-destructive cursor-pointer">
                      {t("Delete")}
                    </h1>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isDialogOpen && (
                <AlertCustom
                  title={a("PresetRemoveConfirmTitle")}
                  description={a("PresetRemoveConfirmDescription")}
                  primaryButtonText={t("Confirm")}
                  primaryIcon="check"
                  secondaryButtonText={t("Cancel")}
                  backResult={handleDialogResult}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
