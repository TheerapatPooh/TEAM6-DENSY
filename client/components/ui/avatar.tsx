"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function getColorFromId(id: string): string {
  const chartColors = [
    "bg-chart-6",
    "bg-chart-7",
    "bg-chart-8",
    "bg-chart-9",
    "bg-chart-10",
  ];
  const index = id.charCodeAt(0) % chartColors.length;
  return chartColors[index];
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("object-cover h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface IAvatarFallback extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  id: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  IAvatarFallback
>(({ className,id , ...props }, ref) => {
  const bgColor = getColorFromId(id); 
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full font-normal text-card w-full items-center justify-center rounded-full",
        bgColor, 
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
