/**
 * คำอธิบาย:
 *   คอมโพเนนต์ ThemeProvider ใช้สำหรับการใช้งาน NextThemesProvider ในการเปลี่ยน Theme ของเว็บไซต์
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของ ThemeProvider ที่ใช้สำหรับการใช้งาน NextThemesProvider ในการเปลี่ยน Theme ของเว็บไซต์
 * - ใช้ Hook ของ React ในการเปลี่ยน Theme ของเว็บไซต์
 **/

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
