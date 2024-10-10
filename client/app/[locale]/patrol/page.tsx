"use client";

import { useEffect, useState } from "react";
import { CreatePatrolCard, PatrolCard } from "@/components/patrol-card";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import Defect from "@/components/defect";
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
import {
  DatePicker,
  DatePickerWithRange,
} from "../../../components/date-picker";
import BadgeCustom from "@/components/badge-custom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Patrol,
  PatrolChecklist,
  patrolStatus,
  Preset,
  Profile,
} from "@/app/type";
import { User } from "@/app/type";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  const t = useTranslations("General");
  const [patrolData, setPatrolData] = useState<Patrol[]>([]);
  const [presetData, setPresetData] = useState<Preset[]>();
  const [secondDialog, setSecondDialog] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<Preset>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [patrolChecklist, setPatrolChecklist] = useState<PatrolChecklist[]>([]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isNextButtonDisabled = !selectedPreset;
  const isSubmitDisabled =
    !selectedDate ||
    !selectedPreset ||
    patrolChecklist.length !== selectedPreset.checklist.length;
  const router = useRouter();
  const onSubmit = async () => {
    if (!selectedDate || !selectedPreset || patrolChecklist.length === 0) {
      console.error("Not Empty Fields");
      return;
    }

    const payload = {
      date: selectedDate,
      presetId: selectedPreset.id,
      checklists: patrolChecklist,
    };

    try {
      const response = await fetchData("post", "/patrol", true, payload);
      setSecondDialog(false);
      router.refresh();
    } catch (error) {}
  };

  const handleSelectUser = (checklistId: number, inspectorId: number) => {
    setPatrolChecklist((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.checklistId === checklistId
      );

      if (existingIndex !== -1) {
        // If the checklist already exists, update the inspectorId
        const updatedChecklist = [...prev];
        updatedChecklist[existingIndex].inspectorId = inspectorId;
        return updatedChecklist;
      } else {
        // Add new checklist
        return [...prev, { checklistId, inspectorId }];
      }
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const patrol = await fetchData("get", "/patrols", true);
        const preset = await fetchData("get", "/presets", true);
        setPatrolData(patrol);
        setPresetData(preset);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    console.log(selectedPreset);
  }, [selectedPreset]);

  useEffect(() => {
    console.log(patrolChecklist);
  }, [patrolChecklist]);

  return (
    <div className="flex flex-col p-5 gap-y-5">
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
        />
        <DropdownMenu onOpenChange={(open) => setIsSortOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isSortOpen ? "border border-destructive" : "border-none"}`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg	">Sort</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="Doc No.">
              <DropdownMenuRadioItem value="Doc No." className="text-base">
                Doc No.
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">
                Date
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="Order">
              <DropdownMenuRadioItem value="Order" className="text-base">
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isFilterOpen ? "border border-destructive" : "border-none"}`}
          >
            {" "}
            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg	">Filter</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col justify-center gap-2 p-2">
            <div>
              <DropdownMenuLabel>Date</DropdownMenuLabel>
              <DatePickerWithRange />
            </div>
            <div>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>
                <BadgeCustom
                  width="w-full"
                  variant="blue"
                  showIcon={true}
                  iconName="hourglass_top"
                  children="Pending"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <BadgeCustom
                  width="w-full"
                  variant="yellow"
                  showIcon={true}
                  iconName="event_available"
                  children="Scheduled"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <BadgeCustom
                  width="w-full"
                  variant="purple"
                  showIcon={true}
                  iconName="cached"
                  children="On Going"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <BadgeCustom
                  width="w-full"
                  variant="green"
                  showIcon={true}
                  iconName="check"
                  children="Complete"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
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
                    <SelectItem value="Weather And Toilet">
                      Weather And Toilet
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end gap-2">
              <Button size="sm" variant="secondary">
                Reset
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Create Patrol Card with AlertDialog */}
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
                    {presetData &&
                      presetData.map((preset, index) => (
                        <Button
                          key={index} // ใช้ index เป็น key
                          variant={"outline"}
                          className={`bg-secondary grid grid-cols-1 sm:grid-cols-1 h-[300px] ${
                            selectedPreset === preset
                              ? "border-red-600"
                              : "border-transparent"
                          } border p-2`}
                          onClick={() => setSelectedPreset(preset)}
                        >
                          {/* Title */}
                          <div className="w-full flex items-start justify-start">
                            <p className="font-bold text-xl text-card-foreground truncate">
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
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-[10px]">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => setSecondDialog(true)}
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

        {/* Second AlertDialog */}
        <AlertDialog open={secondDialog}>
          <AlertDialogContent className="max-w-[995px] h-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                Patrol Preset
              </AlertDialogTitle>
              <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                Please select a preset for the patrol
              </AlertDialogDescription>
              <p className="font-semibold text-muted-foreground">Date</p>
              <DatePicker
                handleSelectedTime={(time: string) => setSelectedDate(time)}
              />
            </AlertDialogHeader>
            <div className="grid grid-cols-1">
              <p className="font-semibold text-muted-foreground">Checklist</p>
              <ScrollArea className="pr-[10px] h-[400px] w-full rounded-md pr-[15px] overflow-visible overflow-y-clip">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-[10px] ">
                  {selectedPreset?.checklist.map((presetChecklist) => (
                    <ChecklistDropdown
                      key={presetChecklist.id}
                      checklist={presetChecklist}
                      handleselectUser={(selectedUser: User) => {
                        handleSelectUser(presetChecklist.id, selectedUser.id);
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
            <AlertDialogFooter>
              <div className="flex items-end justify-end gap-[10px]">
                <AlertDialogCancel onClick={() => setSecondDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="gap-2"
                  onClick={onSubmit}
                  disabled={isSubmitDisabled}
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

        {patrolData &&
          patrolData.map((card) => {
            const { status, date, preset, checklist } = card;
            const inspectors = checklist.map((cl: any) => cl.inspector);
            return (
              <PatrolCard
                key={card.id || date}
                patrolStatus={status as patrolStatus}
                patrolDate={new Date(date)}
                patrolPreset={preset ? preset.title : "No Title"}
                patrolId={preset?.id !== undefined ? String(preset.id) : "N/A"}
                inspector={inspectors}
                items={0}
                fails={0}
                defects={0}
              />
            );
          })}
      </div>
    </div>
  );
}
