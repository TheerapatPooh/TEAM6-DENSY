/**
 * คำอธิบาย:
 * คอมโพเนนต์ PatrolListPage เป็นหน้าไวสร้างรายการตรวจ Patrol โดยผู้ใช้สามารถเลือก Preset, Inspector ในแต่ละ Checklist และเลือกวันที่ได้
 * หลังจากที่มีการสร้างใบ Patrol ผู้ตรวจคนอื่นๆ ที่เกี่ยวข้องจะเห็นใบที่สร้างขึ้นและสามารถเห็นผลการตรวจแบบ Realtime ผ่าน Socket
 *
 * Input:
 * - ไม่มี (คอมโพเนนต์นี้ไม่มีการรับ props โดยตรง)
 * Output:
 * - หน้าจอที่แสดงฟอร์มให้ผู้ใช้เลือก Preset, Inspector, Checklist และวันที่ พร้อมกับฟีเจอร์การแสดงผลแบบ Realtime
 * - เมื่อสร้างใบ Patrol ผู้ตรวจที่เกี่ยวข้องจะเห็นการอัปเดตผลการตรวจผ่าน Socket
**/
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CreatePatrolCard, PatrolCard } from "@/components/patrol-card";
import Textfield from "@/components/textfield";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useTranslations } from "next-intl";
import { fetchData } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChecklistDropdown } from "@/components/checklist-dropdown";
import { DatePicker, DatePickerWithRange } from "@/components/date-picker";
import BadgeCustom from "@/components/badge-custom";
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
  IPatrol,
  IPatrolChecklist,
  patrolStatus,
  IPreset,
  IPresetChecklist,
  IPatrolResult,
} from "@/app/type";
import { IUser, IFilterPatrol } from "@/app/type";
import { sortData } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateRange, DateRange as DayPickerDateRange } from "react-day-picker";
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import NotFound from "@/components/not-found";
import { ZoneTooltip } from "@/components/zone-tooltip";
import { TextTooltip } from "@/components/text-tooltip";
import { useSocket } from "@/components/socket-provider";

