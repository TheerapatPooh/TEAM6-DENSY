/**
 * คำอธิบาย:
 *   คอมโพเนนต์ SocketIndicator ใช้สำหรับแสดงสถานะการเชื่อมต่อกับ Socket ว่าเป็นการเชื่อมต่อแบบ Real-time หรือ Polling
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของ SocketIndicator ที่แสดงสถานะการเชื่อมต่อกับ Socket ว่าเป็นการเชื่อมต่อแบบ Real-time หรือ Polling
 * - ถ้าเชื่อมต่อแบบ Real-time จะแสดง Badge สีเขียว และข้อความ "Live: Real-time updates"
 * - ถ้าเชื่อมต่อแบบ Polling จะแสดง Badge สีส้ม และข้อความ "Fallback: Polling every 1s"
 **/

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