/**
 * คำอธิบาย:
 *  หน้าตั้งค่า Preset ในระบบ โดยสามารถแก้ไข Preset ที่มีอยู่ในระบบได้
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงหน้าตั้งค่า Preset ในระบบ โดยสามารถแก้ไข Preset ที่มีอยู่ในระบบได้
 * - สามารถเพิ่ม Checklist ใหม่เข้าไปใน Preset ได้
 * - สามารถแก้ไข Title และ Description ของ Preset ได้
 **/

"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BadgeCustom from "@/components/badge-custom";
import Loading from "@/components/loading";
import { fetchData, getInitials, getItemTypeVariant } from "@/lib/utils";
import { IChecklist, IItem, IItemZone, IPreset } from "@/app/type";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import { UserTooltip } from "@/components/user-tooltip";

export default function page() {
  const [allChecklists, setAllChecklists] = useState<[]>([]);
  const [presetData, setPresetData] = useState<IPreset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectChecklists, setSelectChecklists] = useState<number[]>([]);
  const [tempSelectChecklists, setTempSelectChecklists] = useState<number[]>(
    []
  );
  const [formPreset, setFormPreset] = useState({
    title: "",
    description: "",
    checklists: [],
  });

  const param = useParams();
  const router = useRouter();

  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [checklistError, setChecklistError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const locale = useLocale();

  const getAllChecklists = async () => {
    try {
      const allData = await fetchData("get", "/checklists", true);
      setAllChecklists(allData);
    } catch (error) {
      console.error("Failed to fetch all defect:", error);
    }
  };

  const getPresetData = async () => {
    try {
      const data = await fetchData("get", `/preset/${param.id}`, true);
      setPresetData(data);
      setFormPreset({
        title: data.title || "",
        description: data.description || "",
        checklists: data.presetChecklists || [],
      });
      setSelectChecklists(
        data.presetChecklists.map((preset) => preset.checklist.id)
      );
      setTempSelectChecklists(
        data.presetChecklists.map((preset) => preset.checklist.id)
      );
    } catch (error) {
      console.error("Failed to fetch defect data:", error);
    }
  };

  const handleSelectChecklists = (checklistId: number) => {
    setTempSelectChecklists((prev) => {
      if (prev.includes(checklistId)) {
        return prev.filter((id) => id !== checklistId);
      } else {
        const newList = [...prev, checklistId];
        return newList.sort((a, b) => a - b);
      }
    });
  };

  const handleDoneChecklist = () => {
    const flatChecklists = tempSelectChecklists.flat(Infinity);
    setSelectChecklists(flatChecklists);
  };

  const handleRemoveChecklist = (checklistId: number) => {
    setSelectChecklists((prev) => prev.filter((id) => id !== checklistId));
    setTempSelectChecklists((prev) => prev.filter((id) => id !== checklistId));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormPreset((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseDialog = () => {
    setIsAlertOpen(false);
  };

  const handleEditPreset = async () => {
    // Validation: ตรวจสอบว่าข้อมูลที่กรอกครบถ้วนหรือไม่
    if (
      !formPreset.description ||
      !selectChecklists ||
      selectChecklists.length === 0
    ) {
      setDescriptionError(
        !formPreset.description ? a("EditPresetMissingDescription") : null
      );
      setChecklistError(
        !selectChecklists || selectChecklists.length === 0
          ? a("EditPresetMissingChecklist")
          : null
      );
      toast({
        variant: "error",
        title: a("ReportDefectMissingField"),
        description: !formPreset.description
          ? a("EditPresetMissingDescription")
          : !selectChecklists || selectChecklists.length === 0
          ? a("EditPresetMissingChecklist")
          : null,
      });
      return;
    }

    // Prepare data ที่จะส่งไป update
    const data = {
      title: formPreset.title,
      description: formPreset.description,
      checklists: selectChecklists,
    };

    // สร้าง object เปรียบเทียบข้อมูลเดิมจาก presetData
    const originalchecklists = presetData.presetChecklists.map(
      (preset) => preset.checklist.id
    );

    // ถ้ามีการเปลี่ยนแปลง ให้ดำเนินการอัปเดต
    try {
      if (
        formPreset.description === presetData.description &&
        JSON.stringify(selectChecklists) === JSON.stringify(originalchecklists)
      ) {
        toast({
          variant: "default",
          title: a("ProfileNoChangeTitle"),
          description: a("ChecklistNoChangeDescription"),
        });
        return;
      }
      const response = await fetchData(
        "put",
        `/preset/${param.id}`,
        true,
        data
      );
      if (response?.error) {
        toast({
          variant: "error",
          title: a("FailEditChecklist"),
          description: `${response.data.message}`,
        });
        return;
      }

      // ถ้า update สำเร็จ
      toast({
        variant: "success",
        title: a("EditPresetTitleSuccess"),
        description: a("EditPresetDescriptionSuccess"),
      });
      // เคลียร์ error state
      setTitleError(null);
      setDescriptionError(null);
      setChecklistError(null);

      router.push(`/${locale}/admin/settings/patrol-preset`);
    } catch (error) {
      console.error("Error Edited Preset:", error);
    }
  };

  useEffect(() => {
    getAllChecklists();
    getPresetData();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-card px-6 py-4 rounded-md custom-shadow">
      {/* Edit patrol preset and button */}
      <div className="flex flex-row justify-between mb-4">
        <div className="text-2xl font-bold">{t("EditPatrolPreset")}</div>

        <div className="flex flex-row gap-2">
          <Button onClick={() => window.history.back()} variant="secondary">
            {t("Cancel")}
          </Button>

          <Button
            onClick={() => {
              // เปิด dialog ยืนยันการแก้ไข
              setDialogType("edit");
              setIsDialogOpen(true);
            }}
            className="flex gap-2 justify-center items-center"
            variant="primary"
          >
            <span className="material-symbols-outlined">save</span>
            {t("Save")}
          </Button>
        </div>

        {isDialogOpen && dialogType === "edit" && (
          <AlertCustom
            title={a("EditPatrolChecklist")}
            description={a("EditPatrolChecklistDescription")}
            primaryButtonText={t("Confirm")}
            primaryIcon="check"
            secondaryButtonText={t("Cancel")}
            backResult={(result) => {
              if (result) {
                // หากผู้ใช้ยืนยันให้เรียกฟังก์ชันแก้ไข preset
                handleEditPreset();
              }
              // ปิด dialog ไม่ว่าจะยืนยันหรือไม่
              setIsDialogOpen(false);
              setDialogType("");
            }}
          />
        )}
      </div>

      {/* title */}
      <div className="flex flex-col mb-4">
        <div className="text-base font-semibold mb-2">{t("Title")}</div>

        <div>
          <Input
            name="title"
            defaultValue={formPreset.title}
            className="bg-secondary w-72 border-none text-xl"
            placeholder="title"
            onChange={handleInputChange}
            readOnly
          ></Input>
        </div>
        {titleError && (
          <p className="text-sm font-light text-destructive italic mt-1">
            {titleError}
          </p>
        )}
      </div>

      {/* description */}
      <div className="flex flex-col mb-4">
        <div className="text-base font-semibold mb-2">{t("Description")}</div>

        <div>
          <Textarea
            name="description"
            defaultValue={formPreset.description}
            className="bg-secondary border-none text-xl h-44"
            placeholder="description"
            onChange={handleInputChange}
          ></Textarea>
        </div>
        {descriptionError && (
          <p className="text-sm font-light text-destructive italic mt-1">
            {descriptionError}
          </p>
        )}
      </div>

      {/* new checklist */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <div className="text-2xl font-bold">{t("Checklist")}</div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-8 h-8" variant="primary">
                <span className="material-symbols-outlined">add</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  {t("ChecklistGroup")}
                </AlertDialogTitle>
                <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                  {t("ChecklistGroupDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {allChecklists ? (
                <>
                  <ScrollArea className="h-[400px] overflow-y-auto rounded-lg w-full">
                    {allChecklists.map((checklist: IChecklist) => {
                      return (
                        <div className="flex flex-row justify-between bg-secondary px-6 py-4 mb-2 rounded-lg">
                          <div>
                            <div className="flex text-base gap-1 mb-2 ">
                              <span className="material-symbols-outlined">
                                history
                              </span>
                              {t("Version")} {checklist.version}
                            </div>

                            <div className="text-2xl font-bold">
                              {checklist.title}
                            </div>
                          </div>

                          <div className="flex justify-center items-center">
                            <Checkbox
                              key={checklist.id}
                              defaultChecked={tempSelectChecklists.includes(
                                checklist.id
                              )}
                              className="bg-card"
                              onCheckedChange={() =>
                                handleSelectChecklists(checklist.id)
                              }
                            ></Checkbox>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                  <AlertDialogFooter>
                    <div className="flex items-end justify-end gap-[10px]">
                      <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-primary"
                        onClick={handleDoneChecklist}
                      >
                        {t("Done")}
                      </AlertDialogAction>
                    </div>
                  </AlertDialogFooter>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex flex-col justify-center items-center h-[400px] gap-4">
                      <div className="text-2xl font-semibold">
                        {t("EmptyChecklist")}
                      </div>
                      <AlertDialogFooter>
                        <div className="flex gap-[10px]">
                          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                          <AlertDialogAction className="bg-primary">
                            {t("Sure")}
                          </AlertDialogAction>
                        </div>
                      </AlertDialogFooter>
                    </div>
                  </div>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {checklistError && (
          <p className="text-sm font-light text-destructive italic mt-1">
            {checklistError}
          </p>
        )}
      </div>

      {/* checklist info */}
      {selectChecklists.map((checklistId: number) => {
        return allChecklists.map((checklist: IChecklist) => {
          if (checklist.id === checklistId) {
            return (
              <div className="px-6 py-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <div className="flex flex-row gap-1 text-base">
                      <span className="material-symbols-outlined">history</span>
                      {t("Version")} {checklist.version}
                    </div>
                    <div className="flex flex-col">
                      <AccordionTrigger className="flex flex-row justify-between hover:no-underline">
                        <div className="flex flex-row text-2xl font-bold">
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveChecklist(checklist.id)}
                          >
                            <span className="material-symbols-outlined flex justify-center items-center text-destructive">
                              delete
                            </span>
                          </Button>
                          {checklist.title}
                        </div>
                      </AccordionTrigger>

                      {checklist.items.map((item: IItem) => {
                        return (
                          <AccordionContent>
                            <Accordion type="single" collapsible>
                              <AccordionItem
                                value="item-1"
                                className="border-none px-6"
                              >
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center justify-between w-full pe-2">
                                    <p className="text-xl font-semibold">
                                      {item.name}
                                    </p>
                                    {(() => {
                                      const { iconName, variant } =
                                        getItemTypeVariant(item.type);
                                      return (
                                        <BadgeCustom
                                          variant={variant}
                                          showIcon={true}
                                          shape={"square"}
                                          iconName={iconName}
                                        >
                                          {s(item.type)}
                                        </BadgeCustom>
                                      );
                                    })()}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4">
                                  {item.itemZones.map((itemZone: IItemZone) => {
                                    return (
                                      <div
                                        key={itemZone.zone.id}
                                        className="bg-background rounded-md px-4 py-2"
                                      >
                                        <div className="flex flex-row justify-between items-center">
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="material-symbols-outlined">
                                                location_on
                                              </span>
                                              <p className="font-semibold text-lg">
                                                {t("Zone")}
                                              </p>
                                              <p className="text-lg">
                                                {z(itemZone.zone.name)}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="material-symbols-outlined">
                                                badge
                                              </span>
                                              <p className="font-semibold text-lg">
                                                {t("supervisor")}
                                              </p>
                                              <div className="flex flex-row items-center">
                                                <UserTooltip
                                                  user={
                                                    itemZone.zone.supervisor
                                                  }
                                                >
                                                  <Avatar className="mr-1 h-[35px] w-[35px] custom-shadow">
                                                    <AvatarImage />
                                                    <AvatarFallback
                                                      id={itemZone.zone.supervisor.id.toString()}
                                                    >
                                                      {getInitials(
                                                        itemZone.zone.supervisor
                                                        .profile.name
                                                      )}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                </UserTooltip>
                                                <p className="text-lg">
                                                  {
                                                    itemZone.zone.supervisor
                                                      .profile.name
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex gap-2 pe-2">
                                            <Button
                                              variant="secondary"
                                              className="w-[155px] cursor-not-allowed opacity-50"
                                            >
                                              <span className="material-symbols-outlined">
                                                check
                                              </span>
                                              {t("Yes")}
                                            </Button>
                                            <Button
                                              variant="secondary"
                                              className="w-[155px] cursor-not-allowed opacity-50"
                                            >
                                              <span className="material-symbols-outlined">
                                                close
                                              </span>
                                              {t("No")}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </AccordionContent>
                        );
                      })}
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          }
        });
      })}

      {isAlertOpen && (
        <AlertCustom
          title={a("EditPresetTitle")}
          description={a("EditPresetDescription")}
          primaryButtonText={t("Confirm")}
          primaryIcon="check"
          secondaryButtonText={t("Cancel")}
          backResult={(backResult) => {
            if (backResult) {
              handleEditPreset();
            }
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
}
