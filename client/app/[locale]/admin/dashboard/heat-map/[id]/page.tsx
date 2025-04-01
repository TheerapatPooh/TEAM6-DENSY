/**
 * คำอธิบาย:
 * คอมโพเนนต์ HeatMapDetailPage แสดงรายละเอียดของส่วนงานที่รับผิดชอบ (Zone) พร้อมทั้งแสดงข้อมูลการตรวจพบปัญหาในรูปแบบกราฟต่างๆ
 * โดยประกอบไปด้วย Dashboard Cards สำหรับสถิติปัญหาต่างๆ (TotalReport, DefectCompleted, DefectPending), กราฟวิเคราะห์แนวโน้มปัญหา (LineGraph),
 * กราฟ Donut สำหรับหมวดหมู่ปัญหา และกราฟ Pie สำหรับปัญหาที่พบบ่อย รวมถึงตารางแสดงรายละเอียดของปัญหาที่รายงาน
 *
 * Input:
 * - ไม่มีการรับ input โดยตรง แต่ใช้ state, URL parameters (zone ID) และค่า filter จาก localStorage ในการดึงข้อมูล
 *
 * Output:
 * - แสดงรายละเอียดของ Zone พร้อมข้อมูลสถิติและกราฟต่างๆ ที่สรุปปัญหาที่เกิดขึ้นในส่วนงานนั้น
 * - แสดงตารางรายงานปัญหาพร้อมฟังก์ชันการกรอง, การจัดเรียง และการค้นหาข้อมูล
**/
"use client";
import NotFoundPage from "@/app/not-found";
import {
  ICommonDefectItem,
  IDefectCategory,
  IFilterDefect,
  itemType,
  IZone,
  defectStatus,
} from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import DashboardCard from "@/components/dashboard-card";
import { DonutGraph } from "@/components/donut-graph";
import { LineGraph } from "@/components/line-graph";
import NotFound from "@/components/not-found";
import { PieGraph } from "@/components/pie-graph";
import Textfield from "@/components/textfield";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { UserTooltip } from "@/components/user-tooltip";
import {
  fetchData,
  formatTime,
  getDefectStatusVariant,
  getInitials,
  getItemTypeVariant,
  getMonthRange,
  monthOptions,
  sortData,
} from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function HeatMapDetailPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("AllTime");
  const [zone, setZone] = useState<IZone>();
  const [defectCategory, setDefectCategory] = useState<IDefectCategory>();
  const [commonDefects, setCommonDefect] = useState<ICommonDefectItem[]>();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // ฟังก์ชันที่ใช้เพื่ออัพเดตความกว้างหน้าจอ
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // เพิ่ม event listener สำหรับ resize
    window.addEventListener("resize", handleResize);

    // ลบ event listener เมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSortChange = (type: string, value: string) => {
    setSort((prevSort) => ({
      ...prevSort,
      [type]: value,
    }));
  };

  const defectStatus: defectStatus[] = [
    "reported",
    "completed",
    "pending_inspection",
    "in_progress",
    "resolved",
  ];

  const initialFilter = {
    defectStatus: "All",
    defectTypes: ["safety", "environment", "maintenance"],
    dateRange: { start: undefined, end: undefined },
  };

  const getStoredFilter = () => {
    if (typeof window !== "undefined") {
      const storedFilter = localStorage.getItem("dashboardDefectsFilter");
      if (storedFilter) {
        return JSON.parse(storedFilter);
      }
    }
    return initialFilter;
  };

  const [filter, setFilter] = useState<IFilterDefect | null>(getStoredFilter());
  const [sort, setSort] = useState<{ by: string; order: string }>({
    by: "DefectDate",
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
            dateRange: { start: undefined, end: undefined },
          };
        }
      });
    } else {
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
    getData();
  };

  const resetFilter = () => {
    setFilter(initialFilter);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const t = useTranslations("General");
  const d = useTranslations("Dashboard");
  const s = useTranslations("Status");
  const m = useTranslations("Month");
  const z = useTranslations("Zone");
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  const getData = async () => {
    const { startDate, endDate } = getMonthRange(selectedMonth);
    const queryParams: Record<string, string | undefined> = {};
    // เพิ่ม search term ถ้ามี
    if (searchTerm) queryParams.search = searchTerm;

    // เพิ่ม status filter ถ้าไม่ใช่ "All"
    if (filter?.defectStatus && filter.defectStatus !== "All") {
      queryParams.status = filter.defectStatus;
    }

    // เพิ่ม type filter
    if (filter?.defectTypes?.length) {
      queryParams.type = filter.defectTypes.join(",");
    }
    if (startDate) queryParams.startDate = startDate.toISOString();
    if (endDate) queryParams.endDate = endDate.toISOString();
    queryParams.zoneId = params.id.toString();

    const queryString = new URLSearchParams(queryParams).toString();
    const zone = await fetchData(
      "get",
      `/zone/${params.id}?dashboard=true&${queryString}`,
      true
    );
    const defectCategory = await fetchData(
      "get",
      `/dashboard/defect-category?${queryString}`,
      true
    );
    const commonDefects = await fetchData(
      "get",
      `/dashboard/common-defects?${queryString}`,
      true
    );

    if (!zone || zone.status === 404) {
      return router.push(`/${locale}/404`);
    }
    
    // fetch data
    setZone(zone);
    setDefectCategory(defectCategory);
    setCommonDefect(commonDefects);
  };

  useEffect(() => {
    getData();
    setMounted(true);
  }, []);

  useEffect(() => {
    getData();
  }, [selectedMonth, searchTerm]);

  useEffect(() => {
    localStorage.setItem("dashboardDefectsFilter", JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    // ตรวจสอบว่า zone และ zone.dashboard มีค่าอยู่หรือไม่
    if (zone && zone.dashboard && zone.dashboard.defects) {
      const sortedData = sortData(zone.dashboard.defects, sort);

      // เปรียบเทียบค่าก่อนและหลังการ sorted ถ้าไม่เท่ากันให้ทำการอัปเดตเฉพาะ defects
      if (
        JSON.stringify(sortedData) !== JSON.stringify(zone.dashboard.defects)
      ) {
        setZone((prevState) => ({
          ...prevState,
          dashboard: {
            ...prevState.dashboard,
            defects: sortedData,
          },
        }));
      }
    }
  }, [sort, zone]);

  if (!mounted || !zone) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold text-card-foreground">
          {z(zone.name)}
        </h1>
        <Button
          variant="secondary"
          onClick={() => router.push(`/${locale}/admin/dashboard/heat-map`)}
        >
          {t("Back")}
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-2 mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="material-symbols-outlined">person_search</span>
            <p className="text-lg font-semibold">{t("supervisor")}</p>
          </div>
          <div className="flex items-center gap-1">
            <UserTooltip user={zone.supervisor}>
              <Avatar className="custom-shadow h-[35px] w-[35px]">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${zone.supervisor?.profile?.image?.path}`}
                />
                <AvatarFallback id={zone.supervisor?.id.toString()}>
                  {getInitials(zone.supervisor?.profile.name)}
                </AvatarFallback>
              </Avatar>
            </UserTooltip>

            <p className="text-card-foreground text-lg">
              {zone.supervisor?.profile.name}
            </p>
          </div>
        </div>
        <div className="w-48">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {`${m(month.split(" ")[0])} ${month.split(" ")[1] || ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea
        className=" max-h-full h-full w-full rounded-md flex-1 
    [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-280px)]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex sm:flex-col xl:flex-row gap-4 w-full">
            <DashboardCard
              title="TotalReport"
              value={zone.dashboard.defectReported.value}
              trend={zone.dashboard.defectReported.trend}
              icon="campaign"
              variant="orange"
              positive={false}
            />
            <DashboardCard
              title="DefectCompleted"
              value={zone.dashboard.defectCompleted.value}
              trend={zone.dashboard.defectCompleted.trend}
              icon="verified"
              variant="green"
              positive={true}
            />
            <DashboardCard
              title="DefectPending"
              value={zone.dashboard.defectPending.value}
              trend={zone.dashboard.defectPending.trend}
              icon="hourglass_top"
              variant="yellow"
              positive={false}
            />
          </div>
          <div className="flex flex-col rounded-md gap-2 px-6 py-4 bg-card custom-shadow min-h-[460px]">
            <h1 className="text-2xl font-semibold text-card-foreground">
              {d("DefectTrendAnalysis")}
            </h1>
            <LineGraph
              chartData={zone.dashboard.chartData}
              defectTrend={zone.dashboard.defectTrend}
            />
          </div>
          {/* Defect Category & Common Defects */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between">
            <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
              <h1 className="text-2xl font-semibold text-card-foreground">
                {d("DefectCategory")}
              </h1>
              <DonutGraph
                key={JSON.stringify(defectCategory.chartData)}
                chartData={defectCategory.chartData}
                trend={defectCategory.trend}
              />
            </div>
            <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
              <h1 className="text-2xl font-semibold text-card-foreground">
                {d("CommonDefects")}
              </h1>
              <PieGraph
                key={JSON.stringify(commonDefects)}
                chartData={commonDefects}
              />
            </div>
          </div>
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
                    value="DefectDate"
                    className="text-base"
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t("Date")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="Status"
                    className="text-base"
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t("Status")}
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
                    {t("Status")}
                  </DropdownMenuLabel>
                  <Select
                    value={filter?.defectStatus || "All"}
                    onValueChange={(value) =>
                      setFilter({
                        defectStatus: value,
                        defectTypes: filter?.defectTypes || [],
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
                          filter?.defectStatus === "All"
                            ? t("All")
                            : filter?.defectStatus
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("Status")}</SelectLabel>
                        <SelectItem value="All">{t("All")}</SelectItem>
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
                  <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                    {t("Type")}
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filter?.defectTypes.includes("safety")}
                    onCheckedChange={(checked) =>
                      toggleTypeFilter("safety", checked)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    <BadgeCustom
                      width="w-full"
                      variant="green"
                      showIcon={true}
                      iconName="verified_user"
                      children={s("safety")}
                      shape="square"
                    />
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter?.defectTypes.includes("environment")}
                    onCheckedChange={(checked) =>
                      toggleTypeFilter("environment", checked)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    <BadgeCustom
                      width="w-full"
                      variant="blue"
                      showIcon={true}
                      iconName="psychiatry"
                      children={s("environment")}
                      shape="square"
                    />
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter?.defectTypes.includes("maintenance")}
                    onCheckedChange={(checked) =>
                      toggleTypeFilter("maintenance", checked)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    <BadgeCustom
                      width="w-full"
                      variant="red"
                      showIcon={true}
                      iconName="build"
                      children={s("maintenance")}
                      shape="square"
                    />
                  </DropdownMenuCheckboxItem>
                </div>

                <div className="flex w-full justify-end mt-4 gap-2">
                  <Button size="sm" variant="secondary" onClick={resetFilter}>
                    {t("Reset")}
                  </Button>
                  <Button size="sm" variant="primary" onClick={applyFilter}>
                    {t("Apply")}
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table className="overflow-hidden min-h-[calc(100vh-860px)]">
            <TableHeader>
              <TableRow className="grid grid-cols-12 w-full">
                <TableHead className="sm:col-span-3 lg:col-span-4">
                  {t("Name")}
                </TableHead>
                <TableHead className="sm:col-span-2 lg:col-span-2">
                  {t("Type")}
                </TableHead>
                <TableHead className="sm:col-span-2 lg:col-span-2">
                  {t("Reporter")}
                </TableHead>
                <TableHead className="sm:col-span-3 lg:col-span-2">
                  {t("Timestamp")}
                </TableHead>
                <TableHead className="sm:col-span-2 lg:col-span-2">
                  {t("Status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ScrollArea className="rounded-md w-full [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-660px)] min-h-[calc(100vh-660px)]">
                {zone.dashboard.defects?.length === 0 ? (
                  <tr className="flex w-full h-full">
                    <td colSpan={5} className="w-full text-center py-6">
                      <NotFound
                        icon="campaign"
                        title="NoDefectsReported"
                        description="NoDefectsDescription"
                      />
                    </td>
                  </tr>
                ) : (
                  zone.dashboard.defects.map((defect, index) => (
                    <TableRow key={index} className="grid grid-cols-12">
                      <TableCell className="sm:text-sm lg:text-base sm:col-span-3 lg:col-span-4 flex items-center min-w-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate">{defect.name}</span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="ml-[129px]"
                            >
                              <p className="max-w-[200px] break-words">
                                {defect.name}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="sm:text-sm lg:text-base sm:col-span-2 lg:col-span-2 flex items-center">
                        <BadgeCustom
                          variant={getItemTypeVariant(defect.type).variant}
                          iconName={getItemTypeVariant(defect.type).iconName}
                          shape="square"
                          showIcon={true}
                          hideText={windowWidth > 1024 ? false : true}
                        >
                          {s(defect.type)}
                        </BadgeCustom>
                      </TableCell>
                      <TableCell className="sm:text-sm lg:text-base sm:col-span-2 lg:col-span-2 flex gap-2 items-center">
                        {defect.user?.profile?.name ? (
                          <UserTooltip user={defect.user}>
                            <Avatar className="custom-shadow h-[35px] w-[35px]">
                              <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                              />
                              <AvatarFallback id={defect.user.id.toString()}>
                                {getInitials(defect.user.profile.name)}
                              </AvatarFallback>
                            </Avatar>
                          </UserTooltip>
                        ) : (
                          <Skeleton className="h-12 w-12 rounded-full bg-input" />
                        )}
                        <div className="sm:hidden lg:flex">
                          {defect.user?.profile?.name ? (
                            defect.user.profile.name
                          ) : (
                            <div className="text-destructive">
                              <div className="text-[14px]">
                                No profile is provided
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="sm:text-sm lg:text-base sm:col-span-3 lg:col-span-2 flex items-center">
                        {formatTime(defect.startTime, locale)}
                      </TableCell>
                      <TableCell className="sm:text-sm lg:text-base sm:col-span-2 lg:col-span-2 flex items-center">
                        <BadgeCustom
                          variant={
                            getDefectStatusVariant(defect.status).variant
                          }
                          iconName={
                            getDefectStatusVariant(defect.status).iconName
                          }
                          showIcon={true}
                          hideText={windowWidth > 1024 ? false : true}
                        >
                          {s(defect.status)}
                        </BadgeCustom>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </ScrollArea>
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
