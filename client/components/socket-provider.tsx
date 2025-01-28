/**
 * คำอธิบาย:
 *   คอมโพเนนต์ SocketProvider ใช้สำหรับเชื่อมต่อกับ Socket ของ Server และเก็บข้อมูลของ Socket ไว้ใน Context ของ React
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของ SocketProvider ที่ใช้สำหรับเชื่อมต่อกับ Socket ของ Server และเก็บข้อมูลของ Socket ไว้ใน Context ของ React
 * - ใช้ Hook ของ React ในการเชื่อมต่อกับ Socket ของ Server และเก็บข้อมูลของ Socket ไว้ใน Context ของ React
 **/

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIO, Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket"],
            secure: true
        })

        socketInstance.on("connect", () => {
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
