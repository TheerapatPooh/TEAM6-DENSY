import React from 'react'
import { IDashboardCard } from '@/app/type'
import { useTranslations } from 'next-intl';

export default function DashboardCard({ title, value, trend, icon, iconColor, positive = true }: IDashboardCard) {
  const trendColor = trend === 0
    ? 'text-green'
    : positive
      ? (trend > 0 ? 'text-green' : 'text-destructive') 
      : (trend > 0 ? 'text-destructive' : 'text-green'); 
  const d = useTranslations('Dashboard')
  return (
    <div className='flex flex-col w-full gap-4 bg-card px-6 py-4 rounded-md custom-shadow'>
      <div className='flex flex-row justify-between'>
        <p className='text-xl'>{d(title)}</p>
        <div className={`flex items-center justify-center bg-${iconColor}/20 rounded-full h-9 w-9`}>
          <span className={`flex justify-center items-center material-symbols-outlined text-${iconColor} w-[22px] h-[22px]`}>
            {icon}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-2xl font-bold'>{value}</p>
        <p className={`text-sm font-medium ${trendColor}`}>{trend}% from last month</p>      </div>
    </div>
  )
}
