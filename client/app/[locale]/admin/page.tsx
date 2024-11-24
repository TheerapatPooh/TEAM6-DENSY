'use client'
import { IZone } from '@/app/type';
import dynamic from 'next/dynamic';
import React from 'react'
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function page() {
  const handleZoneSelect = (selectedZones: IZone[]) => {
    console.log('Selected Zones:', selectedZones);
  };
  return (
    <div className="flex mt-2 justify-center">
        <Map initialSelectedZones={[1,3,4]}  disable={true}/>
    </div>
  )
}
