/**
 * คำอธิบาย:
 *  หน้าแก้ไข Checklist ในระบบ
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงหน้าแก้ไข Checklist ในระบบโดยแสดงช่องกรองข้อมูลของ Checklist
 * - สามารถเพิ่ม ลบ แก้ไข Item ใน Checklist ได้
**/
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import { fetchData } from "@/lib/utils";
import { IChecklist, IItem, IZone } from "@/app/type";
import { useParams } from "next/navigation";
import { AlertCustom } from "@/components/alert-custom";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function PatrolChecklistDetailPage() {
  const z = useTranslations("Zone");
  const t = useTranslations("General");
  const a = useTranslations("Alert");
  const s = useTranslations("Status");
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [checklistData, setChecklistData] = useState<IChecklist>();
  const [allZones, setAllZones] = useState([]);
  const [openStatesType, setOpenStatesType] = useState<{
    [key: number]: boolean;
  }>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<IItemWithZonesName[]>([]);
  const [selectedChecklistName, setSelectedChecklistName] = useState<{
    [itemId: number]: string;
  }>({});
  const [selectedZones, setSelectedZones] = useState<{
    [itemId: number]: number[];
  }>({});
  const [selectedType, setSelectedType] = useState<{
    [itemId: number]: string;
  }>({});

  interface IItemWithZonesName extends IItem {
    zones?: any[];
  }
  useEffect(() => {
    // ฟังก์ชันที่ใช้เพื่ออัพเดตความกว้างหน้าจอ
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // เพิ่ม event listener สำหรับ resize
    window.addEventListener("resize", handleResize);

    // ลบ event listener เมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    const newItem: IItemWithZonesName = {
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
        if(checklistData.status === 404) {
          return router.push(`/${locale}/404`);     
        }
        const zonesData = await fetchData("get", `/zones`, true);

        setAllZones(zonesData);
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
        title: a("ValidationError"),
        description: a("ChecklistTitleMissing"),
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
        title: a("ValidationError"),
        description: a("ChecklistItemMissing"),
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
          title: a("ValidationError"),
          description: a("ItemMustName"),
        });
        setError((prev) => ({ ...prev, itemsField: true }));
        hasError = true;
        break;
      }
      if (!item.type || item.type.trim() === "") {
        toast({
          variant: "error",
          title: a("ValidationError"),
          description: a("ItemMustType"),
        });
        setError((prev) => ({ ...prev, itemsField: true }));
        hasError = true;
        break;
      }
      if (!Array.isArray(item.zoneId) || item.zoneId.length === 0) {
        toast({
          variant: "error",
          title: a("ValidationError"),
          description: a("ItemMustZone"),
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

    return combinedData;
  };

  const handleEditPatrolChecklistDialog = async () => {
    const dataToUpdate = combineChecklistData();

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
        title: a("ProfileNoChangeTitle"),
        description: a("ChecklistNoChangeDescription"),
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
          title: a("FailEditChecklist"),
          description: `${response.data.message}`,
        });
        return;
      }

      // Handle successful response
      toast({
        variant: "success",
        title: a("EditChecklistSuccess"),
        description: `${t("PatrolChecklist")} ${dataToUpdate.title} ${t(
          "HasBeenEdited"
        )}`,
      });
      router.push(`/${locale}/admin/settings/patrol-checklist`);
    } catch (error: any) {
      console.error("Unexpected Error:", error);
    }
  };

  return (
    <div className=" ">
      <div className="m bg-card py-4 px-6 rounded-lg custom-shadow">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">
            {t("EditPatrolChecklist")}
          </h1>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="secondary">
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                handleEditPatrolChecklistDialog();
              }}
              className="flex gap-2 justify-center items-center"
              variant="primary"
            >
              <span className="material-symbols-outlined">save</span>
              {t("Save")}
            </Button>
            {isDialogOpen && dialogType === "edit" && (
              <AlertCustom
                title={a("EditPatrolChecklist")}
                description={a("EditPatrolChecklistDescription")}
                primaryButtonText={t("Confirm")}
                primaryIcon="check"
                secondaryButtonText={t("Cancel")}
                backResult={(result) => handleDialogResult(result)}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col mb-4 gap-2">
          <label className="block text-base font-semibold text-muted-foreground">
            {t("Title")}
          </label>
          <Input
            name="title"
            defaultValue={title}
            className="bg-secondary w-72 border-none text-lg"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            readOnly
          />
        </div>
        <div>
          <div className="flex flex-row items-center gap-2 p-2">
            <div className="text-2xl font-semibold">{t("List")}</div>
            <Button
              onClick={handleAddChecklistItem}
              variant="primary"
              className="w-[32px] h-[32px]"
            >
              <span className="material-symbols-outlined">add</span>
            </Button>
            {error.items && (
              <div className="text-destructive">
                {a("EditChecklistItemMissing")}
              </div>
            )}
            {error.itemsField && (
              <div className="text-destructive">
                {a("EditChecklistItemMissingElement")}
              </div>
            )}
          </div>
        </div>
        <Table wrapperClassName="shadow-none">
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[30%]">{t("Item")}</TableHead>
              <TableHead className="w-[30%] ">{t("Type")}</TableHead>
              <TableHead className=" w-[30%] ">{t("Zone")}</TableHead>
              <TableHead className="w-[10%]  "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="text"
                    value={selectedChecklistName[item.id]}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="max-w-[350px] w-full p-2 placeholder:text-input bg-card border-none rounded-md "
                    placeholder={t("EnterItemTitle")}
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
                      <span className=" text-input ">
                        {selectedType[item.id] ? "" : t("SelectAType")}
                      </span>
                      {selectedType[item.id] && (
                        <BadgeCustom
                          shape="square"
                          iconName={getBadgeIcon(selectedType[item.id])}
                          variant={getBadgeVariant(selectedType[item.id])}
                          showIcon
                          hideText={windowWidth > 911 ? false : true}
                        >
                          {s(selectedType[item.id])}
                        </BadgeCustom>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="bottom"
                      className="custom-shadow rounded-md bg-card  p-2"
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
                          {s("safety")}
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
                          {s("environment")}
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
                          {s("maintenance")}
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
                        <p
                          className={`text-base truncate whitespace-nowrap ${
                            selectedZones[item.id]?.length > 0
                              ? ""
                              : "text-input"
                          }`}
                        >
                          {selectedZones[item.id]?.length > 0
                            ? selectedZones[item.id]
                                .map((zoneId) =>
                                  z(
                                    allZones.find((zone) => zone.id === zoneId)
                                      ?.name
                                  )
                                )
                                .join(", ")
                            : t("SelectZone")}
                        </p>
                      </div>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="w-full sm:w-[40%] md:w-[50%] lg:w-[100%] max-w-[1200px] rounded-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl">
                          {t("ChooseInspectionZone")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          {t("ChooseInspectionZoneDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div>
                        <div className="text-muted-foreground flex items-center">
                          <span className="material-symbols-outlined">
                            location_on
                          </span>
                          {t("Zone")}
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
                          {t("Done")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
