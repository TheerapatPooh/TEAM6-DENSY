/**
 * คำอธิบาย:
 *   คอมโพเนนต์ที่ใช้สำหรับแสดงกราฟเส้นที่แสดงแนวโน้มของจำนวนข้อบกพร่องในแต่ละเดือน
 * Input: 
    * - chartData: ข้อมูลของแผนที่ที่แสดงโซนต่างๆ ในสถานที่
    * - defectTrend: ข้อมูลของแนวโน้มของจำนวนข้อบกพร่องในแต่ละเดือน
 * Output:
 * - JSX ของ LineGraph ที่แสดงกราฟเส้นที่แสดงแนวโน้มของจำนวนข้อบกพร่องในแต่ละเดือน
**/

"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useTranslations } from "next-intl"
import NotFound from "@/components/not-found"


export function LineGraph({ chartData, defectTrend }) {
    const d = useTranslations('Dashboard')
    const s = useTranslations('Sidebar')
    const m = useTranslations('Month')
    const chartConfig = {
        defect: {
            label: s("Defect"),
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    // ฟังก์ชันแปลงชื่อเดือน
    const translateMonth = (month: string) => {
        const [monthName, year] = month.split(" ");
        return `${m(monthName)} ${year}`;  // แปลชื่อเดือนและคงปีไว้
    };

    const sortedChartData = chartData.sort((a, b) => {
        // สมมติว่า `month` มีรูปแบบ "January 2024"
        const monthOrder = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const [monthA, yearA] = a.month.split(" ");
        const [monthB, yearB] = b.month.split(" ");

        // เรียงลำดับตามปีก่อน ถ้าปีเท่ากันให้เรียงตามเดือน
        return yearA !== yearB
            ? parseInt(yearA) - parseInt(yearB)
            : monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });

    const isPositiveTrend = defectTrend >= 0;

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
        <div>
            <CardContent className="h-[420px] mt-4">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={sortedChartData}
                        margin={{
                            left: -24,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="defect"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => translateMonth(value)} 
                            />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="defect"
                            type="natural"
                            fill="var(--color-defect)"
                            fillOpacity={0.4}
                            stroke="var(--color-defect)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold leading-none">
                    {d("Trending")}{isPositiveTrend ? d("Up") : d("Down")}
                    <span className={isPositiveTrend ? "text-destructive" : "text-green"}>
                        {defectTrend?.toFixed(2)}%
                    </span>{d("ThisMonth")}
                    {isPositiveTrend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="leading-none text-muted-foreground text-sm">
                    {d("DefectTrendAnalysisDescription")}
                </div>
            </CardFooter>
        </div>
    )
}
