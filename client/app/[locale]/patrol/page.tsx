"use client";

import { useEffect, useState } from "react";
import { CreatePatrolCard, PatrolCard } from "@/components/patrol-card";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
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
import { fetchData } from "@/lib/api";
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
import { IUser, FilterPatrol } from "@/app/type";
import { filterPatrol } from "@/lib/utils";
import { sortData } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateRange, DateRange as DayPickerDateRange } from 'react-day-picker';
import Loading from "@/components/loading";

export default function Page() {
  const t = useTranslations("General");
  const [loading, setLoading] = useState<boolean>(true);
  const [patrolData, setPatrolData] = useState<IPatrol[]>([]);
  const [presetData, setPresetData] = useState<IPreset[]>();
  const [secondDialog, setSecondDialog] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<IPreset>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [patrolChecklist, setPatrolChecklist] = useState<IPatrolChecklist[]>([]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isNextButtonDisabled = !selectedPreset;
  const isSubmitDisabled =
    !selectedDate ||
    !selectedPreset ||
    patrolChecklist.length !== selectedPreset.presetChecklists.length;

  const onSubmit = async () => {
    if (!selectedDate || !selectedPreset || patrolChecklist.length === 0) {
      console.error("Not Empty Fields");
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
      window.location.reload();
    } catch (error) {
        console.error(error)
     }
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
    patrolStatus: ["pending", "on_going", "scheduled"],
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

  const [filter, setFilter] = useState<FilterPatrol | null>(getStoredFilter())
  const [filteredPatrolData, setFilteredPatrolData] = useState<IPatrol[]>([])

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
            patrolStatus: [...prev.patrolStatus, status],
          };
        } else {
          return {
            presetTitle: "All",
            patrolStatus: [],
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
            patrolStatus: prev.patrolStatus.filter((s) => s !== status),
          };
        }
        return prev;
      });
    }
  };

  const applyFilter = () => {
    setFilteredPatrolData(filterPatrol(filter, patrolData))
  };

  const resetFilter = () => {
    setFilter(initialFilter)
    localStorage.setItem('filter', JSON.stringify(initialFilter));
    setFilteredPatrolData(filterPatrol(initialFilter, patrolData))
  };

  const handleDateSelect = (dateRange: DateRange) => {
    const startDate = dateRange.from ?? null;
    const endDate = dateRange.to ?? null;

    setFilter({
      presetTitle: filter?.presetTitle || null,
      patrolStatus: filter?.patrolStatus || [],
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

  const patrolQueryResults = filteredPatrolData?.filter((patrol) => {
    const presetTitle = patrol.preset ? patrol.preset.title : 'No Title';
    const patrolId = patrol.id.toString().toLowerCase();
    const patrolDate = new Date(patrol.date).toLocaleDateString().toLowerCase();
    const patrolStatus = patrol.status.toLowerCase();

    const inspectors = patrol.patrolChecklists
      .flatMap((pc) => {
        return pc.inspector?.profile?.name
          ? [pc.inspector.profile.name.toLowerCase()]
          : [];
      })
      .join(' ');
    const searchTokens = searchTerm.toLowerCase().split(' ').filter(Boolean);
    const inspectorTokens = inspectors.split(' ').filter(Boolean);

    const isInspectorMatch = searchTokens.every(token =>
      inspectorTokens.some(namePart => namePart.includes(token))
    );

    return (
      presetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patrolId.includes(searchTerm.toLowerCase()) ||
      patrolDate.includes(searchTerm.toLowerCase()) ||
      patrolStatus.includes(searchTerm.toLowerCase()) ||
      isInspectorMatch
    )
  })

  const getPatrolData = async () => {
    try {
      const patrol = await fetchData("get", "/patrols", true);
      setPatrolData(patrol);

      if (typeof window !== 'undefined') {
        const storedFilter = localStorage.getItem('filter');
        let localStorageFilter: FilterPatrol | null = null;
        if (storedFilter) {
          localStorageFilter = JSON.parse(storedFilter) as FilterPatrol;
        }
        if (!localStorageFilter) {
          setFilteredPatrolData(patrol);
        } else {
          setFilteredPatrolData(filterPatrol(localStorageFilter, patrol));
        }
      } else {
        setFilteredPatrolData(patrol);
      }
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };
  const getPresetData = async () => {
    try {
      const preset = await fetchData("get", "/presets", true);
      setPresetData(preset);
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
    localStorage.setItem('filter', JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    const sortedData = sortData(filteredPatrolData, sort);
    if (JSON.stringify(sortedData) !== JSON.stringify(filteredPatrolData)) {
      setFilteredPatrolData(sortedData);
    }
  }, [sort, filteredPatrolData]);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
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
          <DropdownMenuContent align="end" className="p-2">
            <DropdownMenuLabel>{t('SortBy')}</DropdownMenuLabel>
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

            <DropdownMenuLabel>{t('Order')}</DropdownMenuLabel>
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
              <DropdownMenuLabel>{t('Date')}</DropdownMenuLabel>
              <DatePickerWithRange
                startDate={filter?.dateRange.start}
                endDate={filter?.dateRange.end}
                onSelect={handleDateSelect}
                className="my-date-picker"
              />
            </div>
            <div>
              <DropdownMenuLabel>{t('Status')}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter?.patrolStatus.includes("pending")}
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
                checked={filter?.patrolStatus.includes("scheduled")}
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
                checked={filter?.patrolStatus.includes("on_going")}
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
                checked={filter?.patrolStatus.includes("completed")}
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
              <DropdownMenuLabel>{t('Preset')}</DropdownMenuLabel>
              <Select
                value={filter?.presetTitle || 'All'}
                onValueChange={(value) =>
                  setFilter({
                    presetTitle: value,
                    patrolStatus: filter?.patrolStatus || [],
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
                    {presetData &&
                      presetData.map((preset) => (
                        <SelectItem value={preset.title} key={preset.id}>
                          {preset.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={resetFilter}>
                {t('Reset')}
              </Button>
              <Button size="sm" onClick={applyFilter}>{t('Apply')}</Button>
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
          <AlertDialogContent className="w-[620px] h-[715px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                {t('PatrolPreset')}
              </AlertDialogTitle>
              <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                {t('PleaseSelectAPresetForThePatrol')}
              </AlertDialogDescription>
              <div className="flex items-center justify-center">
                <ScrollArea className="p-[1px] h-[545px] w-full rounded-md border border-none pr-[15px] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    {presetData &&
                      presetData.map((preset, index) => (
                        <Button
                          key={index}
                          variant={"outline"}
                          className={`bg-secondary grid grid-cols-1 sm:grid-cols-1 h-[300px] ${selectedPreset === preset
                            ? "border-red-600"
                            : "border-transparent"
                            } border p-2`}
                          onClick={() => setSelectedPreset(preset)}
                        >
                          {/* Title */}
                          <div className="w-full flex items-start justify-start">
                            <p className="font-bold text-xl text-card-foreground truncate">
                              {preset.title}
                            </p>
                          </div>
                          {/* Map */}
                          <div className="flex items-center justify-center mb-1">
                            <div className="h-[175px] w-[185px] bg-card rounded"></div>
                          </div>
                          {/* Description */}
                          <div className="relative w-full">
                            {/* Positioned Icon */}
                            <span className="material-symbols-outlined text-2xl text-muted-foreground absolute left-0 top-0">
                              data_info_alert
                            </span>
                            {/* Positioned Textarea */}
                            <Textarea
                              disabled
                              className="pl-6 pointer-events-none border-none shadow-none overflow-hidden text-left resize-none leading-tight w-full"
                              placeholder={preset.description}
                            />
                          </div>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-[10px]">
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
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
          <AlertDialogContent className="max-w-[995px] h-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                {t('PatrolPreset')}
              </AlertDialogTitle>
              <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                {t('PleaseSelectAPresetForThePatrol')}
              </AlertDialogDescription>
              <p className="font-semibold text-muted-foreground"> {t('Date')}</p>
              <DatePicker
                handleSelectedTime={(time: string) => setSelectedDate(time)}
              />
            </AlertDialogHeader>
            <div className="grid grid-cols-1">
              <p className="font-semibold text-muted-foreground"> {t('Checklist')}</p>
              <ScrollArea className="pr-[10px] h-[400px] w-full rounded-md pr-[15px] overflow-visible overflow-y-clip">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-[10px] ">
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
            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-[10px]">
                <AlertDialogCancel onClick={() => setSecondDialog(false)}>
                  {t('Cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="gap-2"
                  onClick={onSubmit}
                  disabled={isSubmitDisabled}
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

        {patrolQueryResults &&
          patrolQueryResults.map((patrol: IPatrol) => {
            const inspectors = patrol.patrolChecklists.map((cl: IPatrolChecklist) => cl.inspector);
            return (
              <PatrolCard
                key={patrol.id}
                patrolStatus={patrol.status as patrolStatus}
                patrolDate={new Date(patrol.date)}
                patrolPreset={patrol.preset.title}
                patrolId={patrol.id}
                patrolChecklist={patrol.patrolChecklists}
                inspector={inspectors}
              />
            );
          })}
      </div>
    </div>
  );
}