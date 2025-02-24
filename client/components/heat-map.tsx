/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Map ใช้สำหรับแสดงแผนที่ของโซนต่างๆ ในสถานที่
 * Input: 
 * - onZoneSelect: ฟังก์ชันที่ใช้สำหรับเลือกโซนที่ต้องการ
 * - disable: สถานะที่ใช้สำหรับปิดการใช้งานคอมโพเนนต์
 * - initialSelectedZones: รายการโซนที่ต้องการเลือกในครั้งแรก
 * - toggle: สถานะที่ใช้สำหรับเปิดหรือปิดการเลือกโซนหลายโซน
 * Output:
 * - JSX ของแผนที่ที่แสดงโซนต่างๆ ในสถานที่
 **/

'use client';
import { Stage, Layer, Path, Text } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { IZone, IHeatMap } from '@/app/type';
import zonePath from '@/lib/zonePath.json'
import zonePathSm from '@/lib/zonePath-sm.json'
import wallPath from '@/lib/wallPath.json'
import wallPathSm from '@/lib/wallPath-sm.json'
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import NotFound from '@/components/not-found';
import Loading from '@/components/loading';
import { zoneCriteria } from '@/constants/zone-criteria';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function HeatMap({ data }: IHeatMap) {
    const stageRef = useRef(null);  // เพิ่ม useRef สำหรับ Stage
    const [stageDimensions, setStageDimensions] = useState({ width: 780, height: 518 });
    const [zones, setZones] = useState<IZone[]>([]);
    const [walls, setWalls] = useState<{ id: number, pathData: string }[]>([])
    const [paths, setPaths] = useState<{ text: any, id: number, pathData: string, defects?: number }[]>([])
    const { resolvedTheme } = useTheme();
    const router = useRouter()
    const s = useTranslations('Sidebar')
    const m = useTranslations('Map')
    const d = useTranslations('Dashboard')
    const locale = useLocale();
    const [language, setLanguage] = useState('en');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // ฟังก์ชันที่ใช้เพื่ออัพเดตความกว้างหน้าจอ
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // เพิ่ม event listener สำหรับ resize
        window.addEventListener('resize', handleResize);

        // ลบ event listener เมื่อคอมโพเนนต์ถูกทำลาย
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const currentLanguage = locale; // ภาษาที่ใช้อยู่ในปัจจุบัน
        setLanguage(currentLanguage || 'en');
    }, [locale]);

    useEffect(() => {
        if (windowWidth <= 1280) { // ความกว้างของหน้าจอสำหรับจอมือถือ
            setStageDimensions({ width: 483, height: 323 });
            setWalls(wallPathSm)
            setPaths(zonePathSm)
        } else { // ความกว้างของหน้าจอสำหรับจอคอมพิวเตอร์
            setStageDimensions({ width: 780, height: 518 });
            setWalls(wallPath)
            setPaths(zonePath)
        }
    }, [windowWidth])

    useEffect(() => {
        if (data) {
            const updatedZones = data?.map((zone) => {
                const matchedZonePath = paths.find(path => path.id === zone.id);
                return {
                    ...zone,
                    pathData: matchedZonePath ? matchedZonePath.pathData : '',
                    text: matchedZonePath ? matchedZonePath.text : null,
                    defects: zone.defects
                };
            });

            setZones(updatedZones);
        }
    }, [data, resolvedTheme, paths]);

    const getCSSVariableValue = (variableName: string) => {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();

        if (value && value.match(/^(\d+\s*\d+%?\s*\d+%?)$/)) {
            return `hsl(${value})`;
        }
    };

    const getZoneColor = (defects: number): string => {
        if (defects < 10) {
            return getCSSVariableValue('--secondary');
        }

        const matchedCriteria = zoneCriteria.find(criteria => defects >= criteria.defects);
        return matchedCriteria ? matchedCriteria.color : '#DCE2EC'; // ถ้าไม่พบ criteria, ใช้สี fallback
    };

    const warningAreas = zones.some(zone => zone.defects > 0)
        ? zones.sort((a, b) => b.defects - a.defects).slice(0, 5)
        : [];
    const getTextColor = (defects: number) => {
        if (defects < 10) {
            return getCSSVariableValue('--card-foreground');
        }
        return defects > 50 ? "#F5F7FA" : "#333840";
    };

    useEffect(() => {
        if (stageRef.current) {
            stageRef.current.batchDraw();
        }
    }, [zones]);

    const handleZoneClick = (zoneId: number) => {
        router.push(`/${locale}/admin/dashboard/heat-map/${zoneId}`)
    };


    if (!data) {
        return <Loading />
    }

    return (
        <div className='flex flex-col xl:flex-row justify-between items-center w-full pt-4 gap-4'>
            {/* Defect */}
            <div className='flex flex-row items-center xl:flex-col xl:items-start gap-2'>
                <h1 className='text-2xl text-card-foreground font-bold pb-8 xl:p-0'>{s("Defect")}</h1>
                <div className='flex xl:flex-col '>
                    {zoneCriteria.map((criteria, index) => (
                        <div key={index} className='flex flex-col xl:flex-row items-center justify-between'>
                            <span
                                className={`w-12 h-12 ${index === 0 ? 'rounded-s-md xl:rounded-b-none xl:rounded-t-md' : ''} ${index === zoneCriteria.length - 1 ? 'rounded-e-md xl:rounded-b-md xl:rounded-t-none' : ''}`}
                                style={{
                                    backgroundColor: index === zoneCriteria.length - 1
                                        ? getCSSVariableValue('--secondary')
                                        : criteria.color
                                }}
                            ></span>
                            <p className='text-xl text-card-foreground font-semibold text-center'>{criteria.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* HeatMap */}
            <Stage ref={stageRef} width={stageDimensions.width} height={stageDimensions.height} className='bg-card rounded-md hover:cursor-pointer'>
                <Layer x={8} y={8}>
                    {zones?.map((zone) => {
                        const textLanguage = zone.text?.[language] || zone.text?.['en']; // ใช้สำหรับเก็บค่าตัวแปร text ของภาษาที่ใช้ในปัจจุบัน
                        const defectCount = zone.defects; // จำนวน defects ในแต่ละโซน

                        return (
                            <React.Fragment key={zone.id}>
                                <Path
                                    data={zone.pathData}
                                    onClick={() => handleZoneClick(zone.id)}
                                    fill={getZoneColor(defectCount)} // ใช้ gradient ที่กำหนด
                                />
                                {textLanguage && (
                                    <Text
                                        x={textLanguage.x} // ตำแหน่ง x
                                        y={textLanguage.y} // ตำแหน่ง y
                                        text={m(zone.name)} // ข้อความที่จะแสดง
                                        fontSize={textLanguage.fontSize} // ขนาดฟอนต์
                                        fontStyle="bold" // ทำให้ข้อความเป็นตัวหนา
                                        fill={getTextColor(defectCount)} // สีของข้อความ ใช้ฟังก์ชัน getTextColor
                                        rotation={textLanguage.rotation} // การหมุนของข้อความ
                                        align="center"
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Layer>
                <Layer x={8} y={8}>
                    {walls.map((wall) => (
                        <Path key={wall.id} data={wall.pathData} fill={getCSSVariableValue('--input')} />
                    ))}
                </Layer>
            </Stage >
            {/* WarningAreas */}
            <div className='flex flex-col justify-center w-full xl:w-auto  gap-4 min-h-[274px] min-w-[185px]'>
                <h1 className='text-2xl text-card-foreground font-bold'>{d("WarningAreas")}</h1>
                <div className='flex flex-col gap-4'>
                    {warningAreas.length > 0 ? (
                        warningAreas.map((zone, index) => (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div key={index} className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'>
                                            <span
                                                className={`w-8 h-8 rounded-md`}
                                                style={{ backgroundColor: getZoneColor(zone.defects) }}
                                            ></span>
                                            <p className='text-base text-card-foreground font-semibold text-center'>{m(zone.name)}</p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-card-foreground px-2.5 py-1.5 custom-shadow rounded-md w-56">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex items-center gap-2 text-sm font-medium text-border">
                                                    <span
                                                        className="inline-block w-2.5 h-2.5 rounded-[2px]"
                                                        style={{ backgroundColor: getZoneColor(zone.defects) }} // ใช้สีของโซน
                                                    />
                                                    <p>{m(zone.name)}</p>
                                                </div>
                                                <p className="text-sm text-card">{zone.defects}</p>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64">
                            <NotFound
                                icon="monitoring"
                                title="NoDataAvailable"
                                description="NoDataAvailableDescription"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}