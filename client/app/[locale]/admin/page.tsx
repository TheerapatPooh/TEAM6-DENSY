'use client'
import { Zone } from '@/app/type';
import dynamic from 'next/dynamic';
import React from 'react'
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function page() {
  const handleZoneSelect = (selectedZones: Zone[]) => {
    console.log('Selected Zones:', selectedZones);
  };
  return (
    <div className='flex w-full h-screen justify-center items-center'>
        <Map  onZoneSelect={handleZoneSelect}/>
    </div>
  )
}
