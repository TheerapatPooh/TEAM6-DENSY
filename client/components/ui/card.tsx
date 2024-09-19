import * as React from "react"
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow w-96",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"
const CardAdd = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-red-800 text-card-foreground shadow w-96 flex justify-center",
      className
    )}
    {...props}
  />
))
export function CardShowExample() {
  return (
    <div className="flex">
      <Card>
        <CardHeader>
          <div className="flex justify-between flex items-center justify-center">
            <CardDescription>24/07/2024</CardDescription>
            <div className="flex items-center justify-center border border-1 rounded-full bg-amber-200 w-10 h-10">
              <span className="material-symbols-outlined text-amber-600">event_available</span>
            </div>
          </div>
          <CardTitle>General Inspection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2.5 text-gray-500 items-center">
            <span className="material-symbols-outlined">description</span>
            <p>P08001</p>
          </div>
          <div className="flex gap-2.5 text-gray-500 items-center">
            <span className="material-symbols-outlined">description</span>
            <p>John Doe</p>
            <span className="material-symbols-outlined">account_circle</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2.5 items-center">
            <div className="flex gap-2.5 text-sky-500">
              <span className="material-symbols-outlined">checklist</span>
              <p>0</p>
            </div>
            <div className="flex gap-2.5 text-yellow-300 items-center">
              <span className="material-symbols-outlined">checklist</span>
              <p>0</p>
            </div>
            <div className="flex gap-2.5 text-rose-600 items-center">
              <span className="material-symbols-outlined">checklist</span>
              <p>0</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function CardAddExample() {
  return (
    <div className="flex">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <CardAdd>
        <button>
          <span className="material-symbols-outlined text-6xl">assignment_add</span>
        </button>
      </CardAdd>
    </div>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAdd }
