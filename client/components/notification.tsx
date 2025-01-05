/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Notification ใช้สำหรับแสดงและจัดการรายการแจ้งเตือนของผู้ใช้งาน รวมถึงการเปลี่ยนสถานะการแจ้งเตือน 
 *   และแสดงรายการแจ้งเตือนล่าสุดในรูปแบบ Dropdown
 *
 * Input:
 *   - ไม่มี props ที่รับเข้ามาโดยตรง
 *   - ใช้ข้อมูลแจ้งเตือน (notifications) และข้อมูลผู้ใช้ (user) ที่ดึงมาจาก API
 *
 * Output:
 *   - Dropdown แสดงรายการแจ้งเตือนล่าสุดสูงสุด 8 รายการ
 *   - ปุ่ม "Mark All As Read" สำหรับเปลี่ยนสถานะแจ้งเตือนทั้งหมดให้เป็น "อ่านแล้ว"
 *   - การคลิกแจ้งเตือนเปลี่ยนสถานะเป็น "อ่านแล้ว" และนำทางไปยัง URL ถ้ามี
**/

'use client'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { INotification, notificationType, IUser } from '@/app/type'
import { fetchData, formatTime, getNotificationToast } from '@/lib/utils'
import { useSocket } from '@/components/socket-provider'
import BadgeCustom from '@/components/badge-custom'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import {
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

export default function Notification() {
    const t = useTranslations('General'); // ฟังก์ชันแปลข้อความจาก 'General'
    const s = useTranslations("Status");
    const d = useTranslations('DateTime');
    const n = useTranslations('Notification');
    const a = useTranslations('Alert');

    const locale = useLocale()
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [user, setUser] = useState<IUser>()
    const { socket, isConnected } = useSocket()
    const [unreadCount, setUnreadCount] = useState(0);

    // const unreadCount = notifications.filter(notification => !notification.read).length

    const router = useRouter()

    function formatMessage(message: string) {
        const [key, ...dynamicParts] = message.split('-');
        console.log(key)
        let date = dynamicParts.join('-');
        date = formatTime(date)

        return { key, date };
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

    const removeNotification = async (id: number) => {
        try {
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.id !== id)
            );
            await fetchData("delete", `/notification/${id}`, true);

        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const removeAllNotifications = async () => {
        try {
            const response = await fetchData("delete", `/notifications`, true);
            return response
        } catch (error) {
            console.error("Failed to delete notification:", error);
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

    const handleRemoveAllNotifications = async () => {
        removeAllNotifications();
        setNotifications([]);
        toast({
            variant: 'success',
            title: a("DeleteAllNotificationTitle"),
            description: a("DeleteAllNotificationDescription"),
        });
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
            socket.on('new_notification', (data: INotification) => {
                setNotifications((prevNotifications) => [...prevNotifications, data]);

                const notification = formatMessage(data.message)
                const toastData = getNotificationToast(notification.key)

                if (notification) {
                    toast({
                        variant: toastData.variant,
                        title: a(toastData.title),
                        description: a(toastData.description, { date: notification.date }),
                    });
                } else {
                    console.error(`Notification not found for key: ${notification.key}`);
                }
            });

            return () => {
                socket.off('new_notification');
            };
        }
    }, [socket, isConnected]);

    useEffect(() => {
        setUnreadCount(notifications.filter(notification => !notification.read).length);
    }, [notifications]);

    useEffect(() => {
        if (unreadCount > 0) {
            const timer = setTimeout(() => {
                toast({
                    variant: "default",
                    title: a("UnreadNotificationTitle", { count: unreadCount }),
                    description: a("UnreadNotificationDescription"),
                });
            }, 5000); // 5000 มิลลิวินาที = 5 วินาที

            // ล้าง Timer เมื่อ Component ถูก Unmount หรือ unreadCount เปลี่ยน
            return () => clearTimeout(timer);
        }
    }, [unreadCount])

    const trailingActions = (id: number) => (
        <TrailingActions>
            <SwipeAction
                destructive={true}
                onClick={() => removeNotification(id)}
            >
                <div className="flex items-center justify-center gap-1 px-24 w-full h-[110px] bg-destructive text-card rounded-r-md">
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                    <p className='text-lg font-semibold'>{t("Delete")}</p>
                </div>
            </SwipeAction>
        </TrailingActions>
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className="w-[45px] h-[45px] text-input relative">
                    <span className="material-symbols-outlined">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='p-0'>
                <Card className="flex flex-col w-[480px] h-[580px] border-none px-6 py-4 gap-4" >
                    <CardHeader className='p-0 flex gap-0'>
                        <CardTitle className='flex flex-col'>
                            <div className='flex text-2xl w-full justify-between items-center'>
                                {t('Notifications')}
                                <DropdownMenu>
                                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" className="w-[45px] h-[45px]">
                                            <span className="material-symbols-outlined items-center text-muted-foreground">
                                                more_vert
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="p-0">
                                        <DropdownMenuItem onClick={() => handleRemoveAllNotifications()}>
                                            <h1 className='text-destructive'>{t("DeleteAllNotifications")}</h1>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className='p-0 text-base font-normal text-muted-foreground'>{t('YouHaveUnreadMessages', { count: unreadCount })}</p>
                        </CardTitle>
                    </CardHeader>
                    <div className='h-full overflow-y-auto flex flex-col gap-6'>
                        <ScrollArea className="flex-1 p-0 pr-4">
                            <SwipeableList style={{ overflow: 'visible' }}>
                                {getRecentNotifications().map((notification, index) => {
                                    const { key, date } = formatMessage(notification.message);
                                    return (
                                        <SwipeableListItem
                                            key={index}
                                            trailingActions={trailingActions(notification.id)}>
                                            <Button
                                                key={index}
                                                variant={'ghost'}
                                                className="justify-between items-center w-full h-fit gap-6 px-6 py-4 truncate mb-4"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <span className={`h-3 w-3 rounded-full ${notification.read ? 'bg-input' : 'bg-primary'}`} />
                                                <div className="flex flex-col justify-start w-full truncate gap-1">
                                                    <textarea
                                                        className="text-sm font-normal text-card-foreground text-start line-clamp-2 bg-transparent resize-none outline-none cursor-pointer"
                                                        readOnly
                                                    >
                                                        {n(key, { date: date })}
                                                    </textarea>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs font-normal text-muted-foreground text-start">
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
                                                                <BadgeCustom variant={variant}>
                                                                    {s(notification.type)}
                                                                </BadgeCustom>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </Button>
                                        </SwipeableListItem>
                                    );
                                })}
                            </SwipeableList>
                        </ScrollArea>
                        <Button variant={'primary'} size={'lg'} className="w-full"
                            onClick={markAllAsRead}>
                            {t('MarkAllAsRead')}
                        </Button>
                    </div>

                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
