/**
 * คำอธิบาย:
 * คอมโพเนนต์ TabMenu ใช้สำหรับแสดงเมนูย่อยของเมนูหลัก โดยจะแสดงเมนูย่อยของเมนูหลักที่เกี่ยวข้องกับ path ปัจจุบัน
 * Input: 
 * - id: string รหัสของข้อมูลที่ต้องการใช้ในการสร้าง URL
 * Output:
 * - JSX ของ TabMenu ที่ใช้สำหรับแสดงเมนูย่อยของเมนูหลักที่เกี่ยวข้องกับ path ปัจจุบัน
 * - ถ้าไม่มีเมนูย่อยที่เกี่ยวข้องกับ path ปัจจุบัน จะแสดงข้อความ "No submenu available for this path."
 **/

import { subMenuList } from '@/constants/menu'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocale, useTranslations } from 'next-intl'

export default function TabMenu({ id }: { id?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations('TabMenu')

    const pathAfterLang = pathname.replace(/^\/(en|th)/, "");

    const currentSubMenu = subMenuList.find(menu => {
        const groupPath = `/${menu.group.toLowerCase()}`;
        return pathAfterLang.startsWith(groupPath);
    });

    const handleTabClick = (link: string) => {
        router.push(`/${locale}${link.replace("${id}", id || "")}`);
    };

    return (
        <div>
            {currentSubMenu ? (
                <Tabs defaultValue={`/${locale}`} value={pathname.replace(/\/\d+$/, "").replace(/\/create\b/, "")}>
                    <TabsList className="bg-secondary p-1 h-fit ">
                        {currentSubMenu.items.map((item, index) => {
                            const value = `/${locale}${item.link.replace("${id}", id || "")}`.replace(/\/$/, "");
                            return (
                                <TabsTrigger key={index} value={value} onClick={() => handleTabClick(item.link)}>
                                    <span className="material-symbols-outlined mr-2">
                                        {item.icon}
                                    </span>
                                    <p className="font-semibold">{t(item.text)}</p>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                </Tabs>
            ) : (
                null
            )}
        </div>
    )
}
