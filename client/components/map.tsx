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
import { useEffect, useState } from 'react';
import { IZone, ILocation } from '@/app/type';
import { fetchData } from '@/lib/utils';
import zonePath from '@/lib/zonePath.json'
import zonePathSm from '@/lib/zonePath-sm.json'
import wallPath from '@/lib/wallPath.json'
import wallPathSm from '@/lib/wallPath-sm.json'
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';


interface IMap {
  onZoneSelect?: (selectedZones: IZone[]) => void;
  disable: boolean;
  initialSelectedZones?: number[];
  toggle?: boolean;
}

export default function Map({ onZoneSelect, disable, initialSelectedZones, toggle = false }: IMap) {
  const [location, setLocation] = useState<ILocation>();
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [zones, setZones] = useState<IZone[]>([]);
  const [walls, setWalls] = useState<{ id: number, pathData: string }[]>([])
  const [paths, setPaths] = useState<{ text: any, id: number, pathData: string }[]>([])
  const m = useTranslations('Map')
  const [stageDimensions, setStageDimensions] = useState({ width: 780, height: 518 });
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
  }, []);

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
    if (initialSelectedZones) {
      setSelectedZones(initialSelectedZones);
    }
  }, [initialSelectedZones]);

  const fetch = async () => {
    try {
      const data = await fetchData('get', '/location/1', true)
      setLocation(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetch()
    if (location) {
      const updatedZones = location.zones?.map(zone => {
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
    if (disable) return;

    let updatedSelectedZones;
    if (toggle) {
      // เลือกได้แค่โซนเดียว
      updatedSelectedZones = selectedZones.includes(zoneId) ? [] : [zoneId];
    } else {
      // เลือกหลายโซนได้
      const isSelected = selectedZones.includes(zoneId);
      updatedSelectedZones = isSelected
        ? selectedZones.filter(id => id !== zoneId)
        : [...selectedZones, zoneId];
    }

    setSelectedZones(updatedSelectedZones);

    const selectedZoneObjects = location?.zones.filter(zone => updatedSelectedZones.includes(zone.id)) || [];
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
    <Stage width={stageDimensions.width} height={stageDimensions.height} className='bg-card rounded-md'>
      <Layer x={8} y={8}>
        {zones?.map((zone) => {
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
                  text={m(zone.name)} // ข้อความที่จะแสดง
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
      <Layer x={8} y={8}>
        {walls.map((wall) => (
          <Path key={wall.id} data={wall.pathData} fill={getCSSVariableValue('--input')} />
        ))}
      </Layer>
    </Stage >
  );
}