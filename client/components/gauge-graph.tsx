/**
 * คำอธิบาย:
 *   คอมโพเนนต์ที่ใช้สำหรับแสดงข้อมูลอัตราความสมบูรณ์ของการตรวจตรา
 * Input:
 * - chartData: ข้อมูลของกราฟแสดงอัตราความสมบูรณ์ของการตรวจตรา
 * - percent: ข้อมูลเปอร์เซ็นต์ของการตรวจตรา
 * Output:
 * - JSX ของการแสดงข้อมูลอัตราความสมบูรณ์ของการตรวจตรา
**/

"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IPatrolCompletionRate } from "@/app/type";
import { useTranslations } from "next-intl";
import NotFound from "@/components/not-found";

export function GaugeGraph({
  chartData,
  percent,
  trend,
}: IPatrolCompletionRate) {
  const d = useTranslations("Dashboard");
  const isPositiveTrend = trend >= 0;

  const chartConfig = {
    noDefect: {
      label: d("NoDefect"),
      color: "hsl(var(--green))",
    },
    withDefect: {
      label: d("WithDefect"),
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig;

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
      <CardContent className="flex flex-1 items-center pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-video w-full h-[360px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={160}
            outerRadius={240}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 36}
                          className="fill-card-foreground text-[48px] font-bold hover:cursor-pointer"
                        >
                          {percent && percent > 0 ? percent.toFixed(2) : 0}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="text-base fill-muted-foreground"
                        >
                          {d("NoDefect")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="withDefect"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-withDefect)"
              className="stroke-transparent stroke-2 hover:cursor-pointer"
            />
            <RadialBar
              dataKey="noDefect"
              fill="var(--color-noDefect)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2 hover:cursor-pointer"
            />
            <ChartLegend
              content={() => (
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex gap-4 justify-center hover:cursor-pointer">
                    <div
                      key={`legend-item-1`}
                      className="flex items-center gap-1"
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: chartConfig.noDefect.color }}
                      ></span>
                      <span className="text-sm">
                        {chartConfig.noDefect.label}
                      </span>
                    </div>
                    <div
                      key={`legend-item-2`}
                      className="flex items-center gap-1"
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: chartConfig.withDefect.color,
                        }}
                      ></span>
                      <span className="text-sm">
                        {chartConfig.withDefect.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold leading-none hover:cursor-text">
                    {d("Trending")}
                    {isPositiveTrend ? d("Up") : d("Down")}
                    <span
                      className={
                        isPositiveTrend ? "text-green" : "text-destructive"
                      }
                    >
                      {(trend ?? 0).toFixed(2)}%
                    </span>
                    {d("ThisMonth")}
                    {isPositiveTrend ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="leading-none text-muted-foreground text-sm hover:cursor-text">
                    {d("PatrolCompletionRateDescription")}
                  </div>
                </div>
              )}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
