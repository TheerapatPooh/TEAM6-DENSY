"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from 'next-intl'
import { fetchProfile, logout } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Profile {
  name: string
  age: number
  tel: string
  address: string
}

export default function ProfileDropdown() {
  const t = useTranslations('General');
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile>()
  const router = useRouter()
  const hadleLogout = async () => {
    await logout()
    router.refresh()
  }

  // Explicitly typing buttonRef as a RefObject of HTMLButtonElement
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleIconClick = () => {
    setIsFlipped((prev) => !prev);
  };

  // Effect to handle clicks outside the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ensure buttonRef is defined and has a 'contains' method
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsFlipped(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    async function loadProfile() {
      const userProfile = await fetchProfile()
      if (userProfile && userProfile.profile && userProfile.profile.length > 0) {
        setProfile(userProfile.profile[0])
      }
    }
    loadProfile()
    setMounted(true)

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  if (!mounted) {
    return null
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            ref={buttonRef}
            variant="ghost"
            className="text-input w-[226px] h-[50px] bg-card flex gap-[10px] justify-start items-center py-[10px] px-[20px]"
            onPointerDown={handleIconClick}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-[97px] h-[27px] font-medium">{profile ? profile.name : 'Loading...'}</div>

            <span
              className={`material-symbols-outlined inline-block transition-transform duration-300 ${isFlipped ? "rotate-180" : "rotate-0"
                }`}
            >
              stat_minus_1
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card p-0">
          <DropdownMenuLabel className=" w-[226px] text-lg font-medium">
            {t('MyAccount')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-secondary h-[2px]" />
          <DropdownMenuItem className="w-[226px] h-[full]">
            <div className="flex gap-1 w-full items-center">
              <span className="material-symbols-outlined">account_circle</span>
              <div>{t('Profile')}</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-[226px] h-[full]" onClick={hadleLogout}>
            <div className="flex gap-1 w-full h-full items-center hover:text-destructive">
              <span className="material-symbols-outlined">logout</span>
              <div>{t('Logout')}</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
