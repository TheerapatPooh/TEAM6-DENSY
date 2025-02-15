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
import zonePathMd from '@/lib/zonePath-md.json'
import zonePathSm from '@/lib/zonePath-sm.json'
import wallPath from '@/lib/wallPath.json'
import wallPathMd from '@/lib/wallPath-md.json'
import wallPathSm from '@/lib/wallPath-sm.json'
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import NotFound from '@/components/not-found';

const zoneCriteria = [
    { defects: 75, label: "> 75", color: '#400000' },
    { defects: 65, label: "> 65", color: '#800000' },
    { defects: 55, label: "> 55", color: '#BF0000' },
    { defects: 45, label: "> 45", color: '#FF0000' },
    { defects: 35, label: "> 35", color: '#FF4040' },
    { defects: 25, label: "> 25", color: '#FF8080' },
    { defects: 10, label: "> 10", color: '#FFBFBF' },
    { defects: 0, label: "0", color: '#DCE2EC' }
];

export default function HeatMap({ data }: IHeatMap) {
    const stageRef = useRef(null);  // เพิ่ม useRef สำหรับ Stage
    const [stageDimensions, setStageDimensions] = useState({ width: 780, height: 518, size: "LG" });
    const [zones, setZones] = useState<IZone[]>([]);
    const [walls, setWalls] = useState<{ id: number, pathData: string }[]>([])
    const [paths, setPaths] = useState<{ text: any, id: number, pathData: string, defects?: number }[]>([])

    const s = useTranslations('Sidebar')
    const m = useTranslations('Map')
    const d = useTranslations('Dashboard')
    const locale = useLocale();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const currentLanguage = locale; // ภาษาที่ใช้อยู่ในปัจจุบัน
        setLanguage(currentLanguage || 'en');
    }, []);


    useEffect(() => {
        setWalls(wallPath)
        setPaths(zonePath)

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
    }, [data]);

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

    if (!data) {
        return (
            <p>Loading...</p>
        )
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
            <Stage ref={stageRef} width={stageDimensions.width} height={stageDimensions.height} className='bg-card rounded-md'>
                <Layer x={8} y={8}>
                    {zones?.map((zone) => {
                        const textLanguage = zone.text?.[language] || zone.text?.['en']; // ใช้สำหรับเก็บค่าตัวแปร text ของภาษาที่ใช้ในปัจจุบัน
                        const defectCount = zone.defects; // จำนวน defects ในแต่ละโซน

                        return (
                            <React.Fragment key={zone.id}>
                                <Path
                                    data={zone.pathData}
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
                            <div key={index} className='flex flex-row items-center justify-start gap-2'>
                                <span
                                    className={`w-8 h-8 rounded-md`}
                                    style={{ backgroundColor: getZoneColor(zone.defects) }}
                                ></span>
                                <p className='text-base text-card-foreground font-semibold text-center'>{m(zone.name)}</p>
                            </div>
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