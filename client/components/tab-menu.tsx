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
import { useLocale } from 'next-intl'

export default function TabMenu({ id }: { id?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const pathAfterLang = pathname.replace(/^\/(en|th)/, "");

    const currentSubMenu = subMenuList.find(menu => {
        const groupPath = `/${menu.group.toLowerCase()}`;
        return pathAfterLang.startsWith(groupPath);
    });

    const handleTabClick = (link: string) => {
        router.push(`/${locale}${link.replace("${id}", id || "")}`);
    };

    // ถ้า path เป็น /en/admin/employees ให้ return null
    if (pathname === `/${locale}/admin/employees`) {
        return null;
    }

    if (pathname === `/${locale}/admin/settings/patrol-preset/create` || new RegExp(`^/${locale}/admin/settings/patrol-preset/\\d+$`).test(pathname)) {
        return null
    }

    return (
        <div>
            {currentSubMenu ? (
                <Tabs defaultValue={`/${locale}`} value={pathname}>
                    <TabsList className="bg-secondary p-1 h-fit ">
                        {currentSubMenu.items.map((item, index) => (
                            <TabsTrigger key={index} value={`/${locale}${item.link.replace("${id}", id || "")}`} onClick={() => handleTabClick(item.link)}>
                                <span className="material-symbols-outlined mr-2">
                                    {item.icon}
                                </span>
                                <p className="font-semibold">{item.text}</p>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            ) : (
                <div>
                    No submenu available for this path.
                </div>
            )}
        </div>
    )
}
