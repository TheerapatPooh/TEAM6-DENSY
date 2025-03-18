/**
 * คำอธิบาย:
 *   คอมโพเนนต์ BadgeCustom ใช้สำหรับแสดงข้อความที่มีสีพื้นหลังและสีตัวอักษรต่างๆ ตามที่กำหนด
 * Input: 
 * - variant: สีพื้นหลังและสีตัวอักษรของ Badge ที่กำหนดไว้ใน badgeVariants
 * Output:
 * - JSX ของ Badge ที่มีสีพื้นหลังและสีตัวอักษรตามที่กำหนด
**/

import { Badge } from '@/components/ui/badge'
import { cn } from "@/lib/utils"

interface IBadgeCustom {
    variant?: keyof typeof badgeVariants,
    shape?: keyof typeof shapeVariants,
    iconName?: string,
    showIcon?: boolean,
    timeStamp?: string,
    showTime?: boolean,
    className?: string,
    width?: string,
    height?: string,
    hideText?: boolean,
    children?: React.ReactNode
}

export const shapeVariants = {
    default: "rounded-full",
    square: "rounded-md",
}

export const badgeVariants = {
    default: "bg-accent-gradient text-card hover:bg-accent-gradient-hover",
    secondary: "bg-secondary text-muted-foreground hover:bg-secondary/50",
    mint: "bg-mint/20 text-mint hover:bg-mint/10",
    blue: "bg-primary/20 text-primary hover:bg-primary/10",
    yellow: "bg-yellow/20 text-yellow hover:bg-yellow/10",
    red: "bg-destructive/20 text-destructive hover:bg-destructive/10",
    orange: "bg-orange/20 text-orange hover:bg-orange/10",
    purple: "bg-purple/20 text-purple hover:bg-purple/10",
    green: "bg-green/20 text-green hover:bg-green/10",
}

export default function BadgeCustom({
    variant = 'default',
    shape: shapeProp = 'default',
    iconName,
    showIcon = false,
    timeStamp,
    showTime = false,
    width,
    hideText = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children
}: IBadgeCustom) {
    const badgeClass = badgeVariants[variant] || badgeVariants.default;
    const shape = shapeVariants[shapeProp] || shapeVariants.default

    return (
        <Badge className={cn(
            `${badgeClass} ${shape} cursor-pointer align-center custom-shadow ${hideText ? 'aspect-square w-9 h-9' : 'h-[30px] py-4'}`,
            width ? width : ("w-fit"),
            showTime ? "justify-between" : showIcon ? "justify-center" : "justify-center"
        )}>
            <div className='flex gap-2 items-center'>
                {showIcon && iconName && (
                    <span className="material-symbols-outlined">
                        {iconName}
                    </span>
                )}
                {!hideText && (  
                    <span className='text-base font-semibold w-full text-center'>{children}</span>
                )}
            </div>
            {showTime && (
                <span className="text-base font-normal">
                    {timeStamp}
                </span>
            )}
        </Badge>
    )
}
