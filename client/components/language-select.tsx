/**
 * คำอธิบาย:
 *   คอมโพเนนต์ LanguageSelect ใช้สำหรับเปลี่ยนภาษาของเว็บไซต์
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของ Dropdown ที่มีภาษาที่สามารถเลือกได้
 **/


'use client'
import React, { useEffect, useState }  from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'


export default function LanguageSelect() {
    const t = useTranslations('General')
    const router = useRouter()
    const pathname = usePathname()


    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const changeLanguage = (locale: string) => {
        if(mounted) {
            const newPath = `/${locale}${pathname.slice(3)}`
            router.replace(newPath)
            router.refresh()
        }
    }

    if(!mounted) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className="w-[45px] h-[45px] text-input">
                    <span className="material-symbols-outlined">language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='p-0'>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    {t('English')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('th')}>
                    {t('Thai')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
