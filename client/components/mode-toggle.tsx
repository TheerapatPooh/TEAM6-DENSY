'use client'
import { useTheme } from 'next-themes'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="w-[45px] h-[45px] outline-none rounded-md flex justify-center items-center hover:bg-icon">
                    <span className="material-symbols-outlined rotate-0  scale-100 dark:scale-0 dark:-rotate-90 bg-transparent">light_mode</span>
                    <span className="material-symbols-outlined absolute rotate-90 scale-0 dark:scale-100 dark:rotate-0 bg-transparent">dark_mode</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-[8.5px]" align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
