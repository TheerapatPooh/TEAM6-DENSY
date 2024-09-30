"use client";

import { useEffect, useState } from "react";
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
import { fetchData } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import LinesEllipsis from "react-lines-ellipsis";
import { BlankDropdown } from "@/components/patrol-select-user-dropdown";

// Define User and PatrolCard interfaces
interface User {
  id: number;
  username: string;
  email: string;
  password: string; // Avoid using this for sensitive data
  role: string;
  department: string | null;
  created_at: string;
  profile: Profile[]; // Allow for an array of profiles
}

interface Profile {
  address: string;
  age: number;
  id: number;
  name: string;
  tel: string;
  users_id: number;
}

interface PatrolUser {
  users_id: number;
  patrols_id: number;
  user: User;
}

interface PatrolPreset {
  id: number;
  title: string;
  description: string;
  version: number;
  latest: boolean;
  updateAt: string;
  updateBy: number;
  checklist: Checklist;
}

interface PresetHaveChecklist {
  presets_id: number;
  checklists_id: number;
}

interface Checklist {
  id: number;
  title: string;
  version: number;
  latest: boolean;
  updateAt: string;
  updateByUserId: number;
}

interface PatrolCardData {
  id: number;
  date: string; // or Date if you're parsing it later
  start_time: string | null;
  end_time: string | null;
  duration: string;
  status: string; // Change this to the patrolStatus enum if necessary
  presets_id: number;
  preset: PatrolPreset;
  user: PatrolUser[];
}

// Enum for patrol status
enum PatrolStatus {
  pending = "Pending",
  scheduled = "Scheduled",
  onGoing = "OnGoing",
  completed = "Completed",
}

