"use client";
import { ICommonDefectItem, IDefectCategory, IZone } from "@/app/type";
import DashboardCard from "@/components/dashboard-card";
import { DonutGraph } from "@/components/donut-graph";
import { LineGraph } from "@/components/line-graph";
import { PieGraph } from "@/components/pie-graph";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchData,
  getInitials,
  getMonthRange,
  monthOptions,
} from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("AllTime");
  const [zone, setZone] = useState<IZone>();
  const [defectCatagory, setDefectCatagory] = useState<IDefectCategory>();
  const [commonDefects, setCommonDefect] = useState<ICommonDefectItem[]>();

  const t = useTranslations("General");
  const d = useTranslations("Dashboard");
  const m = useTranslations("Month");
  const z = useTranslations("Zone");
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  const getData = async () => {
    const { startDate, endDate } = getMonthRange(selectedMonth);
    const queryParams: Record<string, string | undefined> = {};

    if (startDate) queryParams.startDate = startDate.toISOString();
    if (endDate) queryParams.endDate = endDate.toISOString();
    queryParams.zoneId = params.id.toString()

    const queryString = new URLSearchParams(queryParams).toString();
    const zone = await fetchData("get", `/zone/${params.id}?dashboard=true&${queryString}`, true);
    const defectCatagory = await fetchData("get", `/dashboard/defect-catagory?${queryString}`, true);
    const commonDefects = await fetchData("get", `/dashboard/common-defects?${queryString}`, true);

    // fetch data
    setZone(zone);
    setDefectCatagory(defectCatagory);
    setCommonDefect(commonDefects);
  };

  useEffect(() => {
    getData();
    setMounted(true);
  }, []);

  useEffect(() => {
    getData();
  }, [selectedMonth]);

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
          Back
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-2 mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="material-symbols-outlined">person_search</span>
            <p className="text-lg font-semibold">{t("supervisor")}</p>
          </div>
          <div className="flex items-center gap-1">
            <Avatar className="custom-shadow h-[35px] w-[35px]">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${zone.supervisor.profile?.image?.path}`}
              />
              <AvatarFallback id={zone.supervisor.id.toString()}>
                {getInitials(zone.supervisor.profile?.name)}
              </AvatarFallback>
            </Avatar>

            <p className="text-card-foreground text-lg">
              {zone.supervisor.profile?.name}
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
      <div className="flex gap-4 w-full">
        <DashboardCard
          title="TotalComments"
          value={zone.dashboard.totalComments.value}
          trend={zone.dashboard.totalComments.trend}
          icon="campaign"
          iconColor="orange"
          positive={false}
        />
        <DashboardCard
          title="DefectCompleted"
          value={zone.dashboard.defectCompleted.value}
          trend={zone.dashboard.defectCompleted.trend}
          icon="verified"
          iconColor="green"
          positive={true}
        />
        <DashboardCard
          title="DefectPending"
          value={zone.dashboard.defectPending.value}
          trend={zone.dashboard.defectPending.trend}
          icon="hourglass_top"
          iconColor="yellow"
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
      {/* Defect Catagory & Common Defects */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between">
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            {d("DefectCatagory")}
          </h1>
          <DonutGraph key={Date.now()} chartData={defectCatagory.chartData} trend={defectCatagory.trend} />
        </div>
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            {d("CommonDefects")}
          </h1>
          <PieGraph key={Date.now()} chartData={commonDefects} />
        </div>
      </div>
      
    </div>
  );
}
