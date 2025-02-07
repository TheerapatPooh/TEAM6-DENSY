/**
 * คำอธิบาย:
 *  หน้าที่แสดงรายการ Patrol ทั้งหมด และสามารถสร้าง Patrol ใหม่ได้
 *  โดยสามารถค้นหา เลือกเรียงลำดับ และกรองข้อมูล Patrol ได้
 *
 * Input: 
 * - ไม่มี
 * Output:
 * - หน้า Patrol ที่แสดงรายการ Patrol ทั้งหมด และสามารถสร้าง Patrol ใหม่ได้
 * - สามารถค้นหา เลือกเรียงลำดับ และกรองข้อมูล Patrol ได้
 * - สามารถเลือก Preset และวันที่สำหรับ Patrol ใหม่
 * - สามารถเลือก Inspector ในแต่ละ Checklist ของ Preset ที่เลือกได้
 * - สามารถสร้าง Patrol ใหม่ได้
 * - สามารถลบ Patrol ที่สร้างได้
 * - แสดง Alert ในกรณีที่ต้องการสร้าง Patrol ใหม่
 * - แสดง Alert ในกรณีที่ต้องการลบ Patrol
 * - แสดง Alert ในกรณีที่สร้าง Patrol ใหม่เสร็จสิ้น
 * - แสดง Alert ในกรณีที่ลบ Patrol สำเร็จ
 * - แสดง Alert ในกรณีที่เกิดข้อผิดพลาดในการสร้าง Patrol
 * - แสดง Alert ในกรณีที่เกิดข้อผิดพลาดในการลบ Patrol
 **/

"use client";

import { useEffect, useState } from "react";
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
import {
  DatePicker,
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
} from "@/app/type";
import { IUser, IFilterPatrol } from "@/app/type";
import { sortData } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateRange, DateRange as DayPickerDateRange } from 'react-day-picker';
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import NotFound from "@/components/not-found";

