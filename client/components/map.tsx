'use client';
import { Stage, Layer, Path, Text } from 'react-konva';
import { useEffect, useState } from 'react';
import { IZone, ILocation } from '@/app/type';
import { fetchData } from '@/lib/api';
import zonePath from '@/lib/zonePath.json'
import zonePathMd from '@/lib/zonePath-md.json'
import zonePathSm from '@/lib/zonePath-sm.json'
import wallPath from '@/lib/wallPath.json'
import wallPathMd from '@/lib/wallPath-md.json'
import wallPathSm from '@/lib/wallPath-sm.json'
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';


interface MapProps {
  onZoneSelect?: (selectedZones: IZone[]) => void;
  disable: boolean;
  initialSelectedZones?: number[];
}

export default function Map({ onZoneSelect, disable, initialSelectedZones }: MapProps) {
  const [location, setLocation] = useState<ILocation>();
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [zones, setZones] = useState<IZone[]>([]);
  const [walls, setWalls] = useState<{ id: number, pathData: string }[]>([])
  const [paths, setPaths] = useState<{ text: any, id: number, pathData: string }[]>([])
  const z = useTranslations('Zone')
  const [stageDimensions, setStageDimensions] = useState({ width: 1350, height: 895, size: "LG"});
  const locale = useLocale(); 
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = locale; // ภาษาที่ใช้อยู่ในปัจจุบัน
    setLanguage(currentLanguage || 'en');
  }, []);

  const responsiveStage = () => {
    const screenWidth = window.innerWidth; // ความกว้างของหน้าจอปัจจุบัน
    
    if (screenWidth <= 800) { // ความกว้างของหน้าจอสำหรับจอมือถือ
      setStageDimensions({ width: 800, height: 600, size: "SM" });
    } else if (screenWidth <= 1024) { // ความกว้างของหน้าจอสำหรับจอไอแพต
      setStageDimensions({ width: 800, height: 600, size: "MD" });
    } else { // ความกว้างของหน้าจอสำหรับจอคอมพิวเตอร์
      setStageDimensions({ width: 1350, height: 895, size: "LG" });
    }
  };

  useEffect(() => {
    const handleResize = () => responsiveStage();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (disable && initialSelectedZones) {
      setSelectedZones(initialSelectedZones);
    }
  }, [disable, initialSelectedZones]);

  const fetch = async () => {
    try {
      const data = await fetchData('get', '/location/1', true)
      setLocation(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetch()
    if (stageDimensions.size === "SM") {
      setWalls(wallPath)
      setPaths(zonePath) 
    } else if (stageDimensions.size === "MD") {
      setWalls(wallPath)
      setPaths(zonePath) 
    } else {
      setWalls(wallPath)
      setPaths(zonePath) 
    }

    if (location) {
      const updatedZones = location.zone.map(zone => {
        const matchedZonePath = paths.find(path => path.id === zone.id);
        return {
          ...zone,
          pathData: matchedZonePath ? matchedZonePath.pathData : '',
          text: matchedZonePath ? matchedZonePath.text : null
        };
      });

      setZones(updatedZones);
    }
  }, [location]);

  const getGradientColors = (isSelected: boolean): (string | number)[] => {
    if (isSelected) {
      return [
        0, '#C16975', // สีเริ่มต้น (บนสุด) จาก accent-gradient
        1, '#FB0023', // สีสิ้นสุด (ล่างสุด) จาก accent-gradient
      ];
    } else {
      const secondaryColor = getCSSVariableValue('--secondary') || '#DCE2EC'; // ดึงสี secondary จาก CSS variables หรือใช้ fallback
      return [
        0, secondaryColor, // สีเมื่อไม่ได้เลือกใช้ secondary
        1, secondaryColor
      ];
    }
  }


  const handleZoneSelect = (zoneId: number) => {
    if (disable) return; // ถ้า disable เป็น true ห้ามเลือกโซนใหม่

    const isSelected = selectedZones.includes(zoneId);

    let updatedSelectedZones;
    if (isSelected) {
      updatedSelectedZones = selectedZones.filter(id => id !== zoneId);
    } else {
      updatedSelectedZones = [...selectedZones, zoneId];
    }

    setSelectedZones(updatedSelectedZones);

    const selectedZoneObjects = location?.zone.filter(zone => updatedSelectedZones.includes(zone.id)) || [];

    // ตรวจสอบว่า onZoneSelect ไม่เป็น undefined ก่อนเรียกใช้งาน
    if (onZoneSelect) {
      onZoneSelect(selectedZoneObjects);
    }
  };


  const calculatePoint = (textY: number | undefined) => {
    return (textY || 0) + 200; // ปรับค่าให้สัมพันธ์กับความสูงของ path แต่ละโซน
  }

  const getCSSVariableValue = (variableName: string) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

    if (value && value.match(/^(\d+\s*\d+%?\s*\d+%?)$/)) {
      return `hsl(${value})`;
    }
  };

  const getTextColor = (isSelected: boolean) => {
    if (isSelected) {
      return getCSSVariableValue('--card');
    } else {
      return getCSSVariableValue('--card-foreground');
    }
  };

  if (!location) {
    return (
      <p>Loading...</p>
    )
  }

  return (
      <Stage width={stageDimensions.width} height={stageDimensions.height}>
        <Layer>
          {zones.map((zone, index) => {
            const isSelected = selectedZones.includes(zone.id);
            const textLanguage = zone.text?.[language] || zone.text?.['en']; // ใช้สำหรับเก็บค่าตัวแปร text ของภาษาที่ใช้ในปัจจุบัน
            const startPointY = textLanguage?.y ? textLanguage.y - 80 : 0;
            const endPointY = calculatePoint(startPointY); // ใช้ฟังก์ชันคำนวณ end point
            return (
              <React.Fragment key={zone.id}>
                <Path
                  data={zone.pathData}
                  fillLinearGradientStartPoint={{ x: 0, y: startPointY }} // จุดเริ่มต้นของ gradient
                  fillLinearGradientEndPoint={{ x: 0, y: endPointY }} // จุดสิ้นสุดของ gradient
                  fillLinearGradientColorStops={getGradientColors(isSelected)} // ใช้ gradient ที่กำหนด
                  onClick={() => handleZoneSelect(zone.id)}
                />
                {textLanguage && (
                  <Text
                    x={textLanguage.x} // ตำแหน่ง x
                    y={textLanguage.y} // ตำแหน่ง y
                    text={z(zone.name)} // ข้อความที่จะแสดง
                    fontSize={textLanguage.fontSize} // ขนาดฟอนต์
                    fontStyle="bold" // ทำให้ข้อความเป็นตัวหนา
                    fill={getTextColor(isSelected)} // สีของข้อความ ใช้ฟังก์ชัน getTextColor
                    rotation={textLanguage.rotation} // การหมุนของข้อความ
                    align="center"
                  />
                )}
              </React.Fragment>
            );
          })}
        </Layer>
        <Layer>
          {walls.map((wall) => (
            <Path key={wall.id} data={wall.pathData} fill={getCSSVariableValue('--input')} />
          ))}
        </Layer>
      </Stage>
  );
}