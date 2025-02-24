/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Sidebar ใช้สำหรับแสดงส่วนหัวของหน้าเว็บ โดยสามารถปรับการแสดงผลของเมนูด้านบนได้ตามประเภทผู้ใช้งาน
 *   (variant) ที่ส่งเข้ามา เช่น ถ้าเป็น "inspector" จะแสดงเมนู Patrol และ Defect ถ้าไม่ใช่จะไม่แสดงเมนูดังกล่าว
 *
 * Input: -
 * Output:
 * - JSX ของ Sidebar มี 3 menu คือ Dashboard, Users และ Settings และสามารถเปิด-ปิดเมนูด้วยปุ่มที่มี icon 3 เส้น
 **/

"use client"
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import lightLogo from "@/public/assets/img/system_logo_light.png"
import darkLogo from "@/public/assets/img/system_logo_dark.png"
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { menuList } from "@/constants/menu";

export function AdminSidebar() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname();
    const { resolvedTheme } = useTheme()
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const s = useTranslations("Sidebar");
    const pathAfterLang = pathname.replace(/^\/(en|th)\/admin/, "");

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    const isActive = (menu: string) => {
        const menuPath = `/${menu.toLocaleLowerCase()}`
        return pathAfterLang === menuPath || pathAfterLang.startsWith(menuPath);
    };

    return (
        <SidebarProvider className={`sticky transition-all duration-300 ${isExpanded ? "sm:w-[200px] lg:w-[240px]" : "w-[70px] pointer-events-none"}`}>
            <Sidebar className={`w-[240px] custom-shadow border-none ${isExpanded ? "sm:w-[200px] lg:w-[240px]" : "w-[70px] "}`}>
                <SidebarContent className="p-[8px] pt-[8px] bg-card overflow-x-hidden">
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className="mb-[16px]">
                            <div className="flex items-center w-full justify-between mt-[16px] transition-all duration-300">
                                {isExpanded && (
                                    <Image
                                        className="flex items-center cursor-pointer"
                                        src={resolvedTheme === 'dark' ? darkLogo : lightLogo}
                                        alt="Logo"
                                        width={140}
                                        height={35}
                                        priority
                                        onClick={() => router.push(`/${locale}`)}
                                    />
                                )}
                                <Button variant="ghost" className="size-[45px] text-muted-foreground transition-all duration-300 ms-[-4px] pointer-events-auto" onClick={toggleSidebar}>
                                    <span className="material-symbols-outlined text-10">menu</span>
                                </Button>
                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="p-0 mt-[16px]">
                            <SidebarMenu>
                                {menuList.map((item) => (
                                    <SidebarMenuItem key={item.text}>
                                        <SidebarMenuButton asChild>
                                            <div onClick={() => router.push(`/${locale}${item.link}`)} className={`w-[224px] h-[50px] transition-all pointer-events-auto duration-300 text-muted-foreground hover:bg-accent-gradient-hover hover:text-secondary cursor-pointer ${isExpanded ? "justify-start" : "justify-center"} ${isActive(item.text) ? "bg-accent-gradient text-secondary" : ""}`}>
                                                <span className="material-symbols-outlined">{item.icon}</span>
                                                {isExpanded && (
                                                    <span className="text-lg w-auto">{s(item.text)}</span>
                                                )}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

