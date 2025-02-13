'use client'
import { ICommonDefectItem, IDashboardData, IDefectCategoryItem, IFilterPatrol, IHeatmapZone, IPatrolCompletionRateItem } from "@/app/type";
import { DatePickerWithRange } from "@/components/date-picker";
import { DonutGraph } from "@/components/donut-graph";
import { GaugeGraph } from "@/components/gauge-graph";
import HeatMap from "@/components/heat-map";
import { PieGraph } from "@/components/pie-graph";
import { fetchData } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function Page() {
  const [heatMap, setHeatMap] = useState<IHeatmapZone[]>();
  const [defectCatagory, setDefectCatagory] = useState<IDefectCategoryItem[]>();
  const [commonDefects, setCommonDefect] = useState<ICommonDefectItem[]>();
  const [patrolCompletion, setPatrolCompletion] = useState<IPatrolCompletionRateItem[]>();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<{ start: Date | undefined; end: Date | undefined }>()

  const getData = async () => {
    const params: Record<string, string | undefined> = {};
    // เพิ่ม startDate
    if (filter?.start) {
      params.startDate = filter?.start.toISOString();
    }

    // เพิ่ม endDate 
    if (filter?.end) {
      params.endDate = filter?.end.toISOString();
    }
    const queryString = new URLSearchParams(params).toString()
    console.log(queryString)

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

  const handleDateSelect = (dateRange: DateRange) => {
    const startDate = dateRange.from ?? null;
    const endDate = dateRange.to
      ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
      : null;
    setFilter(
      {
        start: startDate || undefined,
        end: endDate || undefined
      }
    );
  };

  useEffect(() => {
    getData();
    setMounted(true);
  }, []);

  useEffect(() => {
    getData();
  }, [filter]);

  if (!mounted || !heatMap || !defectCatagory || !commonDefects || !patrolCompletion) return null;
  const heatMapMock = [
    {
      "id": 1,
      "name": "r&d_zone",
      "defects": 23
    },
    {
      "id": 2,
      "name": "assembly_line_zone",
      "defects": 34
    },
    {
      "id": 3,
      "name": "raw_materials_storage_zone",
      "defects": 4
    },
    {
      "id": 4,
      "name": "quality_control_zone",
      "defects": 11
    },
    {
      "id": 5,
      "name": "it_zone",
      "defects": 45
    },
    {
      "id": 6,
      "name": "customer_service_zone",
      "defects": 6
    },
    {
      "id": 7,
      "name": "prototype_zone",
      "defects": 57
    },
    {
      "id": 8,
      "name": "manager_office",
      "defects": 26
    },
    {
      "id": 9,
      "name": "water_supply",
      "defects": 4
    },
    {
      "id": 10,
      "name": "maintenance_zone",
      "defects": 12
    },
    {
      "id": 11,
      "name": "warehouse",
      "defects": 23
    },
    {
      "id": 12,
      "name": "storage_zone",
      "defects": 0
    },
    {
      "id": 13,
      "name": "server_room",
      "defects": 78
    },
    {
      "id": 14,
      "name": "electrical_zone",
      "defects": 0
    },
    {
      "id": 15,
      "name": "engineering_zone",
      "defects": 45
    },
    {
      "id": 16,
      "name": "training_simulation_zone",
      "defects": 0
    },
    {
      "id": 17,
      "name": "workstation_a",
      "defects": 0
    },
    {
      "id": 18,
      "name": "workstation_b",
      "defects": 0
    },
    {
      "id": 19,
      "name": "testing_lab",
      "defects": 0
    }
  ]
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex flex-col items-center justify-between w-full bg-card rounded-md custom-shadow py-4 px-6">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Heat Map
          </h1>
          <DatePickerWithRange
            startDate={filter?.start}
            endDate={filter?.end}
            onSelect={handleDateSelect}
            className="my-date-picker"
          />        </div>
        <HeatMap data={heatMap} />
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Defect Category
          </h1>
          <DonutGraph key={Date.now()} chartData={defectCatagory} />
        </div>
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Common Defects
          </h1>
          <PieGraph key={Date.now()} chartData={commonDefects} />

        </div>
      </div>
      <div className="flex flex-col rounded-md px-6 py-4 bg-card min-h-[460px]">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Patrol Completion Rate
        </h1>
        <GaugeGraph key={Date.now()} chartData={patrolCompletion} />
      </div>
    </div>
  );
}