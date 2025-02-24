"use client";

import * as React from "react";
import { Pie, PieChart, LabelList } from "recharts";

import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";
import { ICommonDefectItem } from "@/app/type";
import { useTranslations } from "next-intl";
import NotFound from "@/components/not-found";


interface IDonutGraphProps {
  chartData: ICommonDefectItem[];
}

export function PieGraph({ chartData }: IDonutGraphProps) {
  const d = useTranslations("Dashboard");
  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    }, {} as ChartConfig);
  }, [chartData]);


  const totalReports = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amounts, 0);
  }, []);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <NotFound
          icon="monitoring"
          title="NoDataAvailable"
          description="NoDataAvailableDescription"
        />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart width={300} height={350}>
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;

                return (
                  <div className="bg-card-foreground px-2.5 py-1.5 custom-shadow rounded-md">
                    {payload.map((entry, index) => {
                      const percent = ((parseFloat(entry.value.toString()) / totalReports) * 100).toFixed(2);
                      return (
                        <div key={index} className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-border">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-[2px]"
                              style={{ backgroundColor: entry.payload.fill }}
                            />
                            <p>{entry.name}</p>
                          </div>
                          <p className="text-sm text-card font-semibold">{percent}%</p>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Pie
              data={chartData}
              dataKey="amounts"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              className="hover:cursor-pointer"
            >
              <LabelList
                dataKey="amounts"
                className="fill-card"
                position="inside"
                stroke="none"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Pie>
            <ChartLegend
              content={({ payload }) => (
                <div className="flex flex-col gap-1 justify-center">
                  {payload?.map((entry, index) => (
                    <div key={`legend-item-${index}`} className="flex items-center gap-1 hover:cursor-pointer">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      ></span>
                      <span className="text-sm">{entry.value}</span>
                    </div>
                  ))}
                  <div className="mt-2 text-center leading-none text-muted-foreground text-sm hover:cursor-text">
                    {d("CommonDefectsDescription")}
                  </div>
                </div>
              )}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
