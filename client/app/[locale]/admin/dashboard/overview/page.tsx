'use client'

import React, { useCallback, useRef } from 'react'
import { useEffect, useState } from "react";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { exportData, fetchData, formatTime, getPatrolStatusVariant } from "@/lib/utils";
import {
  DatePickerWithRange,
} from "@/components/date-picker";
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
import { IFilterPatrol } from "@/app/type";
import { sortData } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateRange, DateRange as DayPickerDateRange } from 'react-day-picker';
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import NotFound from "@/components/not-found";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useSocket } from '@/components/socket-provider';
import { useRouter } from 'next/navigation';

export default function Page() {
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations('Zone')
  const s = useTranslations("Status");

  const [allPatrols, setAllPatrols] = useState<IPatrol[]>([]);
  const [allPresets, setAllPresets] = useState<IPreset[]>();

  const allPatrolId = allPatrols.map(patrol => patrol.id);

  const [dateError, setDateError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<IPreset>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [patrolChecklist, setPatrolChecklist] = useState<IPatrolChecklist[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const { socket, isConnected } = useSocket();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter();
  const locale = useLocale();

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


  const [results, setResults] = useState<IPatrolResult[]>([]);
  const [patrolResults, setPatrolResults] = useState<IPatrolResult[]>([]);


  // useEffect(() => {
  //   if (socket && isConnected && allPatrols) {
  //     // เรียกใช้ forEach แทน map เพื่อไม่ให้เกิดผลข้างเคียงที่ไม่ต้องการ
  //     allPatrols.forEach((patrol) => {
  //       // เชื่อมต่อกับห้องแต่ละห้อง
  //       socket.emit("join_room", patrol.id);

  //       // ตั้งค่า handler สำหรับการอัพเดตผล
  //       const handleResultUpdate = (updatedResults: IPatrolResult[]) => {
  //         const currentUserResults = updatedResults;

  //         // ป้องกันการอัพเดต localStorage ที่ไม่จำเป็น
  //         if (currentUserResults.length > 0) {
  //           const savedResults = localStorage.getItem(
  //             `patrolResults_${patrol.id}`
  //           );
  //           const parsedResults: IPatrolResult[] = savedResults
  //             ? JSON.parse(savedResults)
  //             : [];
  //           if (
  //             JSON.stringify(parsedResults) !== JSON.stringify(currentUserResults)
  //           ) {
  //             localStorage.setItem(
  //               `patrolResults_${patrol.id}`,
  //               JSON.stringify(currentUserResults)
  //             );
  //           }
  //         }

  //         // อัพเดตผลใน patrol
  //         const updatedPatrols = allPatrols.map((p) => {
  //           if (p.id === patrol.id) {
  //             return { ...p, results: currentUserResults }; // ตั้งค่า results สำหรับ patrol ที่ตรงกับ id
  //           }
  //           return p;
  //         });

  //         // อัพเดต state ถ้ามีการเปลี่ยนแปลง
  //         setAllPatrols(updatedPatrols);
  //       };

  //       // ตรวจสอบว่าไม่ทำการตั้งค่า listener ซ้ำซ้อน
  //       socket.on("patrol_result_update", handleResultUpdate);

  //       // ลบ event listener เมื่อ component unmount หรือเมื่อเงื่อนไขเปลี่ยน
  //       return () => {
  //         socket.off("patrol_result_update", handleResultUpdate);
  //       };
  //     });
  //   }
  // }, [socket, isConnected, allPatrols]);


  // const patrolRef = useRef(allPatrols);

  // useEffect(() => {
  //   patrolRef.current = allPatrols; // เก็บค่าของ allPatrols ทุกครั้งที่มันเปลี่ยนแปลง
  // }, [allPatrols]);

  // useEffect(() => {
  //   if (socket && isConnected && allPatrols) {
  //     allPatrols.forEach((patrol) => {
  //       socket.emit("join_room", patrol.id);

  //       const handleResultUpdate = (updatedResults: IPatrolResult[]) => {
  //         const currentUserResults = updatedResults;

  //         // Avoid unnecessary updates to localStorage
  //         if (currentUserResults.length > 0) {
  //           const savedResults = localStorage.getItem(
  //             `patrolResults_${patrol.id}`
  //           );
  //           const parsedResults: IPatrolResult[] = savedResults
  //             ? JSON.parse(savedResults)
  //             : [];
  //           if (
  //             JSON.stringify(parsedResults) !== JSON.stringify(currentUserResults)
  //           ) {
  //             localStorage.setItem(
  //               `patrolResults_${patrol.id}`,
  //               JSON.stringify(currentUserResults)
  //             );
  //           }
  //         }

  //         // Update patrol results in the local ref first
  //         const updatedPatrols = patrolRef.current.map((p) => {
  //           if (p.id === patrol.id) {
  //             console.log("Updating patrol results for patrol ID:", p.id);
  //             return { ...p, results: currentUserResults };
  //           }
  //           return p;
  //         });
  //         console.log("Updated patrols:", updatedPatrols);

  //         // Update the state
  //         setAllPatrols(updatedPatrols);
  //       };

  //       socket.on("patrol_result_update", handleResultUpdate);

  //       return () => {
  //         socket.off("patrol_result_update", handleResultUpdate);
  //       };
  //     });
  //   }
  // }, [socket, isConnected, allPatrols]); // Ensure this effect runs when `allPatrols` changes

  // console.log("allpatrol", allPatrols);


  const joinedRoomsRef = useRef(new Set()); // ✅ ป้องกัน join ซ้ำ

  const handleResultUpdate = useCallback((updatedResults: IPatrolResult[]) => {
    setAllPatrols((prevPatrols) =>
      prevPatrols.map((updatePatrol) => {
        const updatedResultsForPatrol = updatePatrol.results.map((result) => {
          const matchingResult = updatedResults.find((updatedResult) => updatedResult.id === result.id);
          return matchingResult
            ? { ...result, status: matchingResult.status, defects: matchingResult.defects || [] }
            : result;
        });

        return { ...updatePatrol, results: updatedResultsForPatrol };
      })
    );
  }, []);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on("patrol_result_update", handleResultUpdate);
      return () => {
        socket.off("patrol_result_update", handleResultUpdate);
      };
    }
  }, [socket, isConnected, handleResultUpdate]); // ✅ ป้องกัน re-subscribe loop

  useEffect(() => {
    if (socket && isConnected && allPatrols) {
      allPatrols.forEach((patrol) => {
        if (!joinedRoomsRef.current.has(patrol.id)) {
          console.log(`Joining room: ${patrol.id}`);
          socket.emit("join_room", patrol.id);
          joinedRoomsRef.current.add(patrol.id); // ✅ กัน join ซ้ำ
        }
      });
    }
  }, [socket, isConnected]);

  console.log("allpatrol", allPatrols)



  const countPatrolResult = (results: IPatrolResult[]) => {
    let fail = 0;
    let defect = 0;

    results?.forEach((result) => {
      if (result.status === false) {
        fail++;
      }

      if (Array.isArray(result.defects) && result.defects.length > 0) {
        defect++;
      }
    });

    return { fail, defect };
  };

  const handleOpenAlert = () => {
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false)
  }

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleRemovePatrol = (status: string, patrolId: number) => {
    setPendingAction(() => () => removePatrol(status, patrolId));
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDetail = (patrolId: number) => {
    router.push(`/${locale}/admin/dashboard/overview/${patrolId}`)
  }

  const removePatrol = async (status: string, patrolId: number) => {
    if (status !== 'pending') {
      toast({
        variant: "error",
        title: a("PatrolRemoveErrorTitle"),
        description: a("PatrolRemoveErrorDescription"),
      });
      return;
    }
    try {
      await fetchData("delete", `/patrol/${patrolId}`, true);
      toast({
        variant: "success",
        title: a("PatrolRemoveSuccessTitle"),
        description: a("PatrolRemoveSuccessDescription"),
      });
      getPatrolData()
    } catch (error) {
      console.error(error)
    }
  }

  // search sort filter
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
    if (typeof window !== 'undefined') {
      const storedFilter = localStorage.getItem('filter');
      if (storedFilter) {
        return JSON.parse(storedFilter);
      }
    }
    return initialFilter;
  };

  const [filter, setFilter] = useState<IFilterPatrol | null>(getStoredFilter())

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
            dateRange: { start: undefined, end: undefined }
          }
        }
      });
    }
    else {
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
    getPatrolData()
  };

  const resetFilter = () => {
    setFilter(initialFilter)
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
        end: endDate || undefined
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const buildQueryString = (filter: IFilterPatrol | null, searchTerm: string) => {
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

  const formatId = (id: number): string => {
    return `P${id.toString().padStart(4, '0')}`;
  };

  const handleCheckboxChange = (patrolId: number, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [patrolId]: checked,
    }));
  };

  const handleSelectAllCheckbox = (checked: boolean) => {
    const newCheckedItems = allPatrols.reduce((acc, patrol) => {
      acc[patrol.id] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedItems(newCheckedItems);
  };

  const exportPatrol = (allPatrols: IPatrol[], checkedItems: Record<string, boolean>) => {
    const selectedPatrols = allPatrols.filter((p) => checkedItems[p.id]);

    if (allPatrols.length === 0 || selectedPatrols.length === 0) {
      toast({
        variant: "error",
        title: a("ExportPatrolNoData"),
        description: a("ExportPatrolNoDataDescription"),
      });
      return;
    }

    const hasIncompletePatrol = selectedPatrols.some((patrol) => patrol.status !== "completed");

    if (hasIncompletePatrol) {
      toast({
        variant: "error",
        title: a("ExportPatrolNoData"),
        description: a("ExportPatrolStatusNotCompleteDescription"),
      });
      return;
    }

    selectedPatrols.forEach((patrol) => {
      const results = patrol.results;

      try {
        exportData(patrol, results);
        toast({
          variant: "success",
          title: a("ExportReportPatrolTitle"),
          description: a("ExportReportPatrolDescription"),
        });
      } catch (error) {
        console.error(`Export failed for patrol ID: ${patrol.id}`, error);
      }
    });
  };

  const calculateProgress = (patrolResults: IPatrolResult[]) => {
    if (!patrolResults) return 0;
    const checkedResults = patrolResults.filter(
      (res) => res.status !== null
    ).length;
    const totalResults = patrolResults.length;

    if (totalResults === 0) return 0;
    return (checkedResults / totalResults) * 100;
  };

  useEffect(() => {
    getPatrolData();
    getPresetData()
    setLoading(false)
  }, []);

  useEffect(() => {
    // ฟังก์ชันที่ใช้เพื่ออัพเดตความกว้างหน้าจอ
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // เพิ่ม event listener สำหรับ resize
    window.addEventListener('resize', handleResize);

    // ลบ event listener เมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getPatrolData();
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('filter', JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    const sortedData = sortData(allPatrols, sort);
    if (JSON.stringify(sortedData) !== JSON.stringify(allPatrols)) {
      setAllPatrols(sortedData);
    }
  }, [sort, allPatrols]);

  useEffect(() => {
    if (selectedDate !== null || selectedDate !== undefined) {
      setDateError(null)
    }
  }, [selectedDate])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Patrol List */}
      <div className='flex flex-row justify-between items-center'>
        <p className='text-2xl font-bold'>{t("PatrolList")}</p>
        <Button size='lg' variant='primary' className='flex flex-row items-center' onClick={() => handleOpenAlert()}>
          <span className="material-symbols-outlined text-card w-[22px] h-[22px]">
            ios_share
          </span>
          <p>{t("Export")}</p>
        </Button>
      </div>

      {/* Search Sort Filter */}
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
            <div className="text-lg">{t('Sort')}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 gap-2">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('SortBy')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.by}
              onValueChange={(value) => handleSortChange('by', value)}
            >
              <DropdownMenuRadioItem value="Doc No." className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('DocNo')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('Date')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Order')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.order}
              onValueChange={(value) => handleSortChange('order', value)}
            >
              <DropdownMenuRadioItem value="Ascending" className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('Ascending')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Descending" className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('Descending')}
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
            <div className="text-lg">{t('Filter')}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Date')}</DropdownMenuLabel>
              <DatePickerWithRange
                startDate={filter?.dateRange.start}
                endDate={filter?.dateRange.end}
                onSelect={handleDateSelect}
                className="my-date-picker"
              />
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Status')}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatuses.includes("pending")}
                onCheckedChange={(checked) => toggleStatusFilter("pending", checked)}
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
                onCheckedChange={(checked) => toggleStatusFilter("scheduled", checked)}
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
                onCheckedChange={(checked) => toggleStatusFilter("on_going", checked)}
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
                onCheckedChange={(checked) => toggleStatusFilter("completed", checked)}
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
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Preset')}</DropdownMenuLabel>
              <Select
                value={filter?.presetTitle || 'All'}
                onValueChange={(value) =>
                  setFilter({
                    presetTitle: value,
                    patrolStatuses: filter?.patrolStatuses || [],
                    dateRange: { start: filter?.dateRange.start, end: filter?.dateRange.end }
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={filter?.presetTitle === 'All' ? t('All') : filter?.presetTitle}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('Preset')}</SelectLabel>
                    <SelectItem value="All">{t('All')}</SelectItem>
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
                {t('Reset')}
              </Button>
              <Button variant="primary" size="sm" onClick={applyFilter}>{t('Apply')}</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Table */}
      <div>
        <ScrollArea
          className="rounded-md sm:w-[702px] lg:w-full whitespace-nowrap">
          <Table className='overflow-hidden sm:w-max lg:w-full'>
            <TableHeader>
              <TableRow className="grid grid-cols-12 w-full">
                <TableHead className='sm:col-span-1 lg:col-span-1'>
                  <Checkbox className='rounded-sm'
                    checked={
                      allPatrols.length > 0 &&
                      allPatrols.every((patrol) => checkedItems[patrol.id])
                    }
                    onCheckedChange={handleSelectAllCheckbox} />
                </TableHead>
                <TableHead className='sm:col-span-2 lg:col-span-2'>
                  {t("DocID")}
                </TableHead>
                <TableHead className='sm:col-span-2 lg:col-span-2'>
                  {t("Preset")}
                </TableHead>
                <TableHead className='sm:col-span-1 lg:col-span-2'>
                  {t("Status")}
                </TableHead>
                <TableHead className='sm:col-span-2 lg:col-span-2'>
                  {t("Progress")}
                </TableHead>
                <TableHead className='sm:col-span-2 lg:col-span-1'>
                  {t("Date")}
                </TableHead>
                <TableHead className='sm:col-span-2 lg:col-span-2'>
                  {t("Result")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ScrollArea className="rounded-md w-full lg:[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-388px)] sm:[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-360px)]"
              >
                {allPatrols.length === 0 || !allPatrols ? (
                  <tr className="flex w-full h-full">
                    <td colSpan={5} className="w-full text-center py-6">
                      <NotFound
                        icon="task" title="NoPatrolsAvailable" description="NoPatrolsDescription"
                      />
                    </td>
                  </tr>
                ) :
                  (
                    allPatrols.map((patrol, index) => (
                      <TableRow key={index} className='grid grid-cols-12 w-full items-center' onClick={() => handleDetail(patrol.id)}>
                        <TableCell className='sm:col-span-1 lg:col-span-1'>
                          <Checkbox className='w-5 h-5 rounded-sm'
                            onClick={(e) => e.stopPropagation()}
                            checked={checkedItems[patrol.id] || false}
                            onCheckedChange={(checked: boolean) => handleCheckboxChange(patrol.id, checked)}
                          />
                        </TableCell>
                        <TableCell className='sm:col-span-2 lg:col-span-2'>
                          <p>{formatId(patrol.id)}</p>
                        </TableCell>
                        <TableCell className='sm:text-sm lg:text-base sm:col-span-2 lg:col-span-2 flex min-w-0"'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate">{patrol.preset.title}</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="ml-[129px]">
                                <p className="max-w-[200px] break-words">{patrol.preset.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className='sm:col-span-1 lg:col-span-2'>
                          <BadgeCustom
                            iconName={getPatrolStatusVariant(patrol.status).iconName}
                            showIcon={true}
                            showTime={false}
                            variant={getPatrolStatusVariant(patrol.status).variant}
                            hideText={windowWidth > 1024 ? false : true}
                          >
                            {s(patrol.status)}
                          </BadgeCustom>
                        </TableCell>
                        <TableCell className='sm:col-span-2 lg:col-span-2'>
                          <p>
                            <Progress value={calculateProgress(patrol.results)} />
                          </p>
                        </TableCell>
                        <TableCell className='sm:col-span-2 lg:col-span-1'>
                          <p>{formatTime(patrol.date, locale, false)}</p>
                        </TableCell>
                        <TableCell className='sm:col-span-2 lg:col-span-2'>
                          <div className='flex flex-row gap-2'>
                            <div className="flex gap-1 text-primary items-center">
                              <span className="material-symbols-outlined">checklist</span>
                              <p className="text-xl font-semibold">{patrol.itemCounts}</p>
                            </div>
                            <div className="flex gap-1 text-orange items-center">
                              <span className="material-symbols-outlined">close</span>
                              <p className="text-xl font-semibold">{countPatrolResult(patrol.results).fail}</p>
                            </div>
                            <div className="flex gap-1 text-destructive items-center">
                              <span className="material-symbols-outlined">
                                error
                              </span>
                              <p className="text-xl font-semibold">{countPatrolResult(patrol.results).defect}</p>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" className="w-[45px] h-[45px]">
                                    <span className="material-symbols-outlined items-center text-input">
                                      more_horiz
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="p-0">
                                  <DropdownMenuItem onClick={(e) => {
                                    handleDetail(patrol.id)
                                  }}>
                                    <h1>{t("Detail")}</h1>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemovePatrol(patrol.status, patrol.id)
                                  }}>
                                    <h1 className="text-destructive cursor-pointer">{t("Delete")}</h1>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                }
              </ScrollArea>
            </TableBody>
          </Table>
        </ScrollArea>

        {isDialogOpen && (
          <AlertCustom
            title={a("PatrolRemoveConfirmTitle")}
            description={a("PatrolRemoveConfirmDescription")}
            primaryButtonText={t("Confirm")}
            primaryIcon="check"
            secondaryButtonText={t("Cancel")}
            backResult={handleDialogResult}
          ></AlertCustom>
        )}

        {isAlertOpen && (
          <AlertCustom
            title={a("ExportPatrolAlert")}
            description={a("ExportPatrolAlertDescription")}
            primaryButtonText={t("Confirm")}
            primaryIcon="check"
            secondaryButtonText={t("Cancel")}
            backResult={(backResult) => {
              if (backResult) {
                exportPatrol(allPatrols, checkedItems)
              }
              handleCloseAlert()
            }}
          />
        )}
      </div>
    </div >
  )
}