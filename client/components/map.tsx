'use client';
import { Stage, Layer, Rect, Path, Text } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { Zone, Location } from '@/app/type';
import { fetchData } from '@/lib/api';
import zonePath from '@/lib/zonePath.json'
import wallPath from '@/lib/wallPath.json'
import React from 'react';
import { useTranslations } from 'next-intl';

interface MapProps {
  onZoneSelect: (selectedZones: Zone[]) => void;
}

export default function Map({ onZoneSelect }: MapProps) {
  const [location, setLocation] = useState<Location>();
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [walls, setWalls] = useState<{ id: number, pathData: string }[]>([])
  const z = useTranslations('Zone')

  const fetch = async () => {
    try {
      const data = await fetchData('get', '/location/1', true)
      setLocation(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetch();
    setWalls(wallPath)

    if (location) {
      const updatedZones = location.zone.map(zone => {
        const matchedZonePath = zonePath.find(path => path.id === zone.id);
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
    const isSelected = selectedZones.includes(zoneId);

    let updatedSelectedZones;
    if (isSelected) {
      updatedSelectedZones = selectedZones.filter(id => id !== zoneId);
    } else {
      updatedSelectedZones = [...selectedZones, zoneId];
    }

    setSelectedZones(updatedSelectedZones);

    const selectedZoneObjects = location?.zone.filter(zone => updatedSelectedZones.includes(zone.id)) || [];
    onZoneSelect(selectedZoneObjects);
  };

  const calculatePoint = (textY: number | undefined) => {
    return (textY || 0) + 70; // ปรับค่าให้สัมพันธ์กับความสูงของ path แต่ละโซน
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
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {zones.map((zone, index) => {
          const isSelected = selectedZones.includes(zone.id);
          const startPointY = (zone.text?.y ? zone.text.y - 20 : 0);
          const endPointY = calculatePoint(startPointY);  // ใช้ฟังก์ชันคำนวณ end point
          return (
            <React.Fragment key={zone.id}>
              <Path
                data={zone.pathData}
                fillLinearGradientStartPoint={{ x: 0, y: startPointY }} // จุดเริ่มต้นของ gradient
                fillLinearGradientEndPoint={{ x: 0, y: endPointY }}    // จุดสิ้นสุดของ gradient
                fillLinearGradientColorStops={getGradientColors(isSelected)} // ใช้ gradient ที่กำหนด
                onClick={() => handleZoneSelect(zone.id)}
              />
              {zone.text && (
                <Text
                  x={zone.text.x} // ตำแหน่ง x
                  y={zone.text.y} // ตำแหน่ง y
                  text={z(zone.name)} // ข้อความที่จะแสดง
                  fontSize={zone.text.fontSize} // ขนาดฟอนต์
                  fontStyle="bold" // ทำให้ข้อความเป็นตัวหนา
                  fill={getTextColor(isSelected)} // สีของข้อความ ใช้ฟังก์ชัน getTextColor
                  rotation={zone.text.rotation} // การหมุนของข้อความ
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