'use client'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'


export default function Notification() {
    const t = useTranslations('General');
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className="w-[45px] h-[45px] text-input">
                    <span className="material-symbols-outlined">notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='p-0'>
                <Card className="w-[300px] border-none" >
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>You have 1 unread messages.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                                <Button
                                    variant={'ghost'}
                                    // key={index}
                                    className="grid flex items-start space-x-2 h-fit"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Your Defect has been update.
                                        </p>
                                        <p className="text-sm text-muted-foreground text-start">
                                            1 hour ago
                                        </p>
                                    </div>
                                </Button>
                    </CardContent>
                    <CardFooter>
                        <Button variant={'primary'} size={'lg'} className="w-full">
                             Mark all as read
                        </Button>
                    </CardFooter>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
