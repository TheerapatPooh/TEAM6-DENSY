'use client'
import React from 'react'
import light_logo from "../app/img/system logo light.png"
import dark_logo from "../app/img/system logo dark.png"
import Image from 'next/image'
import ProfileDropdown from './profile-dropdown'
import LanguageSelect from '@/components/language-select'
import ModeToggle from '@/components/mode-toggle'
import { useTheme } from 'next-themes'

export default function Header() {
  const { theme } = useTheme()

  return (
    <header className="bg-white-100 h-[70px] flex justify-between items-center p-4 custom-shadow">
      <div className="flex items-center">
        <Image
          className="flex items-center"
          src={theme === 'dark' ? dark_logo : light_logo}
          alt="Logo"
          width={130}
          height={112}
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <LanguageSelect />
        <ModeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
