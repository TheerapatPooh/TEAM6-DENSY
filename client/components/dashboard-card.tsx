import React from 'react'
import { IDashboardCard } from '@/app/type'
import { useTranslations } from 'next-intl';
import BadgeCustom from '@/components/badge-custom';

export default function DashboardCard({ title, value, trend, icon, variant, positive = true }: IDashboardCard) {
  const trendColor = trend === 0
    ? 'text-green'
    : positive
      ? (trend > 0 ? 'text-green' : 'text-destructive')
      : (trend > 0 ? 'text-destructive' : 'text-green');
  const d = useTranslations('Dashboard')
  return (
    <div className='flex flex-col w-full gap-4 bg-card px-6 py-4 rounded-md custom-shadow'>
      <div className='flex flex-row items-center justify-between truncate'>
        <p className='text-xl truncate w-full'>{d(title)}</p>
        <BadgeCustom
          variant={variant}
          iconName={icon}
          showIcon={true}
          hideText={true}
        />
      </div>
      <div className='flex flex-col gap-1 text-2xl font-bold'>
        {trend && (
          <div>
            <p className=''>{value}</p>
            <p className={`text-sm font-medium ${trendColor}`}>{trend}% from last month</p>
          </div>
        )}
      </div>
    </div>
  )
}
