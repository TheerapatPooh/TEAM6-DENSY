/**
 * คำอธิบาย:
 *   คอมโพเนนต์ ModeToggle ใช้สำหรับเปลี่ยนธีมของเว็บไซต์ โดยมีฟังก์ชันที่ใช้สำหรับเปลี่ยนธีมเป็นแสงสว่าง แสงมืด หรือตามธีมของระบบปฏิบัติการ
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของ Dropdown ที่มีธีมที่สามารถเลือกได้
**/

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


export default function ModeToggle() {
    const t = useTranslations('General');
    const { setTheme } = useTheme()
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
                    <span className="material-symbols-outlined rotate-0  scale-100 dark:scale-0 dark:-rotate-90">light_mode</span>
                    <span className="material-symbols-outlined absolute rotate-90 scale-0 dark:scale-100 dark:rotate-0">dark_mode</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='p-0'>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {t('Light')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {t('Dark')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {t('System')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
