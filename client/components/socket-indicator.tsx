"use client"

import BadgeCustom from "@/components/badge-custom"
import { useSocket } from "@/components/socket-provider"


export const SocketIndicator = () => {
    const { isConnected } = useSocket()

    if(!isConnected) {
        return (
            <BadgeCustom variant={'orange'}>
                Fallback: Polling every 1s
            </BadgeCustom>
        )
    }
    return (
        <BadgeCustom variant={'green'}>
             Live: Real-time updates
        </BadgeCustom>
    )
}