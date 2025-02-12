"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, LabelList } from "recharts";

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
import { IDefectCategoryItem } from "@/app/type";


interface IDonutGraphProps {
  chartData: IDefectCategoryItem[];
}

const chartConfig = {
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--destructive))",
  },
  safety: {
    label: "Safety",
    color: "hsl(var(--green))",
  },
  environment: {
    label: "Environment",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function DonutGraph({ chartData }: IDonutGraphProps) {
  const totalReports = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amounts, 0);
  }, []);

  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;

                return (
                  <div className="bg-card-foreground p-1 custom-shadow rounded-md">
                    {payload.map((entry, index) => {
                      const percent = ((parseFloat(entry.value.toString()) / totalReports) * 100).toFixed(2);
                      return (
                        <div key={index} className="flex items-center gap-6">
                          <div className="flex items-center gap-1 text-sm font-medium text-border">
                            <span
                              className="inline-block w-3 h-3 rounded-sm"
                              style={{ backgroundColor: entry.payload.fill }}
                            />
                            <p>{entry.name}</p>
                          </div>
                          <p className="text-sm text-card">{percent}%</p>
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
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReports.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reports
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
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
                <div className="flex gap-4 justify-center">
                  {payload?.map((entry, index) => (
                    <div key={`legend-item-${index}`} className="flex items-center gap-1">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      ></span>
                      <span className="text-sm">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-sm font-semibold leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the distribution of defect types.
        </div>
      </CardFooter>
    </div>
  );
}
