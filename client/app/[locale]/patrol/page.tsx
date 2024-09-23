"use client"
import { useState } from "react";
import BadgeCustom from "@/components/badge-custom";
import { CreatePatrolCard, PatrolCard } from "@/components/patrol-card";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

enum patrolStatus {
  scheduled = "Scheduled",
  onGoing = "On Going",
  completed = "Completed",
}

export default function HomePage() {
  const t = useTranslations("PatrolPage");

  // State to keep track of patrol cards
  const [patrolCards, setPatrolCards] = useState([
    {
      patrolStatus: patrolStatus.scheduled,
      patrolDate: new Date("2024-06-21"),
      patrolTitle: "General Inspection",
      patrolPreset: "P08002",
      patrolorName: "John Doe",
      patrolAllItems: 0,
      patrolAllComments: 0,
      patrolAllDefects: 0,
    }
  ]);

  // Function to add a new PatrolCard
  const addPatrolCard = () => {
    setPatrolCards([
      ...patrolCards,
      {
        patrolStatus: patrolStatus.completed,
        patrolDate: new Date(),
        patrolTitle: "New Inspection",
        patrolPreset: "P08001",
        patrolorName: "John Doe",
        patrolAllItems: 0,
        patrolAllComments: 0,
        patrolAllDefects: 0,
      },
    ]);
  };

  return (
    <div className="flex flex-col p-5 gap-y-5">
      <div className="flex items-center gap-2">
        <Textfield iconName="search" showIcon={true} placeholder="Search..." />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="bg-card w-[100px] h-[40px] gap-[10px]"
              variant={"outline"}
            >
              <span className="material-symbols-outlined">swap_vert</span>
              <div>Sort</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>A-Z</DropdownMenuItem>
            <DropdownMenuItem>Date</DropdownMenuItem>
            <DropdownMenuItem>Zone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="bg-card w-[100px] h-[40px] gap-[10px]"
              variant={"outline"}
            >
              <span className="material-symbols-outlined">page_info</span>
              <div>Filter</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>A-Z</DropdownMenuItem>
            <DropdownMenuItem>Date</DropdownMenuItem>
            <DropdownMenuItem>Zone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Create Patrol Card with AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <CreatePatrolCard />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Would you like to add a new patrol card?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={addPatrolCard}>Add Card</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {patrolCards.map((card, index) => (
          <PatrolCard
            key={index}
            patrolStatus={card.patrolStatus}
            patrolDate={card.patrolDate}
            patrolTitle={card.patrolTitle}
            patrolPreset={card.patrolPreset}
            patrolorName={card.patrolorName}
            patrolAllItems={card.patrolAllItems}
            patrolAllComments={card.patrolAllComments}
            patrolAllDefects={card.patrolAllDefects}
          />
        ))}
      </div>
    </div>
  );
}