export default function PatrolListPage() {
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations("Zone");
  const [loading, setLoading] = useState<boolean>(true);
  const [socketData, setSocketData] = useState<IPatrolResult[]>([]);
  const [allPatrols, setAllPatrols] = useState<IPatrol[]>([]);
  const [allPresets, setAllPresets] = useState<IPreset[]>();
  const [secondDialog, setSecondDialog] = useState(false);
  const { socket, isConnected } = useSocket();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<IPreset>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [patrolChecklist, setPatrolChecklist] = useState<IPatrolChecklist[]>(
    []
  );

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  const isNextButtonDisabled = !selectedPreset;

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

  const handleCreatePatrol = () => {
    setPendingAction(() => () => createPatrol());
    handleOpenDialog();
  };

  const createPatrol = async () => {
    if (!selectedDate) {
      setDateError("PatrolUnselectDate");
      toast({
        variant: "error",
        title: a("PatrolMissingDateTitle"),
        description: a("PatrolMissingDateDescription"),
      });
      return;
    } else {
      setDateError(null);
    }

    // ตรวจสอบว่าวันที่เลือกน้อยกว่าวันปัจจุบันหรือไม่
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      setDateError("PatrolInvalidDate");
      toast({
        variant: "error",
        title: a("PatrolCreateInvalidDateTitle"),
        description: a("PatrolCreateInvalidDateDescription"),
      });
      return;
    }

    if (
      patrolChecklist.length !== selectedPreset.presetChecklists.length ||
      !patrolChecklist.every((item) => item.userId !== null)
    ) {
      toast({
        variant: "error",
        title: a("PatrolCreateErrorMissingInspectorTitle"),
        description: a("PatrolCreateErrorMissingInspectorDescription"),
      });
      return;
    }

    const data = {
      date: selectedDate,
      presetId: selectedPreset.id,
      checklists: patrolChecklist,
    };

    try {
      await fetchData("post", "/patrol", true, data);
      setSecondDialog(false);
      toast({
        variant: "success",
        title: a("PatrolCreateTitle"),
        description: a("PatrolCreateDescription"),
      });
      setPatrolChecklist([]);
      setSelectedDate(null);
      setSelectedPreset(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveSuccess = (id: number) => {
    setAllPatrols((prevPatrols) =>
      prevPatrols.filter((patrol) => patrol.id !== id)
    );
    toast({
      variant: "success",
      title: a("PatrolRemoveSuccessTitle"),
      description: a("PatrolRemoveSuccessDescription"),
    });
  };

  const handleSelectUser = (checklistId: number, userId: number) => {
    setPatrolChecklist((prev: IPatrolChecklist[]) => {
      const existingIndex = prev.findIndex(
        (item) => item.checklistId === checklistId
      );

      if (existingIndex !== -1) {
        // If the checklist already exists, update the inspectorId
        const updatedChecklist = [...prev];
        updatedChecklist[existingIndex].userId = userId;
        return updatedChecklist;
      } else {
        // Add new checklist
        return [...prev, { checklistId, userId }];
      }
    });
  };

  const handleSortChange = (type: string, value: string) => {
    setSort((prevSort) => ({
      ...prevSort,
      [type]: value,
    }));
  };

  const initialFilter = {
    presetTitle: "All",
    patrolStatuses: ["pending", "on_going", "scheduled"],
    dateRange: { start: undefined, end: undefined },
  };

  const getStoredFilter = () => {
    if (typeof window !== "undefined") {
      const storedFilter = localStorage.getItem("filter");
      if (storedFilter) {
        return JSON.parse(storedFilter);
      }
    }
    return initialFilter;
  };

  const [filter, setFilter] = useState<IFilterPatrol | null>(getStoredFilter());

  const [sort, setSort] = useState<{ by: string; order: string }>({
    by: "Doc No.",
    order: "Ascending",
  });

  const toggleStatusFilter = (status: string, checked: boolean) => {
    if (checked) {
      setFilter((prev) => {
        if (prev) {
          return {
            ...prev,
            patrolStatuses: [...prev.patrolStatuses, status],
          };
        } else {
          return {
            presetTitle: "All",
            patrolStatuses: [],
            dateRange: { start: undefined, end: undefined },
          };
        }
      });
    } else {
      setFilter((prev) => {
        if (prev) {
          return {
            ...prev,
            patrolStatuses: prev.patrolStatuses.filter((s) => s !== status),
          };
        }
        return prev;
      });
    }
  };

  const applyFilter = () => {
    getPatrolData();
  };

  const resetFilter = () => {
    setFilter(initialFilter);
  };

  const handleDateSelect = (dateRange: DateRange) => {
    const startDate = dateRange.from ?? null;
    const endDate = dateRange.to
      ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
      : null;
    setFilter({
      presetTitle: filter?.presetTitle || null,
      patrolStatuses: filter?.patrolStatuses || [],
      dateRange: {
        start: startDate || undefined,
        end: endDate || undefined,
      },
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const buildQueryString = (
    filter: IFilterPatrol | null,
    searchTerm: string
  ) => {
    const params: Record<string, string | undefined> = {};

    // เพิ่ม search term ถ้ามี
    if (searchTerm) params.search = searchTerm;

    // เพิ่ม preset filter ถ้าไม่ใช่ "All"
    if (filter?.presetTitle && filter.presetTitle !== "All") {
      params.preset = filter.presetTitle;
    }

    // เพิ่ม status filter
    if (filter?.patrolStatuses?.length) {
      params.status = filter.patrolStatuses.join(",");
    }

    // เพิ่ม startDate
    if (filter?.dateRange?.start) {
      params.startDate = filter?.dateRange.start.toISOString();
    }

    // เพิ่ม endDate
    if (filter?.dateRange?.end) {
      params.endDate = filter?.dateRange?.end.toISOString();
    }

    return new URLSearchParams(params).toString();
  };

  const getUserData = async () => {
    try {
      const userfetch = await fetchData(
        "get",
        "/user?profile=true&image=true",
        true
      );
      setUser(userfetch);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const getPatrolData = async () => {
    try {
      const queryString = buildQueryString(filter, searchTerm);
      const patrols = await fetchData("get", `/patrols?${queryString}`, true);
      setAllPatrols(patrols);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  const getPresetData = async () => {
    try {
      const preset = await fetchData("get", "/presets?latest=true", true);
      setAllPresets(preset);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  const mergedPatrols = useMemo(() => {
    if (!socketData || socketData.length === 0) {
      return allPatrols;
    }

    return allPatrols.map((patrol) => {
      if (!patrol.results || patrol.results.length === 0) {
        return patrol;
      }

      const updatedResults = patrol.results
        .map((existingResult) => {
          const matchingSocketResult = socketData.find(
            (result) => result.id === existingResult.id
          );
          return matchingSocketResult
            ? { ...existingResult, ...matchingSocketResult }
            : existingResult;
        })
        .filter((result) => result.id); // กรองเฉพาะที่มี id เท่านั้น

      return { ...patrol, results: [...updatedResults] };
    });
  }, [allPatrols, socketData]);

  // ใช้ useEffect เพื่อตั้งค่า allPatrols ถ้า mergedPatrols เปลี่ยนแปลง
  useEffect(() => {
    if (JSON.stringify(allPatrols) !== JSON.stringify(mergedPatrols)) {
      setAllPatrols([...mergedPatrols]);
    }
  }, [mergedPatrols]);

  const joinedRoomsRef = useRef(new Set());

  useEffect(() => {
    getUserData();
    getPatrolData();
    getPresetData();
  }, []);

  useEffect(() => {
    const initializeSocketListeners = () => {
      if (user?.id) {
        socket.emit("join_room", user.id);
      }

      // ฟังก์ชันรับข้อมูลเริ่มต้นจาก socket
      const handleInitialData = (initialResults: IPatrolResult[]) => {
        if (initialResults.length <= 0) {
          return;
        }
        // ตั้งค่า socketData ให้เป็นข้อมูลที่รับมาจาก socket
        setSocketData((prevData) => {
          // อัปเดตข้อมูลที่ตรงกันหรือลงข้อมูลใหม่
          const updatedResults = initialResults.map((incomingResult) => {
            // เช็คว่า incomingResult.id มีอยู่ใน prevData หรือไม่
            const existingIndex = prevData.findIndex(
              (result) => result.id === incomingResult.id
            );

            if (existingIndex !== -1) {
              // ถ้ามี id ตรงกัน, อัปเดตข้อมูลใน existing result
              return {
                ...prevData[existingIndex], // ข้อมูลเดิม
                ...incomingResult, // ข้อมูลใหม่ที่มาจาก initialResults
              };
            }

            // ถ้าไม่มี id ตรงกัน, ให้เพิ่มข้อมูลใหม่
            return incomingResult;
          });

          // เช็คผลลัพธ์ใหม่ที่ไม่มีใน prevData
          const newResults = initialResults.filter(
            (result) =>
              !prevData.some(
                (existingResult) => existingResult.id === result.id
              )
          );

          // รวมข้อมูลเดิมที่อัปเดตและผลลัพธ์ใหม่
          return [...updatedResults, ...newResults];
        });
      };

      // ฟังก์ชันที่ใช้ในการอัปเดตข้อมูลผลลัพธ์
      const handleResultUpdate = (incomingResult: IPatrolResult) => {
        setSocketData((prevData) => {
          // เช็คว่า incomingResult.id มีอยู่ใน prevData หรือไม่
          const updatedResults = prevData.map((existingResult) => {
            if (existingResult.id === incomingResult.id) {
              return {
                ...existingResult, // ข้อมูลเดิม
                ...incomingResult, // ข้อมูลใหม่ที่มาจาก incomingResult
              };
            }
            return existingResult;
          });

          // ถ้าไม่มีผลลัพธ์จาก incomingResult ใน prevData, ให้เพิ่มเข้าไป
          if (
            !prevData.some(
              (existingResult) => existingResult.id === incomingResult.id
            )
          ) {
            return [...updatedResults, incomingResult];
          }

          return updatedResults;
        });
      };

      // อัปเดตสถานะเมื่อ patrol เริ่ม
      const handlePatrolStarted = async (data: {
        patrolId: string;
        patrolData: IPatrol;
      }) => {
        if (!joinedRoomsRef.current.has(data.patrolId)) {
          socket.emit("join_patrol", data.patrolId);
          joinedRoomsRef.current.add(data.patrolId);
        }
        await getPatrolData();
      };

      // อัปเดตสถานะเมื่อ patrol จบ
      const handlePatrolFinished = async (data: {
        patrolId: string;
        patrolData: IPatrol;
      }) => {
        if (!joinedRoomsRef.current.has(data.patrolId)) {
          socket.emit("join_patrol", data.patrolId);
          joinedRoomsRef.current.add(data.patrolId);
        }
        await getPatrolData();
      };

      // อัปเดตข้อมูลเมื่อมี Patrol ใหม่
      const handleNewPatrol = async (newPatrol) => {
        if (!joinedRoomsRef.current.has(newPatrol.id)) {
          socket.emit("join_patrol", newPatrol.id);
          joinedRoomsRef.current.add(newPatrol.id);
        }
        await getPatrolData();
      };

      // อัปเดตข้อมูลเมื่อ Patrol ถูกลบ
      const handlePatrolDeleted = (patrolId) => {
        setAllPatrols((prevPatrols) =>
          prevPatrols.filter((patrol) => patrol.id !== patrolId)
        );
        if (!joinedRoomsRef.current.has(patrolId)) {
          socket.emit("join_patrol", patrolId);
          joinedRoomsRef.current.add(patrolId);
        }
      };

      socket.on("initial_patrol_data", handleInitialData);
      socket.on("patrol_result_update", handleResultUpdate);
      socket.on("patrol_started", handlePatrolStarted);
      socket.on("patrol_finished", handlePatrolFinished);
      socket.on("patrol_created", handleNewPatrol);
      socket.on("patrol_deleted", handlePatrolDeleted);
      setLoading(false);
      return () => {
        socket.off("initial_patrol_data", handleInitialData);
        socket.off("patrol_result_update", handleResultUpdate);
        socket.off("patrol_started", handlePatrolStarted);
        socket.off("patrol_finished", handlePatrolFinished);
        socket.off("patrol_created", handleNewPatrol);
        socket.off("patrol_deleted", handlePatrolDeleted);
      };
    };

    initializeSocketListeners();
  }, [socket, isConnected, user?.id]);

  useEffect(() => {
    allPatrols.forEach((patrol) => {
      if (
        (!joinedRoomsRef.current.has(patrol.id) &&
          patrol.status === "on_going") ||
        patrol.status === "scheduled"
      ) {
        socket.emit("join_patrol", patrol.id);
        joinedRoomsRef.current.add(patrol.id);
      }
    });
  }, [allPatrols]);

  useEffect(() => {
    getPatrolData();
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem("filter", JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    const sortedData = sortData(allPatrols, sort);
    if (JSON.stringify(sortedData) !== JSON.stringify(allPatrols)) {
      setAllPatrols(sortedData);
    }
  }, [sort, allPatrols]);

  useEffect(() => {
    if (selectedDate !== null || selectedDate !== undefined) {
      setDateError(null);
    }
  }, [selectedDate]);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col px-6 py-4 gap-4">
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
          onChange={handleSearch}
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
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("SortBy")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.by}
              onValueChange={(value) => handleSortChange("by", value)}
            >
              <DropdownMenuRadioItem
                value="Doc No."
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("DocNo")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Date"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Date")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

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

        <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
    ${isFilterOpen ? "border border-destructive" : "border-none"}`}
          >
            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg">{t("Filter")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Date")}
              </DropdownMenuLabel>
              <DatePickerWithRange
                startDate={filter?.dateRange.start}
                endDate={filter?.dateRange.end}
                onSelect={handleDateSelect}
                className="my-date-picker"
              />
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Status")}
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatuses.includes("pending")}
                onCheckedChange={(checked) =>
                  toggleStatusFilter("pending", checked)
                }
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="blue"
                  showIcon={true}
                  iconName="hourglass_top"
                  children="Pending"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatuses.includes("scheduled")}
                onCheckedChange={(checked) =>
                  toggleStatusFilter("scheduled", checked)
                }
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="yellow"
                  showIcon={true}
                  iconName="event_available"
                  children="Scheduled"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatuses.includes("on_going")}
                onCheckedChange={(checked) =>
                  toggleStatusFilter("on_going", checked)
                }
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="purple"
                  showIcon={true}
                  iconName="cached"
                  children="On Going"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatuses.includes("completed")}
                onCheckedChange={(checked) =>
                  toggleStatusFilter("completed", checked)
                }
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="green"
                  showIcon={true}
                  iconName="check"
                  children="Complete"
                />
              </DropdownMenuCheckboxItem>
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Preset")}
              </DropdownMenuLabel>
              <Select
                value={filter?.presetTitle || "All"}
                onValueChange={(value) =>
                  setFilter({
                    presetTitle: value,
                    patrolStatuses: filter?.patrolStatuses || [],
                    dateRange: {
                      start: filter?.dateRange.start,
                      end: filter?.dateRange.end,
                    },
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={
                      filter?.presetTitle === "All"
                        ? t("All")
                        : filter?.presetTitle
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Preset")}</SelectLabel>
                    <SelectItem value="All">{t("All")}</SelectItem>
                    {allPresets &&
                      allPresets.map((preset) => (
                        <SelectItem value={preset.title} key={preset.id}>
                          {preset.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end mt-4 gap-2">
              <Button size="sm" variant="secondary" onClick={resetFilter}>
                {t("Reset")}
              </Button>
              <Button variant="primary" size="sm" onClick={applyFilter}>
                {t("Apply")}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-full w-full rounded-md flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-160px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Create Patrol Card with AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <CreatePatrolCard />
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:w-[90%] xl:w-[60%] h-[670px] px-6 py-4">
              <AlertDialogHeader className="flex">
                <div className="flex flex-col gap-1">
                  <AlertDialogTitle className="text-2xl font-bold text-card-foreground">
                    {t("PatrolPreset")}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base text-input">
                    {t("PleaseSelectAPresetForThePatrol")}
                  </AlertDialogDescription>
                </div>
                <div className="flex items-center justify-center pt-2">
                  <ScrollArea className="h-[500px] w-full rounded-md border-none pr-4 overflow-y-auto">
                    <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                      {(() => {
                        const availablePresets = allPresets
                          ? allPresets.filter((preset) => !preset.disabled)
                          : [];
                        return availablePresets.length > 0 ? (
                          availablePresets.map((preset, index) => (
                            <Button
                              key={index}
                              variant={"outline"}
                              className={`custom-shadow bg-secondary grid grid-cols-1 sm:grid-cols-1 h-60 ${
                                selectedPreset === preset
                                  ? "border-destructive"
                                  : "border-transparent"
                              } flex flex-col py-4 px-6 gap-4 justify-start items-start`}
                              onClick={() => setSelectedPreset(preset)}
                            >
                              {/* Title */}
                              <p className="font-bold text-2xl text-card-foreground">
                                {preset.title}
                              </p>
                              {/* Zone */}

                              <ZoneTooltip zonesName={preset.zones}>
                                <div className="flex flex-row justify-start items-center w-auto gap-1 lg:max-w-[400px] sm:max-w-[620px] truncate">
                                  {/* Positioned Icon */}
                                  <span className="material-symbols-outlined text-2xl text-muted-foreground">
                                    location_on
                                  </span>
                                  <p className="text-muted-foreground min-w-0 text-start truncate overflow-hidden text-base font-semibold whitespace-nowrap text-ellipsis">
                                    {preset.zones
                                      .map((zone) => z(zone))
                                      .join(", ")}
                                  </p>
                                </div>
                              </ZoneTooltip>
                              {/* Description */}
                              <div className="flex flex-row w-full h-full gap-1">
                                {/* Positioned Icon */}
                                <span className="material-symbols-outlined text-2xl text-muted-foreground">
                                  data_info_alert
                                </span>
                                {/* Positioned Textarea */}
                                <div className="w-full h-full ">
                                  <TextTooltip object={preset.description}>
                                    <Textarea
                                      disabled
                                      className="p-0 pointer-events-none border-none shadow-none overflow-hidden text-left resize-none  max-h-full h-20 w-full text-base font-normal line-clamp-3"
                                      value={preset.description}
                                    />
                                  </TextTooltip>
                                </div>
                              </div>
                            </Button>
                          ))
                        ) : (
                          <div className="col-span-full min-h-[261px]">
                            <NotFound
                              icon="deployed_code"
                              title="NoPresetsFound"
                              description="NoPresetsDescription"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </ScrollArea>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <div className="flex items-end justify-end gap-2">
                  <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({
                      variant: "primary",
                      size: "lg",
                    })}
                    onClick={() => setSecondDialog(true)}
                    disabled={isNextButtonDisabled}
                  >
                    {t("Next")}
                    <span className="material-symbols-outlined text-2xl">
                      chevron_right
                    </span>
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Second AlertDialog */}
          <AlertDialog open={secondDialog}>
            <AlertDialogContent className="sm:w-[90%] xl:w-[60%] h-fit px-6 py-4">
              <AlertDialogHeader>
                <div className="flex flex-col gap-1">
                  <AlertDialogTitle className="text-2xl font-bold text-card-foreground">
                    {t("PatrolPreset")}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base text-input">
                    {t("PleaseSelectAPresetForThePatrol")}
                  </AlertDialogDescription>
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {t("Date")}
                  </p>
                  <DatePicker
                    handleSelectedTime={(time: string) => setSelectedDate(time)}
                  />
                  {dateError && (
                    <p className="text-sm font-light italic text-destructive mt-1">
                      {a(dateError)}
                    </p>
                  )}
                </div>
              </AlertDialogHeader>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  {t("Checklist")}
                </p>
                <div className="grid grid-cols-1">
                  <ScrollArea className="pr-2 h-96 w-full rounded-md overflow-visible overflow-y-clip">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                      {selectedPreset?.presetChecklists.flatMap(
                        (presetChecklist: IPresetChecklist) => (
                          <ChecklistDropdown
                            key={presetChecklist.checklist.id}
                            checklist={presetChecklist.checklist}
                            handleselectUser={(selectedUser: IUser) => {
                              handleSelectUser(
                                presetChecklist.checklist.id,
                                selectedUser.id
                              );
                            }}
                          />
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <AlertDialogFooter>
                <div className="flex items-end justify-end gap-2">
                  <AlertDialogCancel
                    onClick={() => {
                      setSecondDialog(false);
                      setDateError(null);
                    }}
                  >
                    {t("Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className={`${buttonVariants({
                      variant: "primary",
                      size: "lg",
                    })} gap-2`}
                    onClick={handleCreatePatrol}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      note_add
                    </span>
                    {t("NewPatrol")}
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isDialogOpen && (
            <AlertCustom
              title={a("PatrolCreateConfirmTitle")}
              description={a("PatrolCreateConfirmDescription")}
              primaryButtonText={t("Confirm")}
              primaryIcon="check"
              secondaryButtonText={t("Cancel")}
              backResult={handleDialogResult}
            ></AlertCustom>
          )}

          {(() => {
            // กรอง preset ที่ไม่ได้ disabled
            const availablePatrols = allPatrols
              ? allPatrols.filter((patrol) => !patrol.disabled)
              : [];

            return availablePatrols.length > 0 ? (
              availablePatrols.map((patrol) => (
                <PatrolCard
                  key={patrol.id}
                  status={patrol.status as patrolStatus}
                  date={patrol.date}
                  preset={patrol.preset}
                  itemCounts={patrol.itemCounts}
                  id={patrol.id}
                  results={[...(patrol.results ?? [])]}
                  inspectors={patrol.inspectors}
                  onRemoveSuccess={handleRemoveSuccess}
                />
              ))
            ) : (
              <div className="col-span-full min-h-[261px]">
                <NotFound
                  icon="task"
                  title="NoPatrolsAvailable"
                  description="NoPatrolsDescription"
                />
              </div>
            );
          })()}
        </div>
      </ScrollArea>
    </div>
  );
}
