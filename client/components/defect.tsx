import React from 'react'
import BadgeCustom from './badge-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { defectStatus, IDefect } from '@/app/type'



export default function Defect({ defect }: { defect: IDefect }) {
    return (
        <div className="bg-card p-4 rounded-lg shadow-md border-l-8 border-green-500 cursor-pointer">
            <div className="flex items-center justify-between">
                <div className="flex items-center text-black-500 space-x-2">
                    <span className="material-symbols-outlined text-muted-foreground cursor-default ">schedule</span>
                    <span className="font-semibold text-small text-muted-foreground">{defect.timestamp}</span>
                </div>
                <div>
                    {(() => {
                        let iconName: string;
                        let status: string;
                        let variant:
                            | "green"
                            | "red"
                            | "yellow"
                            | "blue"
                            | "default"
                            | "purple"
                            | "secondary"
                            | "mint"
                            | "orange"
                            | "cyan"
                            | undefined;
                        switch (defect.status as defectStatus) {
                            case "resolved":
                                iconName = "cache";
                                variant = "blue";
                                status = defect.status;
                                break;
                            case "pending_review":
                                iconName = "pending_actions";
                                variant = "purple";
                                status = defect.status;
                                break;
                            case "completed":
                                iconName = "check";
                                variant = "green";
                                status = defect.status;
                                break;
                            case "in_progress":
                                iconName = "cache";
                                variant = "yellow";
                                status = defect.status;
                                break;
                            default:
                                iconName = "campaign";
                                variant = "mint";
                                status = defect.status;
                                break;
                        }
                        return (
                            <BadgeCustom
                                iconName={iconName}
                                showIcon={true}
                                showTime={false}
                                variant={variant}
                            >
                                {status}
                            </BadgeCustom>
                        );
                    })()}
                </div>
            </div>
            <div className="my-2">
                <BadgeCustom
                    width="w-32"
                    variant="cyan"
                    showIcon={false}
                    children="Safety"
                />
            </div>
            <div>
                <span className="font-bold text-2xl text-card-foreground">{defect.name}</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-foreground">person_alert</span>
                <span className="font-bold text-lg text-muted-foreground">Reporter</span>
                <div className="flex items-center ps-2 p-2">
                    <Avatar className="custom-shadow ms-[-10px] me-2.5">
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image.path}`}
                        />
                        <AvatarFallback>
                            {getInitials(defect.user.profile.name)}
                        </AvatarFallback>
                    </Avatar>
                    <p className="text-[20px]">{defect.user.profile.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-muted-foreground">location_on</span>
                    <span className="font-bold text-lg text-muted-foreground ml-2">Location</span>
                    <span className="text-card-foreground text-lg ml-4">Zone A</span>
                </div>
            </div>
        </div>
    )
}
