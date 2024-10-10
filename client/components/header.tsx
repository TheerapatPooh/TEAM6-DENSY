'use client'
import React, { useEffect, useState } from 'react'
import lightLogo from "../app/img/system_logo_light.png"
import darkLogo from "../app/img/system_logo_dark.png"
import Image from 'next/image'
import ProfileDropdown from './profile-dropdown'
import LanguageSelect from '@/components/language-select'
import ModeToggle from '@/components/mode-toggle'
import Notification from '@/components/notification'
import { useTheme } from 'next-themes'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()


  useEffect(() => {
    setMounted(true)
  },[])
  if (!mounted) {
    return null
  }
  
  return (
    <header className="bg-card h-[70px] flex justify-between items-center p-4 custom-shadow sticky top-0 z-50">
      <div className="flex items-center">
        <Image
          className="flex items-center"
          src={resolvedTheme === 'dark' ? darkLogo : lightLogo}
          alt="Logo"
          width={130}
          height={112}
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <LanguageSelect />
        <Notification />
        <ProfileDropdown />
      </div>
    </header>
  );
}
