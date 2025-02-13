'use client'
import { IDashboardData } from "@/app/type";
import { DatePickerWithRange } from "@/components/date-picker";
import { DonutGraph } from "@/components/donut-graph";
import { PieGraph } from "@/components/pie-graph";
import { fetchData } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<IDashboardData>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const response = await fetchData("get", "/dashboard/heat-map", true);
      // fetch data
      setData(response);
    };
    getData();
    setMounted(true);
  }, []);

  if (!mounted || !data) return null;

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex items-center justify-between w-full bg-card rounded-md custom-shadow py-4 px-6">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Heat Map
        </h1>
        <DatePickerWithRange className="my-date-picker" />
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Defect Category
          </h1>
          <DonutGraph chartData={data.defectCatagory}/>
        </div>
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Common Defects
          </h1>
          <PieGraph chartData={data.commonDefects}/>

        </div>
      </div>
      <div className="flex rounded-md px-6 py-4 bg-card">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Patrol Completion Rate
        </h1>
      </div>
    </div>
  );
}
