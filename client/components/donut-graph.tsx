"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { type: "Maintenance", amounts: 60, fill: "var(--color-maintenance)" },
  { type: "Safety", amounts: 55, fill: "var(--color-safety)" },
  { type: "Environment", amounts: 25, fill: "var(--color-environment)" },
];

const chartConfig = {
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-1))",
  },
  safety: {
    label: "Safety",
    color: "hsl(var(--chart-2))",
  },
  environment: {
    label: "Environment",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function DonutGraph() {
  const totalReports = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amounts, 0);
  }, []);

  // formatter สำหรับ tooltip เพื่อแสดงเปอร์เซ็นต์
  const tooltipFormatter = (value: number) => {
    const percent = ((value / totalReports) * 100).toFixed(2);
    return `${percent}%`;
  };

  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel formatter={tooltipFormatter} />
              }
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
              {/* เพิ่ม LabelList เพื่อแสดงจำนวนในแต่ละ slice */}
              <LabelList
                dataKey="amounts"
                className="fill-background"
                position="inside"
                stroke="none"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total reports for the last 6 months
        </div>
      </CardFooter>
    </div>
  );
}