export default function HomePage() {
  const patrols = fetchData("get", "/patrols", true);
  console.log(patrols);

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(true);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [isThirdDialogOpen, setIsThirdDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PatrolPreset | null>(
    null
  );
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  const openSecondDialog = () => {
    setIsSecondDialogOpen(true);
  };

  const openThirdDialog = () => {
    setIsSecondDialogOpen(false);
    setIsThirdDialogOpen(true);
  };

  const t = useTranslations("PatrolPage");
  const isNextButtonDisabled = !selectedPreset; // Disable Next if no preset is selected

  // State to keep track of patrol cards
  const [patrolCards, setPatrolCards] = useState<PatrolCardData[]>([]);
  const [alluserdata, setUser] = useState<User[]>([]);
  const [allpreset, setPatrolPreset] = useState<PatrolPreset[]>([]);
  useEffect(() => {
    const getPatrolData = async () => {
      try {
        const data = await fetchData("get", "/patrols", true);
        const dataAllUser = await fetchData("get", "/users", true);
        const dataAllPreset = await fetchData("get", "/preset", true);
        setPatrolPreset(dataAllPreset);
        console.log(dataAllPreset);
        setUser(dataAllUser);
        setPatrolCards(data);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };

    getPatrolData();
  }, []);

  const handlePresetSelect = (preset: PatrolPreset) => {
    setSelectedPreset(preset);

    // Directly set the checklist since it appears to be a single Checklist
    setChecklists([preset.checklist]); // Wrap it in an array if you want to keep the state as an array
  };

  // Function to add a new PatrolCard
  // const addPatrolCard = () => {
  //   setPatrolCards([
  //     ...patrolCards,
  //     {
  //       id: patrolCards.length + 1, // Dummy ID, adjust as necessary
  //       date: new Date().toISOString(), // Set current date
  //       start_time: null,
  //       end_time: null,
  //       duration: "New Patrol Duration",
  //       status: PatrolStatus.completed, // Use enum here
  //       presets_id: 1, // Dummy preset ID, adjust as necessary
  //       preset: {
  //         id: 1,
  //         title: "New Inspection",
  //         description: "Description of new inspection",
  //         version: 1,
  //         latest: true,
  //         updateAt: new Date().toISOString(),
  //         updateBy: 1,
  //       },
  //       user: [
  //         {
  //           users_id: 1,
  //           patrols_id: patrolCards.length + 1,
  //           user: {
  //             id: 1,
  //             username: "John Doe",
  //             email: "johndoe@example.com",
  //             password: "1234",
  //             role: "ADMIN",
  //             department: "SE",
  //             created_at: new Date().toISOString(),
  //           },
  //         },
  //       ],
  //     },
  //   ]);
  // };

  return (
    <div className="flex flex-col p-5 gap-y-5">
      <div className="flex items-center gap-2">
        <Textfield iconName="search" showIcon={true} placeholder="Search..." />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="p-[10px] bg-card w-[100px] h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer border border-secondary hover:bg-secondary hover:text-accent-foreground">
              <span className="material-symbols-outlined">swap_vert</span>
              <div className="text-lg	">Sort</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>A-Z</DropdownMenuItem>
            <DropdownMenuItem>Date</DropdownMenuItem>
            <DropdownMenuItem>Zone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="p-[10px] bg-card w-[100px] h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer border border-secondary hover:bg-secondary hover:text-accent-foreground">
              <span className="material-symbols-outlined">page_info</span>
              <div className="text-lg	">Filter</div>
            </div>
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

        {isFirstDialogOpen && (
          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <CreatePatrolCard />
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[620px] h-[703px] mb-[1000px]">
              <AlertDialogHeader>
                <div className="flex items-start justify-start">
                  <AlertDialogTitle>Patrol Preset</AlertDialogTitle>
                </div>
                <div>
                  <AlertDialogDescription className="flex items-start justify-start">
                    Please select a preset for the patrol
                  </AlertDialogDescription>
                </div>

                <div className="flex items-center justify-center">
                  <ScrollArea className="p-[1px] h-[545px] w-full rounded-md border border-none pr-[15px] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                      {allpreset.map((preset) => (
                        <Button
                          key={preset.id}
                          className={`grid grid-cols-1 sm:grid-cols-1 h-[300px] ${
                            selectedPreset === preset
                              ? "bg-accent"
                              : "bg-secondary"
                          } border-secondary hover:border-red-500 p-2`}
                          onClick={() => handlePresetSelect(preset)}
                        >
                          <div className="w-full flex items-start justify-start">
                            <p className="font-bold">{preset.title}</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="h-[175px] w-[185px] bg-card rounded"></div>
                          </div>
                          <div className="relative text-muted-foreground">
                            <Textarea
                              disabled
                              className="pl-8 text-[10px] resize-none leading-tight border-none"
                              placeholder={preset.description}
                            />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-end justify-start ">
                <div className="flex gap-[10px]">
                  <AlertDialogCancel className="bg-secondary text-[20px]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="flex items-center justify-start w-[100px]"
                    onClick={openSecondDialog}
                    disabled={isNextButtonDisabled} // Disable button based on selection
                  >
                    Next
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {/* Second AlertDialog */}
        {isSecondDialogOpen && (
          <AlertDialog
            open={isSecondDialogOpen}
            onOpenChange={setIsSecondDialogOpen}
          >
            <AlertDialogContent className="max-w-[995px] h-[571px] mb-[1000px]">
              <AlertDialogHeader>
                <div className="flex items-start justify-start">
                  <AlertDialogTitle>Patrol Preset</AlertDialogTitle>
                </div>
                <div>
                  <AlertDialogDescription className="flex items-start justify-start">
                    Please select a preset for the patrol
                  </AlertDialogDescription>
                </div>
              </AlertDialogHeader>
              <div className="flex items-center justify-center">
                <ScrollArea className="p-[10px] h-[400px] w-full rounded-md border pr-[15px] overflow-visible overflow-y-clip">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-[10px] ">
                    {allpreset.map((checklist, index) => (
                      <BlankDropdown key={index} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <AlertDialogFooter className="flex items-end justify-start">
                <AlertDialogCancel className="bg-secondary text-[20px]">
                  Close
                </AlertDialogCancel>
                <AlertDialogAction
                  className="flex items-center justify-start w-[100px]"
                  onClick={openThirdDialog}
                  disabled={!selectedPreset} // Disable based on selection
                >
                  Next
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {isThirdDialogOpen && (
          <AlertDialog
            open={isThirdDialogOpen}
            onOpenChange={setIsThirdDialogOpen}
          >
            <AlertDialogContent className="w-[620px] h-[303px] mb-[1000px]">
              <AlertDialogHeader>
                <div className="flex items-start justify-start">
                  <AlertDialogTitle>Third Dialog</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  This is the second AlertDialog.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-end justify-start">
                <AlertDialogCancel className="bg-secondary text-[20px]">
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {patrolCards.map((card, index) => (
          <PatrolCard
            key={index}
            patrolStatus={card.status as PatrolStatus} // Ensure it's cast to PatrolStatus if necessary
            patrolSheetDate={new Date(card.date)} // Parse the date from string to Date object
            patrolSheetTitle={card.preset ? card.preset.title : "No Title"} // Check if preset is defined
            presetNumber={
              card.preset.id !== undefined ? String(card.preset.id) : "N/A"
            } // Convert number to string
            inspectorNames={card.user.map((u: PatrolUser) => u.user.username)} // Explicitly typing 'u'
            detectedItems={0} // Update this based on your logic
            detectedComments={0} // Update this based on your logic
            detectedDefects={0} // Update this based on your logic
          />
        ))}
      </div>
    </div>
  );
}
