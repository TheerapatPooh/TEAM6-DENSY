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
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'   
import lightLogo from "@/public/assets/img/system_logo_light.png"
import darkLogo from "@/public/assets/img/system_logo_dark.png"
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AdminSidebar() {
    const sidebarItems = [
        {
            title: "Dashboard",
            url: "#",
            icon: "browse",
        },
        {
            title: "Employees",
            url: "#",
            icon: "manage_accounts",
        },
        {
            title: "Settings",
            url: "#",
            icon: "manufacturing",
        },
    ]

    const locale = useLocale()
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
      };

    return (
        <SidebarProvider className={`custom-shadow sticky transition-all duration-300 ${isExpanded ? "w-[240px]" : "w-[70px]"}`}>
             <Sidebar className={`w-[240px] border-none ${isExpanded ? "w-[240px]" : "w-[70px]"}`}>
                <SidebarContent className="p-[8px] pt-[8px] bg-card">
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="mb-[16px]">
                        <div className="flex items-center space-x-[24px] mt-[16px] transition-all duration-300">
                            { isExpanded && (
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
                            <Button variant="ghost" className="size-[54px] text-muted-foreground transition-all duration-300 ms-[-8px]" onClick={toggleSidebar}>
                                <span className="material-symbols-outlined text-10">menu</span>
                            </Button>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="p-0 mt-[16px]">
                    <SidebarMenu>
                        {sidebarItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <div onClick={() => router.push(`/${locale}/admin/${item.url}`)} className={`w-[224px] h-[50px] transition-all duration-300 text-muted-foreground hover:bg-accent-gradient hover:text-background cursor-pointer ${isExpanded ? "justify-start" : "justify-center"}`}>
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {isExpanded && (
                                        <span className="text-[18px] w-[95px] h-[22px]">{item.title}</span>
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

