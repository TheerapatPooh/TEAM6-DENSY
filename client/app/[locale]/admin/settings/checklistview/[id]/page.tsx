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
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
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
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Page() {
  const z = useTranslations("Zone");

  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
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
  const handleZoneChange = (itemId: number, zones: IZone[]) => {
    setSelectedZones((prev) => {
      const zoneIds = zones.map((zone) => zone.id); // Get only the IDs
      return {
        ...prev,
        [itemId]: zoneIds, // Update only for the relevant itemId
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
    const existingIds = items.map((item) => item.id); // Collect all existing IDs

    do {
      newId = Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000
    } while (existingIds.includes(newId)); // Ensure the ID is not a duplicate

    return newId;
  };

  const handleAddChecklistItem = () => {
    const newItemId = generateUniqueId();
    const newItem: itemWithZonesName = {
      id: newItemId,
      name: "",
      type: undefined,
      zones: [],
      checklistId: newItemId,
      itemZones: [],
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
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    // Remove the corresponding entry from `selectedChecklistName`
    setSelectedChecklistName((prevChecklistName) => {
      const { [id]: _, ...remaining } = prevChecklistName;
      return remaining;
    });

    // Remove the corresponding entry from `selectedZones`
    setSelectedZones((prevZones) => {
      const { [id]: _, ...remaining } = prevZones;
      return remaining;
    });

    // Remove the corresponding entry from `selectedType`
    setSelectedType((prevType) => {
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

  const [error, setError] = useState<{
    title: boolean;
    items: boolean;
    itemsField: boolean;
  }>({
    title: false,
    items: false,
    itemsField: false,
  });

  const validateChecklistData = (data: any) => {
    let hasError = false;

    // Validate title
    if (!data.title || data.title.trim() === "") {
      toast({
        variant: "error",
        title: "Validation Error",
        description: "The title field must not be empty.",
      });
      setError((prev) => ({ ...prev, title: true }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, title: false }));
    }

    // Validate items list
    if (!data.items || data.items.length === 0) {
      toast({
        variant: "error",
        title: "Validation Error",
        description: "The items list must not be empty.",
      });
      setError((prev) => ({ ...prev, items: true }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, items: false }));
    }

    // Validate individual items
    for (const item of data.items) {
      if (!item.name || item.name.trim() === "") {
        toast({
          variant: "error",
          title: "Validation Error",
          description: "Each item must have a name.",
        });
        setError((prev) => ({ ...prev, itemsField: true }));
        hasError = true;
        break;
      }
      if (!item.type || item.type.trim() === "") {
        toast({
          variant: "error",
          title: "Validation Error",
          description: "Each item must have a type.",
        });
        setError((prev) => ({ ...prev, itemsField: true }));
        hasError = true;
        break;
      }
      if (!Array.isArray(item.zoneId) || item.zoneId.length === 0) {
        toast({
          variant: "error",
          title: "Validation Error",
          description: "Each item must have at least one zone selected.",
        });
        setError((prev) => ({ ...prev, itemsField: true }));
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      setError({ title: false, items: false, itemsField: false });
    }

    return !hasError; // Return true if there are no errors
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

  const handleEditPatrolChecklistDialog = async () => {
    const dataToUpdate = combineChecklistData();
    console.log("Data to Update:", dataToUpdate);

    const normalizedChecklistItems = checklistData.items.map((item: any) => ({
      name: item.name,
      type: item.type,
      zoneId: item.itemZones.map((zone: any) => zone.zone.id),
    }));

    if (!validateChecklistData(dataToUpdate)) {
      return;
    }

    if (
      JSON.stringify(dataToUpdate.items) ===
      JSON.stringify(normalizedChecklistItems)
    ) {
      toast({
        variant: "default",
        title: "No Changes Detected",
        description: "No changes were made to the Patrol Checklist.",
      });
      return;
    }
    setPendingAction(() => () => handleEditChecklist());
    setDialogType("edit");
    setIsDialogOpen(true);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
      setDialogType(""); // Reset the dialog type after action is completed
    }
  };

  const handleEditChecklist = async () => {
    const dataToUpdate = combineChecklistData();
    console.log("Data to Update:", dataToUpdate);
    try {
      const response = await fetchData(
        "put",
        `/checklist/${params.id}`,
        true,
        dataToUpdate
      );

      if (response?.error) {
        // Handle API error
        console.error("API Error:", response.status, response.data);
        toast({
          variant: "error",
          title: "Fail to Edit Patrol Checklist",
          description: `${response.data.message}`,
        });
        return;
      }

      // Handle successful response
      console.log("Success Response:", response);
      toast({
        variant: "success",
        title: "Edit Patrol Checklist Successfully",
        description: `Patrol Checklist ${dataToUpdate.title} has been Edited`,
      });
      router.push(`/${locale}/admin/settings/patrol-checklist`);
    } catch (error: any) {
      console.error("Unexpected Error:", error);
    }
  };

  return (
    <div className=" p-4 ">
      <div className="m bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">Edit Patrol Checklist</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEditPatrolChecklistDialog();
              }}
              className="flex gap-2 justify-center items-center"
              variant="primary"
            >
              <span className="material-symbols-outlined">save</span>Save
            </Button>
            {isDialogOpen && dialogType === "edit" && (
              <AlertCustom
                title={"Are you sure to edit Patrol Checklist?"}
                description={"Please confirm to edit Patrol Checklist."}
                primaryButtonText={"Confirm"}
                primaryIcon="check"
                secondaryButtonText={"Cancel"}
                backResult={(result) => handleDialogResult(result)}
              />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Title
          </label>
          <input
            disabled
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[360px] mt-1 p-2 bg-secondary text-base font-semibold text-muted-foreground rounded-md"
            placeholder="Enter Checklist title"
          />
        </div>
        <div>
          <div className="flex flex-row items-center gap-2 p-2">
            <div className="text-2xl font-semibold">List</div>
            <Button
              onClick={handleAddChecklistItem}
              className="w-[32px] h-[32px] bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <span className="material-symbols-outlined">add</span>
            </Button>
            {error.items && (
              <div className="text-destructive">
                Please add at least one item to the checklist.
              </div>
            )}
            {error.itemsField && (
              <div className="text-destructive">
                Please ensure all items have a name, type, and at least one zone
                selected.
              </div>
            )}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[30%] ">Item</TableHead>
              <TableHead className="w-[30%] ">Type</TableHead>
              <TableHead className=" w-[30%] ">Zone</TableHead>
              <TableHead className="w-[10%]  "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="text"
                    value={selectedChecklistName[item.id]}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="max-w-[350px] w-full p-2 bg-card border-none rounded-md text-base font-semibold text-muted-foreground"
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
                    <DropdownMenuTrigger className="flex items-center gap-2  max-w-[350px] w-full py-2 rounded cursor-pointer">
                      <ChevronDownIcon
                        className={`transition-transform duration-200 ${
                          openStatesType[item.id] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      <span className="text-base font-semibold text-muted-foreground ">
                        {selectedType[item.id] ? "" : "Select a Type"}
                      </span>
                      {selectedType[item.id] && (
                        <BadgeCustom
                          shape="square"
                          iconName={getBadgeIcon(selectedType[item.id])}
                          variant={getBadgeVariant(selectedType[item.id])}
                          showIcon
                        >
                          {selectedType[item.id]}
                        </BadgeCustom>
                      )}
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
                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                      className="flex items-center gap-2 rounded cursor-pointer"
                    >
                      <div className="w-[305px] overflow-hidden text-center">
                        <p className="text-base font-semibold text-muted-foreground truncate whitespace-nowrap">
                          {selectedZones[item.id]?.length > 0
                            ? selectedZones[item.id]
                                .map((zoneId) =>
                                  z(
                                    allZone.find((zone) => zone.id === zoneId)
                                      ?.name
                                  )
                                )
                                .join(", ")
                            : "Select Zones"}
                        </p>
                      </div>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="w-full sm:w-[40%] md:w-[50%] lg:w-[100%] max-w-[1200px] rounded-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl">
                          Choose Inspection Zone
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          Please select zones for inspection.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div>
                        <div className="text-muted-foreground flex items-center">
                          <span className="material-symbols-outlined">
                            location_on
                          </span>
                          Zone
                        </div>
                        <div className=" flex justify-center bg-secondary rounded-lg py-4">
                          <Map
                            disable={false}
                            onZoneSelect={(zones: IZone[]) =>
                              handleZoneChange(item.id, zones)
                            }
                            initialSelectedZones={selectedZones[item.id] || []} // Pass only zone IDs for this itemId
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogAction className="bg-primary">
                          Done
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* <DropdownMenu
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
                  </DropdownMenu> */}
                </TableCell>
                <TableCell
                  onClick={() => {
                    handleDeleteItem(item.id);
                  }}
                  className=" cursor-pointer"
                >
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
