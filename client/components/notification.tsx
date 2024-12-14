'use client'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { INotification, notificationType, IUser } from '@/app/type'
import { fetchData } from '@/lib/utils'
import { useSocket } from '@/components/socket-provider'
import BadgeCustom from '@/components/badge-custom'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'


export default function Notification() {
    const t = useTranslations('General'); // ฟังก์ชันแปลข้อความจาก 'General'
    const s = useTranslations("Status");
    const d = useTranslations('DateTime');
    const n = useTranslations('Notification');

    const locale = useLocale()
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [user, setUser] = useState<IUser>()
    const { socket, isConnected } = useSocket()
    const router = useRouter()

    const unreadCount = notifications.filter(notification => !notification.read).length;

    function formatMessage(message: string) {
        const [key, ...dynamicParts] = message.split('-');
        const dynamicData = dynamicParts.join('-');
        return { key, dynamicData };
    }


    const fetchNotifications = async () => {
        try {
            const data = await fetchData("get", "/notifications", true);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const data = await fetchData("get", "/user", true);
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    const updateNotification = async (id: number) => {
        try {
            await fetchData("put", `/notification/${id}`, true);
        } catch (error) {
            console.error("Failed to update notification:", error);
        }
    };

    const handleNotificationClick = (notification: INotification) => {
        if (!notification.read) {
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
            updateNotification(notification.id); // ถ้ายังไม่ได้อ่านให้ update สถานะ
        }
        if (notification.url) {
            router.push(`/${locale}/${notification.url}`); // ถ้ามี URL ให้ redirect ไป
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetchData("put", "/notifications/mark-all-read", true); // เรียก API ที่สร้างใน Backend
            setNotifications(prevNotifications =>
                prevNotifications.map(n => ({ ...n, read: true }))
            );
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    const getRecentNotifications = () => {
        // แบ่งแจ้งเตือนเป็น 2 กลุ่ม: ที่ยังไม่ได้อ่านและที่อ่านแล้ว
        const unreadNotifications = notifications.filter(n => !n.read).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const readNotifications = notifications.filter(n => n.read).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // ดึง 8 แจ้งเตือนล่าสุด
        const recentNotifications = [...unreadNotifications, ...readNotifications].slice(0, 8);

        return recentNotifications;
    };


    useEffect(() => {
        fetchNotifications();
        fetchUser();
    }, [])

    useEffect(() => {
        if (socket && isConnected && user?.id) {
            socket.emit('join_room', user.id);
            // ฟังก์ชันรับ event 'new_notification'
            socket.on('new_notification', (data: any) => {
                setNotifications((prevNotifications) => [...prevNotifications, data]);
            });

            return () => {
                socket.off('new_notification');
            };
        }
    }, [socket, isConnected]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className="w-[45px] h-[45px] text-input relative">
                    <span className="material-symbols-outlined">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sky-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='p-0'>
                <Card className="w-96 border-none" >
                    <CardHeader>
                        <CardTitle>{t('Notifications')}</CardTitle>
                        <CardDescription>{t('YouHaveUnreadMessages', { count: unreadCount })}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <ScrollArea className="p-0 h-[300px] w-full pr-4 overflow-y-auto">
                            {getRecentNotifications().map((notification, index) => {
                                const { key, dynamicData } = formatMessage(notification.message);

                                return (
                                    <Button
                                        key={index}
                                        variant={'ghost'}
                                        className="justify-between items-center space-x-2 w-full h-fit gap-2 truncate"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <span className={`p-1 h-2 w-2 rounded-full ${notification.read ? 'bg-gray-400' : 'bg-sky-500'}`} />
                                        <div className="flex flex-col justify-start w-full truncate gap-1">
                                            <textarea
                                                className="text-sm font-medium text-start line-clamp-2 bg-transparent resize-none outline-none cursor-pointer"
                                                readOnly
                                            >
                                                {n(key, { date: dynamicData})}
                                            </textarea>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground text-start">
                                                    {timeAgo(notification.timestamp, d)}
                                                </p>
                                                {(() => {
                                                    let variant: "green" | "red" | "yellow" | "blue" | "default" | "purple" | "secondary" | "mint" | "orange" | "cyan" | undefined;
                                                    switch (notification.type as notificationType) {
                                                        case "information":
                                                            variant = "blue";
                                                            break;
                                                        case "request":
                                                            variant = "orange";
                                                            break;
                                                        default:
                                                            variant = "purple";
                                                            break;
                                                    }
                                                    return (
                                                        <BadgeCustom height='20' width='100' variant={variant}>
                                                            <p className='text-sm'>{s(notification.type)}</p>
                                                        </BadgeCustom>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </Button>
                                );
                            })}

                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <Button variant={'primary'} size={'lg'} className="w-full"
                            onClick={markAllAsRead}>
                            {t('MarkAllAsRead')}
                        </Button>
                    </CardFooter>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
