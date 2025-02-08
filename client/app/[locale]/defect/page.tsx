/**
 * คำอธิบาย:
 *  หน้าแสดงรายการข้อบกพร่องทั้งหมด โดยสามารถค้นหา, กรอง, เรียงลำดับข้อมูลได้
 * Input: 
 * - ไม่มี
 * Output:
 * - หน้าแสดงรายการข้อบกพร่องทั้งหมด โดยสามารถค้นหา, กรอง, เรียงลำดับข้อมูลได้
 **/

"use client";

import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
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
import Defect from "@/components/defect";
import { IFilterDefect, IDefect, itemType, defectStatus } from "@/app/type";
import { fetchData, sortData } from "@/lib/utils";
import Loading from "@/components/loading";
import { DatePickerWithRange } from "@/components/date-picker";
import { DateRange } from "react-day-picker";
import NotFound from "@/components/not-found";



export default function Page() {
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allDefects, setAllDefects] = useState<IDefect[]>([])
  const getAllDefects = async () => {
    try {
      const queryString = buildQueryString(filter, searchTerm);
      const data = await fetchData("get", `/defects?${queryString}`, true);
      setAllDefects(data);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  const handleSortChange = (type: string, value: string) => {
    setSort((prevSort) => ({
      ...prevSort,
      [type]: value,
    }));
  };

  const defectStatus: defectStatus[] = ["reported", "completed", "pending_inspection", "in_progress", "resolved"]

  const initialFilter = {
    defectStatus: "All",
    defectTypes: ["safety", "environment", "maintenance"],
    dateRange: { start: undefined, end: undefined },
  };

  const getStoredFilter = () => {
    if (typeof window !== 'undefined') {
      const storedFilter = localStorage.getItem('defectsFilter');
      if (storedFilter) {
        return JSON.parse(storedFilter);
      }
    }
    return initialFilter;
  };

  const [filter, setFilter] = useState<IFilterDefect | null>(getStoredFilter())

  const [sort, setSort] = useState<{ by: string; order: string }>({
    by: "Date",
    order: "Ascending",
  });

  const toggleTypeFilter = (type: itemType, checked: boolean) => {
    if (checked) {
      setFilter((prev) => {
        if (prev) {
          return {
            ...prev,
            defectTypes: [...prev.defectTypes, type],
          };
        } else {
          return {
            defectStatus: "All",
            defectTypes: [],
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
            defectTypes: prev.defectTypes.filter((s) => s !== type),
          };
        }
        return prev;
      });
    }
  };

  const applyFilter = () => {
    getAllDefects()
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
      defectStatus: filter?.defectStatus || null,
      defectTypes: filter?.defectTypes || [],
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

  const buildQueryString = (filter: IFilterDefect | null, searchTerm: string) => {
    const params: Record<string, string | undefined> = {};

    // เพิ่ม search term ถ้ามี
    if (searchTerm) params.search = searchTerm;

    // เพิ่ม status filter ถ้าไม่ใช่ "All"
    if (filter?.defectStatus && filter.defectStatus !== "All") {
      params.status = filter.defectStatus;
    }

    // เพิ่ม type filter
    if (filter?.defectTypes?.length) {
      params.type = filter.defectTypes.join(",");
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

  useEffect(() => {
    getAllDefects()
    setLoading(false)
  }, [])

  useEffect(() => {
    getAllDefects()
  }, [searchTerm])

  useEffect(() => {
    localStorage.setItem('defectFilter', JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    const sortedData = sortData(allDefects, sort);
    if (JSON.stringify(sortedData) !== JSON.stringify(allDefects)) {
      setAllDefects(sortedData);
    }
  }, [sort, allDefects]);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col">

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
              <DropdownMenuRadioItem value="Date" className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('Date')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Status" className="text-base" onSelect={(e) => e.preventDefault()}>
                {t('Status')}
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
              <Select
                value={filter?.defectStatus || 'All'}
                onValueChange={(value) =>
                  setFilter({
                    defectStatus: value,
                    defectTypes: filter?.defectTypes || [],
                    dateRange: { start: filter?.dateRange.start, end: filter?.dateRange.end }
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={filter?.defectStatus === 'All' ? t('All') : filter?.defectStatus}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('Status')}</SelectLabel>
                    <SelectItem value="All">{t('All')}</SelectItem>
                    {defectStatus.map((status) => (
                      <SelectItem value={status} key={status}>
                        {s(status)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Type')}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter?.defectTypes.includes("safety")}
                onCheckedChange={(checked) => toggleTypeFilter("safety", checked)}
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="green"
                  showIcon={true}
                  iconName="verified_user"
                  children={s('safety')}
                  shape="square"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter?.defectTypes.includes("environment")}
                onCheckedChange={(checked) => toggleTypeFilter("environment", checked)}
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="blue"
                  showIcon={true}
                  iconName="psychiatry"
                  children={s('environment')}
                  shape="square"
                />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter?.defectTypes.includes("maintenance")}
                onCheckedChange={(checked) => toggleTypeFilter("maintenance", checked)}
                onSelect={(e) => e.preventDefault()}
              >
                <BadgeCustom
                  width="w-full"
                  variant="red"
                  showIcon={true}
                  iconName="build"
                  children={s('maintenance')}
                  shape="square"
                />
              </DropdownMenuCheckboxItem>
            </div>

            <div className="flex w-full justify-end mt-4 gap-2">
              <Button size="sm" variant="secondary" onClick={resetFilter}>
                {t('Reset')}
              </Button>
              <Button size="sm" variant="primary" onClick={applyFilter}>{t('Apply')}</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <div className="flex flex-col gap-y-4 py-4">
        {allDefects.length === 0 ? (
          <NotFound
            icon="campaign"
            title="NoDefectsFoundTitle"
            description="NoDefectsFoundDescription"
          />
        ) : (
          allDefects.map((defect) => (
            <Defect key={defect.id} defect={defect} />
          ))
        )}
      </div>
    </div>
  );
}