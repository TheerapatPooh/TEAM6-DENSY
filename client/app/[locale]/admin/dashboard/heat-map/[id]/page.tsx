'use client'
import { IZone } from '@/app/type'
import DashboardCard from '@/components/dashboard-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchData, getInitials, getMonthRange, monthOptions } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("AllTime");
  const [zone, setZone] = useState<IZone>();

  const t = useTranslations('General')
  const m = useTranslations('Month')
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()

  const getData = async () => {
    const { startDate, endDate } = getMonthRange(selectedMonth);
    const queryParams: Record<string, string | undefined> = {};

    if (startDate) queryParams.startDate = startDate.toISOString();
    if (endDate) queryParams.endDate = endDate.toISOString();

    const queryString = new URLSearchParams(queryParams).toString()
    const zone = await fetchData("get", `/zone/${params.id}?dashboard=true&${queryString}`, true);

    // fetch data
    setZone(zone);
  };

  useEffect(() => {
    getData();
    setMounted(true);
  }, []);

  useEffect(() => {
    getData();
  }, [selectedMonth]);

  if (!mounted || !zone)
    return null;
  console.log(zone)

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between w-full'>
        <h1 className='text-2xl font-bold text-card-foreground'>Zone</h1>
        <Button variant='secondary' onClick={() => router.push(`/${locale}/admin/dashboard/heat-map`)}>Back</Button>
      </div>
      <div className='flex justify-between items-center'>
        <div className="flex items-center gap-2 mb-2 mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="material-symbols-outlined">person_search</span>
            <p className="text-lg font-semibold">{t("supervisor")}</p>
          </div>
          <div className="flex items-center gap-1">
            <Avatar className="custom-shadow h-[35px] w-[35px]">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${zone.supervisor.profile?.image?.path}`}
              />
              <AvatarFallback id={zone.supervisor.id.toString()}>
                {getInitials(zone.supervisor.profile?.name)}
              </AvatarFallback>
            </Avatar>

            <p className="text-card-foreground text-lg">{zone.supervisor.profile?.name}</p>
          </div>
        </div>
        <div className="w-48">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {`${m(month.split(" ")[0])} ${month.split(" ")[1] || ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex gap-4 w-full'>
        <DashboardCard
          title="TotalComments"
          value={zone.dashboard.totalComments.value}
          trend={zone.dashboard.totalComments.trend}
          icon="campaign"
          iconColor="orange"
          positive={false}
        />
        <DashboardCard
          title="DefectCompleted"
          value={zone.dashboard.defectCompleted.value}
          trend={zone.dashboard.defectCompleted.trend}
          icon="verified"
          iconColor="green"
          positive={true}
        />
        <DashboardCard
          title="DefectPending"
          value={zone.dashboard.defectPending.value}
          trend={zone.dashboard.defectPending.trend}
          icon="hourglass_top"
          iconColor="yellow"
          positive={false}
        />
      </div>
    </div>
  )
}
