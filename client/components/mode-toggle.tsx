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
                <div className="w-[45px] h-[45px] outline-none rounded-md flex justify-center items-center bg-slate-50  hover:bg-slate-200">
                    <span className="material-symbols-outlined rotate-0  scale-100 dark:scale-0 dark:-rotate-90">light_mode</span>
                    <span className="material-symbols-outlined absolute rotate-90 scale-0 dark:scale-100 dark:rotate-0">dark_mode</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='p-0'>
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
