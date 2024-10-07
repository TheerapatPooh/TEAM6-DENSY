import { Badge } from './ui/badge'
import { cn } from "@/lib/utils"

interface BadgeCustomProps {
    variant?: keyof typeof badgeVariants,
    iconName?: string,
    showIcon?: boolean,
    timeStamp?: string,
    showTime?: boolean,
    className?: string, 
    width?: string,
    children?: React.ReactNode
}

export const badgeVariants = {
    default: "bg-accent-gradient text-card hover:bg-accent-gradient-hover",
    secondary: "bg-secondary text-muted-foreground hover:bg-secondary/50",
    mint: "bg-teal-300/40 text-teal-500 hover:bg-teal-300/20",
    blue: "bg-blue-300/40 text-blue-500 hover:bg-blue-300/20",
    yellow: "bg-yellow-300/40 text-yellow-500 hover:bg-yellow-300/20",
    red: "bg-red-300/40 text-red-500 hover:bg-red-300/20",
    orange: "bg-orange-300/40 text-orange-500 hover:bg-orange-300/20",
    purple: "bg-purple-300/40 text-purple-500 hover:bg-purple-300/20",
    cyan: "bg-cyan-300/40 text-cyan-500 hover:bg-cyan-300/20",
    green: "bg-green-300/40 text-green-500 hover:bg-green-300/20",
}

export default function BadgeCustom({
    variant = 'default',
    iconName,
    showIcon = false,
    timeStamp,
    showTime = false,
    width, 
    children
}: BadgeCustomProps) {
    const badgeClass = badgeVariants[variant] || badgeVariants.default;
   
    return (
        <Badge className={cn(
            `${badgeClass} cursor-pointer align-center justify-between gap-2 h-[30px] p-2`,
            width ? width : (showTime ? "w-[180px]" : "w-[150px]"),
        )}>
            <div className='flex gap-2 items-center'>
                {showIcon && iconName && (
                    <span className="material-symbols-outlined text-[22px]">
                        {iconName}
                    </span>
                )}
                <span className='text-base font-medium'>{children}</span>
            </div>
            {showTime && (
                <span className="text-base font-normal">
                    {timeStamp}
                </span>
            )}
        </Badge>
    )
}
