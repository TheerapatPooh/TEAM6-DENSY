/**
 * คำอธิบาย:
 *  หน้าสร้าง Preset ในระบบ โดยสามารถเพิ่ม Checklist ที่มีอยู่ในระบบเข้าไปใน Preset ได้
 * Input:
 * - ไม่มี
 * Output:
 * - หน้าสร้าง Preset ในระบบ โดยสามารถเพิ่ม Checklist ที่มีอยู่ในระบบเข้าไปใน Preset ได้
 * - สามารถเพิ่ม Checklist ใหม่เข้าไปใน Preset ได้
 * - สามารถลบ Checklist ออกจาก Preset ได้
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
import { IChecklist, IItem, IItemZone } from "@/app/type";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import { useRouter } from "next/navigation";
import { UserTooltip } from "@/components/user-tooltip";

export default function PatrolPresetCreatePage() {
  const [allChecklists, setAllChecklists] = useState<[]>([]);
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
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [checklistError, setChecklistError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const handleOpenDialog = () => {
    setIsAlertOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAlertOpen(false);
  };

  const navigatorToLocale = () => {
    router.push(`/${locale}/admin/settings/patrol-preset`);
  };

  const handleGoToCreateChecklist = () => {
    router.push(`/${locale}/admin/settings/patrol-checklist/create`);
  };

  const getAllChecklists = async () => {
    try {
      const allData = await fetchData("get", "/checklists", true);
      setAllChecklists(allData);
    } catch (error) {
      console.error("Failed to fetch all defect:", error);
    }
  };

  const handleSelectChecklists = (checklistId: number) => {
    setTempSelectChecklists((prev) => {
      if (prev.includes(checklistId)) {
        return prev.filter((id) => id !== checklistId);
      } else {
        return [...prev, checklistId];
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

  const handleCreatePreset = async () => {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (
      !formPreset.title ||
      !formPreset.description ||
      !selectChecklists ||
      selectChecklists.length === 0
    ) {
      setTitleError(!formPreset.title ? a("CreatePresetMissingTitle") : null);
      setDescriptionError(
        !formPreset.description ? a("CreatePresetMissingDescription") : null
      );
      setChecklistError(
        !selectChecklists || selectChecklists.length === 0
          ? a("CreatePresetMissingChecklist")
          : null
      );

      toast({
        variant: "error",
        title: a("ReportDefectMissingField"),
        description: !formPreset.title
          ? a("CreatePresetMissingTitle")
          : !formPreset.description
          ? a("CreatePresetMissingDescription")
          : !selectChecklists || selectChecklists.length === 0
          ? a("CreatePresetMissingChecklist")
          : null,
      });

      return false; // บอกว่าไม่สำเร็จ
    }

    // ถ้าข้อมูลผ่าน validation
    let data = {
      title: formPreset.title,
      description: formPreset.description,
      checklists: selectChecklists,
    };

    try {
      const response = await fetchData("post", `/preset`, true, data);

      if (response?.error) {
        // Handle API error
        console.error("API Error:", response.status, response.data);
        toast({
          variant: "error",
          title: a("CreatePresetFailTitle"),
          description: `${a("CreatePresetFailDescription")} ${
            formPreset.title
          } ${a("AlreadyExists")}`,
        });
        return;
      }

      // ถ้าสำเร็จ
      toast({
        variant: "success",
        title: a("CreatePresetTitleSuccess"),
        description: a("CreatePresetDescriptionSuccess"),
      });

      // ล้าง error ต่างๆ
      setTitleError(null);
      setDescriptionError(null);
      setChecklistError(null);

      return true; // บอกว่าสำเร็จ
    } catch (error) {
      console.error("Error Creating Preset:", error);
      return false; // ไม่สำเร็จ
    }
  };

  useEffect(() => {
    getAllChecklists();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-card px-6 py-4 rounded-md custom-shadow">
      {/* create patrol preset and button */}
      <div className="flex flex-row justify-between mb-4">
        <div className="text-2xl font-bold">{t("CreatePatrolPreset")}</div>

        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setTitleError(null);
              setDescriptionError(null);
              setChecklistError(null);
              navigatorToLocale();
            }}
          >
            {t("Cancel")}
          </Button>

          <Button variant="primary" onClick={() => handleOpenDialog()}>
            <span className="material-symbols-outlined">add</span>
            {t("Create")}
          </Button>
        </div>
      </div>

      {/* title */}
      <div className="flex flex-col mb-4">
        <div className="text-muted-foreground font-semibold mb-2">
          {t("Title")}
        </div>
        <Input
          name="title"
          value={formPreset.title}
          className="bg-secondary w-72 border-none text-xl"
          placeholder={t("EnterPresetTitle")}
          onChange={handleInputChange}
        />
        {titleError && (
          <p className="text-sm font-light text-destructive italic mt-1">
            {titleError}
          </p>
        )}
      </div>

      {/* description */}
      <div className="flex flex-col mb-4">
        <div className="text-muted-foreground font-semibold mb-2">
          {t("Description")}
        </div>
        <div>
          <Textarea
            name="description"
            value={formPreset.description}
            className="bg-secondary custom-shadow border-none text-xl h-44"
            placeholder={t("EnterPresetDescription")}
            onChange={handleInputChange}
          />
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
            <AlertDialogContent className="px-6 py-4">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  {t("ChecklistGroup")}
                </AlertDialogTitle>
                <AlertDialogDescription className="flex items-start justify-start text-base text-border">
                  {t("ChecklistGroupDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {allChecklists.length ? (
                <>
                  <ScrollArea className="h-[400px] overflow-y-auto rounded-lg w-full">
                    {allChecklists.map((checklist: IChecklist) => {
                      return (
                        <div className="flex flex-row justify-between bg-secondary px-6 py-4 mb-2 rounded-lg custom-shadow">
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
                              value={checklist.id}
                              checked={tempSelectChecklists.includes(
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
                          <AlertDialogAction
                            className="bg-primary "
                            onClick={() => {
                              handleGoToCreateChecklist();
                            }}
                          >
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
                                              <span className="material-symbols-outlined text-muted-foreground">
                                                location_on
                                              </span>
                                              <p className="font-semibold text-lg text-muted-foreground">
                                                {t("Zone")}
                                              </p>
                                              <p className="text-lg">
                                                {z(itemZone.zone.name)}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="material-symbols-outlined text-muted-foreground">
                                                engineering
                                              </span>
                                              <p className="font-semibold text-lg text-muted-foreground">
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
          title={a("CreatePresetTitle")}
          description={a("CreatePresetDescription")}
          primaryButtonText={t("Confirm")}
          primaryIcon="check"
          secondaryButtonText={t("Cancel")}
          backResult={async (result) => {
            if (result) {
              //  เรียก handleCreatePreset แล้วเช็คว่า validation ผ่านหรือไม่
              const success = await handleCreatePreset();
              if (success) {
                // ถ้า validation ผ่านและ API สร้าง Preset สำเร็จ => navigate
                navigatorToLocale();
              }
              // ถ้าไม่ผ่านหรือ API error => อยู่หน้า Create ต่อ
            }
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
}
