"use client";

import { useEffect, useState } from "react";
import { CreatePatrolCard, PatrolCard } from "@/components/patrol-card";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { ChecklistDropdown } from "@/components/checklist-dropdown";
import { DatePicker, DatePickerWithRange } from "../../../components/date-picker";
import BadgeCustom from "@/components/badge-custom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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
interface PatrolPreset {
  checklist: PresetHaveChecklist[];
  description: string;
  id: number;
  latest: boolean;
  title: string;
  updateAt: string;
  updateBy: number;
  version: number;
}
interface PresetHaveChecklist {
  presets_id: number;
  checklists_id: number;
  checklist: ChecklistItem;
}

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  lasted: boolean;
  updateAt: string;
  updateBy: number;
  version: number;
}

interface PatrolHasChecklist {
  checklistId: number;
  inspectorId: number;
}

export default function HomePage() {
  const patrols = fetchData("get", "/patrols", true);
  console.log(patrols);

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(true);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);

  const openSecondDialog = () => {
    setIsSecondDialogOpen(true);
  };

  const t = useTranslations("General");

  const [patrolCards, setPatrolCards] = useState<PatrolCardData[]>([]);
  const [alluserdata, setUser] = useState<User[]>([]);
  const [allpreset, setPatrolPreset] = useState<PatrolPreset[]>([]);

  const [selectedPreset, setSelectedPreset] = useState<PatrolPreset>();
  const isNextButtonDisabled = !selectedPreset; // Disable Next if no preset is selected

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<PatrolHasChecklist[]>([]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isChecklistAllSelected: boolean =
    selectedPreset?.checklist?.length === selectedUser.length;
  const isDateSelectedYet: boolean = selectedTime !== "";

  const isAddPatrolEnabled: boolean =
    isChecklistAllSelected && isDateSelectedYet;

  useEffect(() => {
    const getData = async () => {
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
    getData();
  }, []);

  const handlePresetSelect = (preset: PatrolPreset) => {
    setSelectedPreset(preset); // Set preset directly
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log("Selected Time:", time);
  };

  const handleUserSelect = (user: PatrolHasChecklist) => {
    const existingUserIndex = selectedUser.findIndex(
      (selected) => selected.checklistId === user.checklistId
    );

    if (existingUserIndex !== -1) {
      const oldUser = selectedUser[existingUserIndex];
      setSelectedUser((prevSelectedUsers) => {
        const updatedUsers = [...prevSelectedUsers];
        updatedUsers.splice(existingUserIndex, 1); // Remove the old user
        console.log(
          `User ${oldUser.inspectorId} removed from checklist ${oldUser.checklistId}.`
        );
        return updatedUsers;
      });
    }

    // Add the new user for the checklist
    setSelectedUser((prevSelectedUsers) => [
      ...prevSelectedUsers,
      user, // Add the selected user to the array
    ]);
    console.log(
      `User ${user.inspectorId} added with checklist ${user.checklistId}.`
    );

    console.log(
      `Current number of selected users: ${selectedUser.length + (existingUserIndex === -1 ? 1 : 0)
      }`
    );
    console.log(isAddPatrolEnabled);
  };

  const handleUserSelectCancel = () => {
    setSelectedUser([]);
  };
  const addPatrol = async () => {
    const presets_id = selectedPreset?.id;

    const data = {
      date: selectedTime,
      presets_id,
      patrol_has_Checklist: selectedUser,
    };

    try {
      const response = await fetchData("post", "/patrols", true, data);
      if (response) {
        console.log("Patrol added successfully", response);
        window.location.reload();
      } else {
        console.error("Error adding patrol:", response);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="flex flex-col p-5 gap-y-5">
      <div className="flex items-center gap-2">
        <Textfield iconName="search" showIcon={true} placeholder={t('Search')} />
        <DropdownMenu onOpenChange={(open) => setIsSortOpen(open)}>
          <DropdownMenuTrigger className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isSortOpen ? "border border-destructive" : "border-none"}`}>
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg	">Sort</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuRadioGroup value='Doc No.' >
              <DropdownMenuRadioItem value="Doc No." className="text-base">Doc No.</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">Date</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup value='Order' >
              <DropdownMenuRadioItem value="Order" className="text-base">Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
          <DropdownMenuTrigger className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isFilterOpen ? "border border-destructive" : "border-none"}`}>            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg	">Filter</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col justify-center gap-2 p-2">
            <div>
              <DropdownMenuLabel>Date</DropdownMenuLabel>
              <DatePickerWithRange />
            </div>
            <div>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked><BadgeCustom width="w-full" variant="blue" showIcon={true} iconName="hourglass_top" children='Pending'></BadgeCustom></DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem><BadgeCustom width="w-full" variant="yellow" showIcon={true} iconName="event_available" children='Scheduled'></BadgeCustom></DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem><BadgeCustom width="w-full" variant="purple" showIcon={true} iconName="cached" children='On Going'></BadgeCustom></DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem><BadgeCustom width="w-full" variant="green" showIcon={true} iconName="check" children='Complete'></BadgeCustom></DropdownMenuCheckboxItem>
            </div>
            <div>
              <DropdownMenuLabel>Preset</DropdownMenuLabel>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Preset</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Weather And Toilet">Weather And Toilet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end gap-2">
              <Button size='sm' variant='secondary'>Reset</Button>
              <Button size='sm'>Apply</Button>
            </div>
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
            <AlertDialogContent className="w-[620px] h-[715px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  Patrol Preset
                </AlertDialogTitle>
                <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                  Please select a preset for the patrol
                </AlertDialogDescription>
                <div className="flex items-center justify-center">
                  <ScrollArea className="p-[1px] h-[545px] w-full rounded-md border border-none pr-[15px] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                      {allpreset !== null ? (
                        allpreset.map((preset) => (
                          <Button
                            key={preset.id}
                            variant={"outline"}
                            className={`bg-secondary grid grid-cols-1 sm:grid-cols-1 h-[300px] ${selectedPreset === preset
                              ? "border-red-600"
                              : "border-transparent"
                              } border p-2`}
                            onClick={() => handlePresetSelect(preset)}
                          >
                            {/* Title */}
                            <div className="w-full flex items-start justify-start">
                              <p className="font-bold text-xl text-card-foreground">
                                {preset.title}
                              </p>
                            </div>
                            {/* Map */}
                            <div className="flex items-center justify-center mb-1">
                              <div className="h-[175px] w-[185px] bg-card rounded"></div>
                            </div>
                            {/* Description */}
                            <div className="relative w-full">
                              {/* Positioned Icon */}
                              <span className="material-symbols-outlined text-2xl text-muted-foreground absolute left-0 top-0">
                                data_info_alert
                              </span>
                              {/* Positioned Textarea */}
                              <Textarea
                                disabled
                                className="pl-6 pointer-events-none border-none shadow-none overflow-hidden text-left resize-none leading-tight w-full"
                                placeholder={preset.description}
                              />
                            </div>
                          </Button>
                        ))
                      ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="h-[300px] w-full rounded-md" />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

              </AlertDialogHeader>
              <AlertDialogFooter>
                <div className="flex items-end justify-end gap-[10px]">
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={openSecondDialog}
                    disabled={isNextButtonDisabled}
                  >
                    Next
                    <span className="material-symbols-outlined text-2xl">
                      chevron_right
                    </span>
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
            <AlertDialogContent className="max-w-[995px] h-[700px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  Patrol Preset
                </AlertDialogTitle>
                <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                  Please select a preset for the patrol
                </AlertDialogDescription>
                <p className="font-semibold text-muted-foreground">Date</p>
                <DatePicker handleSelectedTime={handleTimeSelect} />


                {/* <div>Selected Date: {selectedTime}</div> */}
              </AlertDialogHeader>
              <div className="grid grid-cols-1">
                <p className="font-semibold text-muted-foreground">
                  Checklist
                </p>
                <ScrollArea className="pr-[10px] h-[400px] w-full rounded-md pr-[15px] overflow-visible overflow-y-clip">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-[10px] ">
                    {selectedPreset?.checklist.map((presetChecklist) => (
                      <ChecklistDropdown
                        key={presetChecklist.checklist.id}
                        checklist={presetChecklist.checklist}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <AlertDialogFooter>
                <div className="flex items-end justify-end gap-[10px]">
                  <AlertDialogCancel
                    onClick={handleUserSelectCancel}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="gap-2"
                    onClick={addPatrol}
                    disabled={!isAddPatrolEnabled} // Disable button based on selection
                  >
                    <span className="material-symbols-outlined text-2xl">
                      note_add
                    </span>
                    New Patrol
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {patrolCards &&
          Array.isArray(patrolCards) &&
          patrolCards.length > 0 &&
          patrolCards.map((card) => {
            const { status, date, preset, user } = card; // Destructure properties for readability
            const inspectorNames =
              user.map((u: PatrolUser) => u.user.username).join(", ") ||
              "No Inspectors"; // Joining names for display

            return (
              <PatrolCard
                key={card.id || date} // Use a unique identifier if available
                patrolStatus={status as PatrolStatus} // Cast to PatrolStatus if necessary
                patrolDate={new Date(date)} // Parse the date from string to Date object
                patrolPreset={preset ? preset.title : "No Title"} // Use optional chaining
                patrolId={
                  preset?.id !== undefined ? String(preset.id) : "N/A"
                } // Simplify with optional chaining
                inspector={card.user.map(
                  (u: PatrolUser) => u.user.username
                )} // Explicitly typing 'u'
                items={0} // Update based on your logic
                fails={0} // Update based on your logic
                defects={0} // Update based on your logic
              />
            );
          })}
      </div>
    </div>
  );
}
