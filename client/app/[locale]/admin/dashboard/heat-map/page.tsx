'use client'
import { ICommonDefectItem, IDefectCategory, IHeatmapZone, IPatrolCompletionRate } from "@/app/type";
import { DonutGraph } from "@/components/donut-graph";
import { GaugeGraph } from "@/components/gauge-graph";
import HeatMap from "@/components/heat-map";
import { PieGraph } from "@/components/pie-graph";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchData } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export default function Page() {
  const d = useTranslations("Dashboard");
  const m = useTranslations("Month");
  const [heatMap, setHeatMap] = useState<IHeatmapZone[]>();
  const [defectCatagory, setDefectCatagory] = useState<IDefectCategory>();
  const [commonDefects, setCommonDefect] = useState<ICommonDefectItem[]>();
  const [patrolCompletion, setPatrolCompletion] = useState<IPatrolCompletionRate>();
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("AllTime");

  const getMonthRange = (month: string) => {
    if (month === "AllTime") return { startDate: undefined, endDate: undefined };

    const dateParts = month.split(" ");
    const year = parseInt(dateParts[1]);
    const monthIndex = new Date(`${dateParts[0]} 1, ${year}`).getMonth();

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  };

  const getData = async () => {
    const { startDate, endDate } = getMonthRange(selectedMonth);
    const params: Record<string, string | undefined> = {};

    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const queryString = new URLSearchParams(params).toString()
    const heatMap = await fetchData("get", `/dashboard/heat-map?${queryString}`, true);
    const defectCatagory = await fetchData("get", `/dashboard/defect-catagory?${queryString}`, true);
    const commonDefects = await fetchData("get", `/dashboard/common-defects?${queryString}`, true);
    const patrolCompletion = await fetchData("get", `/dashboard/patrol-completion?${queryString}`, true);
    // fetch data
    setHeatMap(heatMap);
    setDefectCatagory(defectCatagory);
    setCommonDefect(commonDefects);
    setPatrolCompletion(patrolCompletion);
  };

  useEffect(() => {
    getData();
    setMounted(true);
  }, []);

  useEffect(() => {
    getData();
  }, [selectedMonth]);

  if (!mounted || !heatMap || !defectCatagory || !commonDefects || !patrolCompletion) return null;

  const today = new Date();

  const monthOptions = ["AllTime", ...Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return monthFormatter.format(date);
  })];

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      {/* Heat Map */}
      <div className="flex flex-col items-center justify-between w-full bg-card rounded-md custom-shadow py-4 px-6">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-semibold text-card-foreground">
            {d("HeatMap")}
          </h1>
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
        <HeatMap data={heatMap} />
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
      {/* Patrol Completion */}
      <div className="flex flex-col rounded-md px-6 py-4 bg-card min-h-[460px]">
        <h1 className="text-2xl font-semibold text-card-foreground">
          {d("PatrolCompletionRate")}
        </h1>
        <GaugeGraph key={Date.now()} chartData={patrolCompletion.chartData} percent={patrolCompletion.percent} trend={patrolCompletion.trend} />
      </div>
    </div>
  );
}