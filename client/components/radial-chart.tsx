"use client"
import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import {
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslations } from "next-intl"
import NotFound from "@/components/not-found";


const chartConfig = {
    duration: {
        label: "Duration",
        color: "hsl(var(--chart-1))",
    },
    timeRangeShort: {
        label: "< 2 hr.",
        color: "hsl(var(--green))",
    },
    timeRangeMedium: {
        label: "2-3 hr.",
        color: "hsl(var(--yellow))",
    },
    timeRangeLong: {
        label: "> 3 hr.",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig

export function RadialChart({ duration }) {

    if (!duration || duration === null) {
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
    const t = useTranslations("General");
    const d = useTranslations("Dashboard");

    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    const secondsMatch = duration.match(/(\d+)s/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

    const totalDuration = hours + minutes / 60 + seconds / 3600;
    const formattedDuration = totalDuration.toFixed(2);

    let fillColor;
    if (totalDuration < 2) {
        fillColor = "var(--color-timeRangeShort)";
    } else if (totalDuration >= 2 && totalDuration <= 3) {
        fillColor = "var(--color-timeRangeMedium)";
    } else {
        fillColor = "var(--color-timeRangeLong)";
    }

    const chartData = [
        { duration: formattedDuration, fill: fillColor },
    ]

    function calculateEndAngle(): number {
        return Math.min((totalDuration / 12) * 360, 360);
    }



    return (
        <div className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={calculateEndAngle()}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={({ payload }) => {
                                if (!payload || payload.length === 0) return null;

                                return (
                                    <div className="bg-card-foreground px-2.5 py-1.5 custom-shadow rounded-md">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-sm text-border">
                                                <span
                                                    className="inline-block w-2.5 h-2.5 rounded-[2px]"
                                                    style={{ backgroundColor: fillColor }}
                                                />
                                                <p>Duration</p>
                                            </div>
                                            <p className="text-sm text-card font-semibold">{duration}</p>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="duration" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {formattedDuration}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {t("Hour")}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm ">
                <div className="flex gap-4 justify-center hover:cursor-pointer">
                    <div key={`legend-item-1`} className="flex items-center gap-1">
                        <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ backgroundColor: chartConfig.timeRangeShort.color }}
                        ></span>
                        <span className="text-sm">{chartConfig.timeRangeShort.label}</span>
                    </div>
                    <div key={`legend-item-2`} className="flex items-center gap-1">
                        <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ backgroundColor: chartConfig.timeRangeMedium.color }}
                        ></span>
                        <span className="text-sm">{chartConfig.timeRangeMedium.label}</span>
                    </div>
                    <div key={`legend-item-3`} className="flex items-center gap-1">
                        <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ backgroundColor: chartConfig.timeRangeLong.color }}
                        ></span>
                        <span className="text-sm">{chartConfig.timeRangeLong.label}</span>
                    </div>
                </div>

                <div className="leading-none text-muted-foreground">
                    {d("PatrolDurationDescription")}
                </div>
            </CardFooter>
        </div >
    )
}