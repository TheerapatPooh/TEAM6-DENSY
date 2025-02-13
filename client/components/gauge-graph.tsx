"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { IPatrolCompletionRateItem } from "@/app/type"

interface IGaugeGraphProps {
    chartData: IPatrolCompletionRateItem[];
}

const chartConfig = {
    noDefect: {
        label: "No Defect",
        color: "hsl(var(--green))",
    },
    withDefect: {
        label: "With Defect",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig


export function GaugeGraph({ chartData }: IGaugeGraphProps) {
    // คำนวณเปอร์เซ็นต์ของ noDefect
    const totalPatrols = chartData.reduce((sum, item) => sum + (item.noDefect || 0) + (item.withDefect || 0), 0);
    const noDefectPercent = (chartData.reduce((sum, item) => sum + (item.noDefect || 0), 0) / totalPatrols * 100).toFixed(2);

    return (
        <div className="flex flex-col">
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
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
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {noDefectPercent}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    No Defect
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="withDefect"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-withDefect)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="noDefect"
                            fill="var(--color-noDefect)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </div>
    )
}
