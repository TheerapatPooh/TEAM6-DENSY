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
import Link from "next/link";

export default function ProfileDropdown() {
  const [isFlipped, setIsFlipped] = useState(false);
  const buttonRef = useRef(null);

  const handleIconClick = () => {
    setIsFlipped((prev) => !prev);
  };

  // Effect to handle clicks outside the button
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsFlipped(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            ref={buttonRef}
            variant="ghost"
            className="text-input w-[226px] h-[65px] bg-card flex gap-[10px] justify-start items-center py-[10px] px-[20px]"
            onPointerDown={handleIconClick}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-[97px] h-[27px]">John Doe</div>

            <span
              className={`material-symbols-outlined inline-block transition-transform duration-300 ${
                isFlipped ? "rotate-180" : "rotate-0"
              }`}
            >
              stat_minus_1
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card p-0">
          <DropdownMenuLabel className=" w-[226px] text-xl">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Link className="flex p-2 gap-1" href="/profile" replace>
              <span className="material-symbols-outlined">account_circle</span>
              <div>Profile</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Link
              className="flex hover:text-destructive p-2 gap-1 w-[226px] h-[full]"
              href="/logout"
              replace
            >
              <span className="material-symbols-outlined">logout</span>
              <div>Logout</div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
