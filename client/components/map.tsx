'use client'
import { Zone } from '@/app/type';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';

const zones: Zone[] = [
  {
    "id": 1,
    "name": "R&D ROOM",
    "supervisor": {
      "userId": 1,
      "name": "Dr. Somchai Phonraksa",
      "email": null,
      "department": null,
      "age": 35,
      "tel": "1234567890",
      "address": "Bangkok, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 2,
    "name": "BALCONY",
    "supervisor": {
      "userId": 2,
      "name": "Mr. Suthipong Jantakorn",
      "email": null,
      "department": null,
      "age": 40,
      "tel": "9876543210",
      "address": "Chiang Mai, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 3,
    "name": "LIBRARY",
    "supervisor": {
      "userId": 3,
      "name": "Ms. Kanokwan Namsai",
      "email": null,
      "department": null,
      "age": 30,
      "tel": "4455667788",
      "address": "Korat, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 4,
    "name": "TOILET",
    "supervisor": {
      "userId": 4,
      "name": "Mr. Phiraphong Saengsiri",
      "email": null,
      "department": null,
      "age": 28,
      "tel": "1122334455",
      "address": "Phuket, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 5,
    "name": "IT Room",
    "supervisor": {
      "userId": 5,
      "name": "Ms. Supanida Thongchai",
      "email": null,
      "department": null,
      "age": 32,
      "tel": "6677889900",
      "address": "Pattaya, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 6,
    "name": "Customer Support",
    "supervisor": {
      "userId": 6,
      "name": "Mr. Somrak Chatchai",
      "email": null,
      "department": null,
      "age": 29,
      "tel": "5566778899",
      "address": "Hat Yai, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 7,
    "name": "SERVER ROOM",
    "supervisor": {
      "userId": 7,
      "name": "Mr. Phichai Meechai",
      "email": null,
      "department": null,
      "age": 35,
      "tel": "1122334455",
      "address": "Phuket, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 8,
    "name": "CONFERENCE ROOM",
    "supervisor": {
      "userId": 8,
      "name": "Ms. Waraporn Wongwattana",
      "email": null,
      "department": null,
      "age": 34,
      "tel": "9988776655",
      "address": "Phitsanulok, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 9,
    "name": "STORAGE ROOM",
    "supervisor": {
      "userId": 9,
      "name": "Mr. Sakchai Wannalai",
      "email": null,
      "department": null,
      "age": 33,
      "tel": "7788990011",
      "address": "Udon Thani, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 10,
    "name": "SAFETY STORAGE ROOM",
    "supervisor": {
      "userId": 10,
      "name": "Ms. Kanlayanee Namsin",
      "email": null,
      "department": null,
      "age": 36,
      "tel": "8899001122",
      "address": "Lampang, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 11,
    "name": "MANAGER OFFICE",
    "supervisor": {
      "userId": 11,
      "name": "Mr. Kittipong Thirapong",
      "email": null,
      "department": null,
      "age": 45,
      "tel": "2233445566",
      "address": "Bangkok, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 12,
    "name": "WAREHOUSE",
    "supervisor": {
      "userId": 12,
      "name": "Mr. Sombat Jintana",
      "email": null,
      "department": null,
      "age": 31,
      "tel": "9988221144",
      "address": "Rayong, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 13,
    "name": "TESTING LAB",
    "supervisor": {
      "userId": 13,
      "name": "Ms. Pattharakorn Sakorn",
      "email": null,
      "department": null,
      "age": 37,
      "tel": "8899665522",
      "address": "Chiang Rai, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 14,
    "name": "WORK STATION A",
    "supervisor": {
      "userId": 14,
      "name": "Mr. Jakkrit Mangkorn",
      "email": null,
      "department": null,
      "age": 27,
      "tel": "6655443322",
      "address": "Nakhon Ratchasima, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 15,
    "name": "WORK STATION B",
    "supervisor": {
      "userId": 15,
      "name": "Ms. Sasiwimol Chitchai",
      "email": null,
      "department": null,
      "age": 38,
      "tel": "5566778899",
      "address": "Surat Thani, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 16,
    "name": "WORK STATION C",
    "supervisor": {
      "userId": 16,
      "name": "Mr. Thanapon Yutthana",
      "email": null,
      "department": null,
      "age": 29,
      "tel": "6677889900",
      "address": "Trang, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 17,
    "name": "MEETING ROOM",
    "supervisor": {
      "userId": 17,
      "name": "Ms. Nattarika Srisuwan",
      "email": null,
      "department": null,
      "age": 32,
      "tel": "4433221100",
      "address": "Krabi, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 18,
    "name": "Electrical Room",
    "supervisor": {
      "userId": 18,
      "name": "Mr. Prasert Santichai",
      "email": null,
      "department": null,
      "age": 39,
      "tel": "9988776655",
      "address": "Nakhon Sawan, Thailand",
      "imagePath": null
    }
  },
  {
    "id": 19,
    "name": "Water Supply",
    "supervisor": {
      "userId": 19,
      "name": "Ms. Ratchanee Phuengrak",
      "email": null,
      "department": null,
      "age": 39,
      "tel": "9988776655",
      "address": "Nakhon Sawan, Thailand",
      "imagePath": null
    }
  }
]

const toKebabCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

const getZoneCoordinates = (id: number) => {
  switch (id) {
    case 1: // R&D ROOM
      return { x: 120, y: 30 };
    case 2: // BALCONY
      return { x: 120, y: 90 };
    case 3: // LIBRARY
      return { x: 120, y: 150 };
    case 4: // TOILET
      return { x: 50, y: 200 };
    case 5: // IT Room
      return { x: 200, y: 220 };
    case 6: // Customer Support
      return { x: 230, y: 220 };
    case 7: // SERVER ROOM
      return { x: 400, y: 50 };
    case 8: // CONFERENCE ROOM
      return { x: 300, y: 150 };
    case 9: // STORAGE ROOM
      return { x: 400, y: 150 };
    case 10: // SAFETY STORAGE ROOM
      return { x: 230, y: 300 };
    case 11: // MANAGER OFFICE
      return { x: 330, y: 300 };
    case 12: // WAREHOUSE
      return { x: 500, y: 300 };
    case 13: // TESTING LAB
      return { x: 600, y: 50 };
    case 14: // WORK STATION A
      return { x: 600, y: 100 };
    case 15: // WORK STATION B
      return { x: 600, y: 150 };
    case 16: // WORK STATION C
      return { x: 600, y: 200 };
    case 17: // MEETING ROOM
      return { x: 600, y: 250 };
    case 18: // Electrical Room
      return { x: 700, y: 300 };
    case 19: // Water Supply
      return { x: 300, y: 350 };
    default:
      return { x: 0, y: 0 }; // ค่าเริ่มต้น
  }
};


interface MapProps {
  onZoneSelect: (selectedZones: Zone[]) => void;
}

export default function Map({ onZoneSelect }: MapProps) {
  const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const [selectedZones, setSelectedZones] = useState<Zone[]>([]);
  const loadImages = (zoneName: string, active: number = 0) => {
    const img = new window.Image();
    const kebabName = toKebabCase(zoneName);
    img.src = `/assets/svg/${kebabName}-${active}.svg`;
    return img;
  };
  useEffect(() => {
    const loadedImages: { [key: string]: HTMLImageElement } = {};
    zones.forEach(zone => {
      loadedImages[zone.name] = loadImages(zone.name, 0);
    });
    setImages(loadedImages);
    console.log(loadedImages)
  }, []);


  const handleZoneClick = (zone: Zone) => {
    setSelectedZones(prevSelectedZones => {
      const isSelected = prevSelectedZones.find(selectedZone => selectedZone.id === zone.id);
      let updatedSelectedZones;
      if (isSelected) {
        updatedSelectedZones = prevSelectedZones.filter(selectedZone => selectedZone.id !== zone.id);
        setImages(prevImages => ({
          ...prevImages,
          [zone.name]: loadImages(zone.name, 0)
        }));
      } else {
        updatedSelectedZones = [...prevSelectedZones, zone];
        setImages(prevImages => ({
          ...prevImages,
          [zone.name]: loadImages(zone.name, 1) 
        }));
      }

      onZoneSelect(updatedSelectedZones);
      return updatedSelectedZones;
    });
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {zones.map((zone) => {
          const coordinates = getZoneCoordinates(zone.id);
          return (
            images[zone.name] && (
              <KonvaImage
                key={zone.id}
                image={images[zone.name]}
                x={coordinates.x}
                y={coordinates.y}
                onClick={() => handleZoneClick(zone)} 
              />
            )
          );
        })}
      </Layer>
    </Stage>
  );
}
