'use client'
import { IDashboardData } from "@/app/type";
import { DatePickerWithRange } from "@/components/date-picker";
import { DonutGraph } from "@/components/donut-graph";
import { GaugeGraph } from "@/components/gauge-graph";
import HeatMap from "@/components/heat-map";
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
  const heatMap = [
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
          <DatePickerWithRange className="my-date-picker" />
        </div>
        <HeatMap data={heatMap}/>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Defect Category
          </h1>
          <DonutGraph key={Date.now()} chartData={data.defectCatagory} />
        </div>
        <div className="flex flex-col py-4 px-6 w-full rounded-md custom-shadow bg-card">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Common Defects
          </h1>
          <PieGraph key={Date.now()} chartData={data.commonDefects} />

        </div>
      </div>
      <div className="flex flex-col rounded-md px-6 py-4 bg-card min-h-[460px]">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Patrol Completion Rate
        </h1>
        <GaugeGraph key={Date.now()} chartData={data.patrolCompletionRate} />
      </div>
    </div>
  );
}