import React from 'react'
import BadgeCustom from './badge-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTime, getDefectStatusVariant, getInitials, getItemTypeVariant } from '@/lib/utils'
import { IDefect } from '@/app/type'
import { useTranslations } from 'next-intl'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


export default function Defect({ defect }: { defect: IDefect }) {
    const s = useTranslations("Status");

    return (
        <div>
            {(() => {
                const { iconName, variant } = getDefectStatusVariant(defect.status)
                let color;
                switch (variant) {
                    case "mint":
                        color = 'teal'
                        break;
                    case "blue":
                        color = 'blue'
                        break;
                    case "yellow":
                        color = 'yellow'
                        break;
                    case "orange":
                        color = 'orange'
                        break;
                    default:
                        color = 'green'
                        break;
                }
                return (
                    <div className={`bg-card p-4 rounded-lg shadow-md border-l-8 border-${color}-500 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-black-500 space-x-2">
                                <span className="material-symbols-outlined text-muted-foreground cursor-default ">schedule</span>
                                <span className="font-semibold text-lg text-muted-foreground">{formatTime(defect.timestamp)}</span>
                            </div>
                            <div>
                                <BadgeCustom
                                    iconName={iconName}
                                    showIcon={true}
                                    showTime={false}
                                    variant={variant}
                                >
                                    {s(defect.status)}
                                </BadgeCustom>
                            </div>
                        </div>
                        <div className="my-2">
                            {(() => {
                                const variant = getItemTypeVariant(defect.type)

                                return (
                                    <BadgeCustom
                                        showTime={false}
                                        variant={variant}
                                    >
                                        {s(defect.type)}
                                    </BadgeCustom>
                                );
                            })()}
                        </div>
                        <div>
                            <span className="font-bold text-2xl text-card-foreground">{defect.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground">person_alert</span>
                            <span className="font-bold text-lg text-muted-foreground">Reporter</span>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <div className="flex items-center ps-2 p-2">
                                        <Avatar className="custom-shadow ms-[-10px] me-2.5">
                                            <AvatarImage
                                                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                                            />
                                            <AvatarFallback>
                                                {getInitials(defect.user.profile.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-[20px]">{defect.user.profile.name}</p>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex flex-row gap-4">
                                        <Avatar>
                                            <Avatar>
                                                <AvatarImage
                                                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(defect.user.profile.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-semibold text-card-foreground">{defect.user.profile.name}</h4>
                                            <div className='flex flex-row gap-2'>
                                                <span className="material-symbols-outlined">
                                                    mail
                                                </span>
                                                <p className="text-card-foreground">
                                                    {defect.user.email}
                                                </p>
                                            </div>
                                            <div className='flex flex-row gap-2'>
                                                <span className="material-symbols-outlined">
                                                    call
                                                </span>
                                                <p className="text-card-foreground">
                                                    {defect.user.profile.tel}
                                                </p>
                                            </div>

                                            <div className="flex items-center pt-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Joined {formatTime(defect.user.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>

                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-between">
                                <span className="material-symbols-outlined text-muted-foreground">location_on</span>
                                <span className="font-bold text-lg text-muted-foreground ml-2">Location</span>
                                <span className="text-card-foreground text-lg ml-4">Zone A</span>
                            </div>
                        </div>
                    </div>

                );
            })()}
        </div>

    )
}