export default function Page() {
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations('Zone')
  const [loading, setLoading] = useState<boolean>(true);
  const [allPatrols, setAllPatrols] = useState<IPatrol[]>([]);
  const [allPresets, setAllPresets] = useState<IPreset[]>();
  const [secondDialog, setSecondDialog] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<IPreset>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [patrolChecklist, setPatrolChecklist] = useState<IPatrolChecklist[]>([]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

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

    if (patrolChecklist.length !== selectedPreset.presetChecklists.length ||
      !patrolChecklist.every((item) => item.userId !== null)) {
      toast({
        variant: "error",
        title: a("PatrolCreateErrorMissingInspectorTitle"),
        description: a("PatrolCreateErrorMissingInspectorDescription"),
      });
      return
    }

    const data = {
      date: selectedDate,
      presetId: selectedPreset.id,
      checklists: patrolChecklist,
    };

    try {
      const response = await fetchData("post", "/patrol", true, data);
      setSecondDialog(false);
      setAllPatrols((prev) => [...prev, response]);
      toast({
        variant: "success",
        title: a("PatrolCreateTitle"),
        description: a("PatrolCreateDescription"),
      });
      setPatrolChecklist([])
      setSelectedDate(null)
      setSelectedPreset(null)
    } catch (error) {
      console.error(error)
    }
  };

  const handleRemoveSuccess = (id: number) => {
    setAllPatrols((prevPatrols) => prevPatrols.filter((patrol) => patrol.id !== id));
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

  useEffect(() => {
    getPatrolData();
    getPresetData()
    setLoading(false)
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
              {dateError && (
                <p className="text-sm font-light text-destructive italic mt-1">{dateError}</p>
              )}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Create Patrol Card with AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <CreatePatrolCard />
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[800px] h-[670px] px-6 py-4">
            <AlertDialogHeader className="flex">
              <div className="flex flex-col gap-1">
                <AlertDialogTitle className="text-2xl font-bold text-card-foreground">
                  {t('PatrolPreset')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base text-input">
                  {t('PleaseSelectAPresetForThePatrol')}
                </AlertDialogDescription>
              </div>
              <div className="flex items-center justify-center pt-2">
                <ScrollArea className="h-[500px] w-full rounded-md border-none pr-4 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {allPresets &&
                      allPresets.map((preset, index) => (
                        <Button
                          key={index}
                          variant={"outline"}
                          className={`custom-shadow bg-secondary grid grid-cols-1 sm:grid-cols-1 h-60 ${selectedPreset === preset
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
                          <div className="flex flex-row w-full h-full gap-1">
                            {/* Positioned Icon */}
                            <span className="material-symbols-outlined text-2xl text-muted-foreground">
                              location_on
                            </span>
                            {/* Zones */}
                            <Textarea
                              disabled
                              className="p-0 pointer-events-none border-none shadow-none overflow-hidden text-left resize-none leading-tight h-full w-full text-base font-semibold line-clamp-3"
                              value={preset.zones.map((zone) => z(zone)).join(", ")}
                            />
                          </div>
                          {/* Description */}
                          <div className="flex flex-row w-full h-full gap-1">
                            {/* Positioned Icon */}
                            <span className="material-symbols-outlined text-2xl text-muted-foreground">
                              data_info_alert
                            </span>
                            {/* Positioned Textarea */}
                            <Textarea
                              disabled
                              className="p-0 pointer-events-none border-none shadow-none overflow-hidden text-left resize-none leading-tight h-full w-full text-base font-normal line-clamp-3"
                              value={preset.description}
                            />
                          </div>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-2">
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'primary', size: 'lg' })}
                  onClick={() => setSecondDialog(true)}
                  disabled={isNextButtonDisabled}
                >
                  {t('Next')}
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
          <AlertDialogContent className="max-w-[800px] h-fit px-6 py-4">
            <AlertDialogHeader>
              <div className="flex flex-col gap-1">
                <AlertDialogTitle className="text-2xl font-bold text-card-foreground">
                  {t('PatrolPreset')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base text-input">
                  {t('PleaseSelectAPresetForThePatrol')}
                </AlertDialogDescription>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <p className="text-sm font-semibold text-muted-foreground"> {t('Date')}</p>
                <DatePicker
                  handleSelectedTime={(time: string) => setSelectedDate(time)}
                />
                {dateError && (
                  <p className="text-sm font-light italic text-destructive mt-1">{a(dateError)}</p>
                )}
              </div>
            </AlertDialogHeader>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-muted-foreground"> {t('Checklist')}</p>
              <div className="grid grid-cols-1">
                <ScrollArea className="pr-2 h-96 w-full rounded-md overflow-visible overflow-y-clip">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                    {selectedPreset?.presetChecklists.flatMap((presetChecklist: IPresetChecklist) => (
                      <ChecklistDropdown
                        key={presetChecklist.checklist.id}
                        checklist={presetChecklist.checklist}
                        handleselectUser={(selectedUser: IUser) => {
                          handleSelectUser(presetChecklist.checklist.id, selectedUser.id);
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-2">
                <AlertDialogCancel onClick={() => {
                  setSecondDialog(false)
                  setDateError(null)
                }
                }>
                  {t('Cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  className={`${buttonVariants({ variant: 'primary', size: 'lg' })} gap-2`}
                  onClick={handleCreatePatrol}
                >
                  <span className="material-symbols-outlined text-2xl">
                    note_add
                  </span>
                  {t('NewPatrol')}
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
        {allPatrols && allPatrols.length === 0 ? (
          <div className="col-span-full min-h-[261px]">
            <NotFound icon="task" title="NoPatrolsAvailable" description="NoPatrolsDescription" />
          </div>
        ) : (
          allPatrols.map((patrol: IPatrol) => {
            return (
              <PatrolCard
                key={patrol.id}
                status={patrol.status as patrolStatus}
                date={new Date(patrol.date)}
                preset={patrol.preset}
                id={patrol.id}
                itemCounts={patrol.itemCounts}
                inspectors={patrol.inspectors}
                onRemoveSuccess={handleRemoveSuccess}
              />
            );
          })
        )}
      </div>
    </div>
  );
}