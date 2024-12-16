'use client'
// import { IZone } from '@/app/type';
import dynamic from 'next/dynamic';
import React from 'react'
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function page() {
  return (
    <div className="flex mt-2 justify-center">
        <Map disable={false}/>
    </div>
  )
}
