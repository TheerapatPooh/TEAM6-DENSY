"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import { fetchData, formatTime } from "@/lib/utils";
import { IChecklist, IDefect, IItem, IZone } from "@/app/type";
import { useParams } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { AlertCustom } from "@/components/alert-custom";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { tree } from "next/dist/build/templates/app-page";

export default function Page() {
  const params = useParams();
  const [checklistData, setChecklistData] = useState<IChecklist>();
  const [allZone, setAllZone] = useState([]);
  const [openStatesZone, setOpenStatesZone] = useState<{
    [key: number]: boolean;
  }>({});
  const [openStatesType, setOpenStatesType] = useState<{
    [key: number]: boolean;
  }>({});

  const [title, setTitle] = useState("");
  const [items, setItems] = useState<itemWithZonesName[]>([]);
  const [selectedChecklistName, setSelectedChecklistName] = useState<{
    [itemId: number]: string;
  }>({});
  const [selectedZones, setSelectedZones] = useState<{
    [itemId: number]: number[];
  }>({});
  const [selectedType, setSelectedType] = useState<{
    [itemId: number]: string;
  }>({});

  interface itemWithZonesName extends IItem {
    zones?: any[];
  }
  const handleOpenChangeZone = (itemId: number, isOpen: boolean) => {
    setOpenStatesZone((prev) => ({
      ...prev,
      [itemId]: isOpen, // Update the open state for the specific item
    }));
  };
  const handleOpenChangeType = (itemId: number, isOpen: boolean) => {
    setOpenStatesType((prev) => ({
      ...prev,
      [itemId]: isOpen, // Update the open state for the specific item
    }));
  };
  const handleZoneChange = (itemId: number, zoneId: number) => {
    setSelectedZones((prev) => {
      const currentZones = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: currentZones.includes(zoneId)
          ? currentZones.filter((id) => id !== zoneId)
          : [...currentZones, zoneId],
      };
    });
  };

  const handleTypeChange = (itemId: number, type: string) => {
    setSelectedType((prev) => {
      const currentType = prev[itemId] || "";
      return {
        ...prev,
        [itemId]: currentType === type ? "" : type,
      };
    });
  };

  const handleNameChange = (itemId: number, name: string) => {
    setSelectedChecklistName((prev) => {
      const currentName = prev[itemId] || "";
      return {
        ...prev,
        [itemId]: currentName === name ? "" : name,
      };
    });
  };
  const generateUniqueId = () => {
    let newId;
    const existingIds = items.map(item => item.id); // Collect all existing IDs
  
    do {
      newId = Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000
    } while (existingIds.includes(newId)); // Ensure the ID is not a duplicate
  
    return newId;
  };

  const handleAddChecklistItem = () => {
    const newItemId = generateUniqueId()
    const newItem: itemWithZonesName = {
      id: newItemId,
      name: "",
      type: "",
      zones: [],
      checklistId: newItemId,
      itemZones: []
    };

   
  
    setItems((prev) => [...prev, newItem]); // Add the new item to the items list
    setSelectedChecklistName((prev) => ({
      ...prev,
      [newItemId]: "",
    })); // Initialize name state
    setSelectedZones((prev) => ({
      ...prev,
      [newItemId]: [],
    })); // Initialize zones state
    setSelectedType((prev) => ({
      ...prev,
      [newItemId]: "",
    })); // Initialize type state
  };
  
  useEffect(() => {
    const getData = async () => {
      try {
        const checklistData = await fetchData(
          "get",
          `/checklist/${params.id}`,
          true
        );
        const zonesData = await fetchData("get", `/zones`, true);

        setAllZone(zonesData);
        setChecklistData(checklistData);
        setTitle(checklistData.title);
        setItems(checklistData.items || []);

        const defaultSelectedType: { [itemId: number]: string } = {};
        const defaultSelectedZones: { [itemId: number]: number[] } = {};
        const defaultSelectedName: { [itemId: number]: string } = {};
        checklistData.items.forEach((item: any) => {
          if (item.itemZones) {
            defaultSelectedZones[item.id] = item.itemZones.map(
              (itemZone: any) => itemZone.zone.id
            );
          }
          if (item.name) {
            defaultSelectedName[item.id] = item.name;
          }
          // Set default type for each item
          if (item.type) {
            defaultSelectedType[item.id] = item.type;
          }
        });

        setSelectedZones(defaultSelectedZones);
        setSelectedType(defaultSelectedType);
        setSelectedChecklistName(defaultSelectedName);
        console.log("Default Selected Zones:", defaultSelectedZones);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };

    getData();
  }, [params.id]);


  const handleDeleteItem = (id: number) => {
    // Remove the item from the `items` array
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  
    // Remove the corresponding entry from `selectedChecklistName`
    setSelectedChecklistName(prevChecklistName => {
      const { [id]: _, ...remaining } = prevChecklistName;
      return remaining;
    });
  
    // Remove the corresponding entry from `selectedZones`
    setSelectedZones(prevZones => {
      const { [id]: _, ...remaining } = prevZones;
      return remaining;
    });
  
    // Remove the corresponding entry from `selectedType`
    setSelectedType(prevType => {
      const { [id]: _, ...remaining } = prevType;
      return remaining;
    });
  };
  

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "safety":
        return "green";
      case "environment":
        return "blue";
      case "maintenance":
        return "red";
      default:
        return "secondary";
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "safety":
        return "verified_user";
      case "environment":
        return "psychiatry";
      case "maintenance":
        return "build";
      default:
        return "";
    }
  };

  const combineChecklistData = () => {
    const combinedData = {
      title: title,
      items: items.map((item) => ({
        name: selectedChecklistName[item.id] || "", // Retrieve name based on item.id
        type: selectedType[item.id] || "", // Retrieve type based on item.id
        zoneId: selectedZones[item.id] || [], // Retrieve zoneId array based on item.id
      })),
    };
  
    console.log(combinedData); // This will give you the combined structure
    return combinedData;
  };
  
  const handleUpdateChecklist = () => {
    const dataToUpdate = combineChecklistData();
    console.log(dataToUpdate)
    try {
       fetchData("put", `/checklist/${params.id}`, true, dataToUpdate);
      console.log("Checklist updated successfully");
    } catch (error) {
      console.error("Failed to update checklist:", error);
    }
  };
  return (
    <div className=" p-4 ">
      <div className="m bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">Edit Patrol Checklist</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="secondary">Cancel</Button>
            <Button onClick={()=>{handleUpdateChecklist()}} className="flex gap-2 justify-center items-center" variant="primary">
              <span className="material-symbols-outlined">save</span>Save
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[360px] mt-1 p-2 bg-secondary text-base font-semibold text-muted-foreground rounded-md"
            placeholder="Enter Checklist title"
          />
        </div>
        <div>
          <div className="flex flex-row  gap-2 p-2">
            <div className="text-2xl font-semibold">List</div>
            <Button onClick={handleAddChecklistItem} className="w-[32px] h-[32px] bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <span className="material-symbols-outlined">add</span>
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-5/16">Item</TableHead>
              <TableHead className=" w-5/16">Type</TableHead>
              <TableHead className=" w-5/16">Zone</TableHead>
              <TableHead className=" w-3/16 "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item,index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="text"
                    value={selectedChecklistName[item.id]}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="w-[360px] mt-1 p-2 bg-secondary rounded-md text-base font-semibold text-muted-foreground"
                    placeholder="Enter Item title"
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    open={openStatesType[item.id] || false} // Open state for this dropdown
                    onOpenChange={(isOpen) =>
                      handleOpenChangeType(item.id, isOpen)
                    } // Update open state on change
                  >
                    <DropdownMenuTrigger className="flex items-center gap-2 w-full px-4 py-2 rounded cursor-pointer">
                      <ChevronDownIcon
                        className={`transition-transform duration-200 ${
                          openStatesType[item.id] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      <BadgeCustom
                        shape="square"
                        iconName={getBadgeIcon(selectedType[item.id])}
                        variant={getBadgeVariant(selectedType[item.id])}
                        showIcon
                      >
                        {selectedType[item.id]
                          ? selectedType[item.id]
                          : "Selected an Type"}
                      </BadgeCustom>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="bottom"
                      className=" bg-white border border-gray-200 shadow-lg rounded  p-2"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          handleTypeChange(item.id, "safety");
                        }}
                      >
                        <BadgeCustom
                          shape="square"
                          iconName="verified_user"
                          variant="green"
                          showIcon
                        >
                          safety
                        </BadgeCustom>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleTypeChange(item.id, "environment");
                        }}
                      >
                        <BadgeCustom
                          shape="square"
                          iconName="psychiatry"
                          variant="blue"
                          showIcon
                        >
                          environment
                        </BadgeCustom>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleTypeChange(item.id, "maintenance");
                        }}
                      >
                        <BadgeCustom
                          shape="square"
                          iconName="build"
                          variant="red"
                          showIcon
                        >
                          maintenance
                        </BadgeCustom>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    key={item.id}
                    open={openStatesZone[item.id] || false} // Open state for this dropdown
                    onOpenChange={(isOpen) =>
                      handleOpenChangeZone(item.id, isOpen)
                    } // Update open state on change
                  >
                    <DropdownMenuTrigger className="flex items-center gap-2 w-full px-4 py-2 truncate rounded cursor-pointer">
                      <ChevronDownIcon
                        className={`transition-transform duration-200 ${
                          openStatesZone[item.id] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      <p className="w-[305px] truncate text-base font-semibold text-muted-foreground text-center">
                        {selectedZones[item.id]?.length > 0
                          ? selectedZones[item.id]
                              .map(
                                (zoneId) =>
                                  allZone.find((zone) => zone.id === zoneId)
                                    ?.name
                              )
                              .join(", ")
                          : "Select Zones"}
                      </p>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      side="bottom"
                      className="bg-white border border-gray-200 shadow-lg rounded w-64 p-2"
                    >
                      <ScrollArea className="h-72 rounded-md">
                        {allZone.map((zone) => (
                          <DropdownMenuItem
                            key={zone.id}
                            className="flex items-center gap-2 cursor-default"
                            onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedZones[item.id]?.includes(zone.id) ||
                                false
                              }
                              onChange={() =>
                                handleZoneChange(item.id, zone.id)
                              }
                            />
                            <p className="truncate">{zone.name}</p>
                          </DropdownMenuItem>
                        ))}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell onClick={()=>{handleDeleteItem(item.id)}} className=" cursor-pointer">
                  <span className="material-symbols-outlined text-destructive ">
                    delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
