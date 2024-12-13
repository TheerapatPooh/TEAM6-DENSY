import { Badge } from '@/components/ui/badge'
import { cn } from "@/lib/utils"

interface BadgeCustomProps {
    variant?: keyof typeof badgeVariants,
    iconName?: string,
    showIcon?: boolean,
    timeStamp?: string,
    showTime?: boolean,
    className?: string, 
    width?: string,
    height?: string,
    children?: React.ReactNode
}

export const badgeVariants = {
    default: "bg-accent-gradient text-card hover:bg-accent-gradient-hover",
    secondary: "bg-secondary text-muted-foreground hover:bg-secondary/50",
    mint: "bg-mint/20 text-mint hover:bg-mint/10",
    blue: "bg-primary/20 text-primary hover:bg-primary/10",
    yellow: "bg-yellow/20 text-yellow hover:bg-yellow/10",
    red: "bg-desctructive/20 text-desctructive hover:bg-desctructive/10",
    orange: "bg-orange/20 text-orange hover:bg-orange/10",
    purple: "bg-purple/20 text-purple hover:bg-purple/10",
    green: "bg-green/20 text-green hover:bg-green/10",
}

export default function BadgeCustom({
    variant = 'default',
    iconName,
    showIcon = false,
    timeStamp,
    showTime = false,
    width,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    height, 
    children
}: BadgeCustomProps) {
    const badgeClass = badgeVariants[variant] || badgeVariants.default;

    return (
        <Badge className={cn(
            `${badgeClass} cursor-pointer align-center h-[30px] py-4`,
            width ? width : ("w-[180px]"),
            showTime ? "justify-between" : showIcon ? "justify-between" : "justify-center" 
        )}>
            <div className='flex gap-2 items-center justify-between w-full'>
                {showIcon && iconName && (
                    <span className="material-symbols-outlined text-[22px]">
                        {iconName}
                    </span>
                )}
                <span className='text-base font-semibold w-full text-center'>{children}</span>
            </div>
            {showTime && (
                <span className="text-base font-normal">
                    {timeStamp}
                </span>
            )}
        </Badge>
    )
}
