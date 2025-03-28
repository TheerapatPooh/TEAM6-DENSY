/**
 * คำอธิบาย:
 *  หน้าตั้งค่า Zone ในระบบ โดยสามารถกำหนด Supervisor ให้กับ Zone ได้
 *  ใช้ในการดึงข้อมูล Zone และ Supervisor จาก API และแสดงผลในตาราง
 *  ผู้ใช้สามารถเลือก Zone และ Supervisor เพื่อบันทึกข้อมูลการตั้งค่า Supervisor ให้กับ Zone
 *  รองรับการแสดงผลข้อมูลผู้ใช้ที่สามารถเป็น Supervisor ในระบบ
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงหน้าตั้งค่า Zone พร้อมข้อมูล Supervisor ในระบบทั้งหมด
 * - ผู้ใช้สามารถเลือก Zone และกำหนด Supervisor ได้
 * - แสดงข้อมูลการบันทึกและอัปเดต Supervisor ให้กับ Zone
**/
"use client";
import { IUser, IZone } from "@/app/type";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDropdown from "@/components/user-dropdown";
import { fetchData, getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import Map from "@/components/map";
import Loading from "@/components/loading";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";
import { UserTooltip } from "@/components/user-tooltip";

export default function LocationAndZonePage() {
  const t = useTranslations("General");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  const [allSupervisors, setAllSupervisors] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const [zones, setZones] = useState<IZone[]>([]); // Zones state
  const [selectZone, setSelectZone] = useState<IZone | null>(null); // Select zone state

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch users
        const users = await fetchData(
          "get",
          "/users?profile=true&image=true&user=true&roles=supervisor",
          true
        );
        setAllSupervisors(users);
        // Fetch zone data.
        const zoneData = await fetchData("get", `/location/1`, true);
        setZones(zoneData?.zones); // Ensure the response contains the "zones" array, or empty array if not
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
    setMounted(true);
  }, []);

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser); // Set Select user
  };

  const handleZoneSelect = (zone: IZone) => {
    setSelectZone(zone); // Set Select Zone
  };

  const handleSave = () => {
    setPendingAction(() => () => updateSupervisor());
    handleOpenDialog();
  };

  const updateSupervisor = async () => {
    if (!selectZone || !selectUser) {
      toast({
        variant: "error",
        title: a("ZoneUpdateErrorTitle"),
        description: a("ZoneUpdateErrorDescription"),
      });
      return;
    }

    // Construct the data to send to the API
    const data = {
      userId: selectUser.id,
    };
    try {
      // Make API request to save the data
      const res = await fetchData("put", `/zone/${selectZone.id}`, true, data);
      if (res) {
        setZones((prevZones) => {
          return prevZones.map((zone) => {
            // If the current zone's supervisor id matches res's supervisor id, set supervisor to null
            if (zone.supervisor?.id === res.supervisor.id) {
              return {
                ...zone,
                supervisor: null, // Set the supervisor to null
              };
            }

            // If the zone's id matches res.id, return the updated zone (res)
            if (zone.id === res.id) {
              return res;
            }

            // Return the zone unchanged if no condition is met
            return zone;
          });
        });

        toast({
          variant: "success",
          title: a("ZoneUpdateSuccessTitle"),
          description: a("ZoneUpdateSuccessDescription"),
        });
        // Reset selections
        setSelectUser(null);
        setSelectZone(null);
      }
      setSelectUser(null);
      setSelectZone(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save data. Please try again.");
    }
  };

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      {isDialogOpen && (
        <AlertCustom
          title={a("ZoneUpdateConfirmTitle")}
          description={a("ZoneUpdateConfirmDescription")}
          primaryButtonText={t("Confirm")}
          primaryIcon="check"
          secondaryButtonText={t("Cancel")}
          backResult={handleDialogResult}
        ></AlertCustom>
      )}
      <div className="flex flex-col gap-4 py-4 px-6 bg-card rounded-md custom-shadow">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">
            {t("Choose Zone and Supervisor")}
          </p>
          <Button
            variant="primary"
            size="lg"
            className="flex gap-2"
            onClick={handleSave}
          >
            <span className="material-symbols-outlined">save</span>
            {t("Save")}
          </Button>
        </div>

        <div className="flex gap-2 ">
          <span className="material-symbols-outlined text-muted-foreground">
            location_on
          </span>
          <p className="text-base font-semibold text-muted-foreground">
            {t("Zone")}
          </p>
        </div>

        <div className="flex justify-center items-center bg-secondary w-full rounded-md py-8">
          <Map
            disable={false}
            toggle={true}
            onZoneSelect={(zones) => handleZoneSelect(zones[0])}
          />
        </div>

        <div className="flex gap-2 justify-between w-fit">
          <div className="flex gap-1 items-center ">
            <span className="material-symbols-outlined text-muted-foreground">
              engineering
            </span>
            <p className="text-muted-foreground text-base font-semibold">
              {t("supervisor")}
            </p>
          </div>
          <UserDropdown
            color="secondary"
            users={allSupervisors}
            onUserSelect={handleUserSelect}
            selectUser={selectUser}
          />
        </div>
      </div>
      <p className="text-2xl font-bold">
        {t("Zone")} & {t("Assigned Supervisor")}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex gap-3 items-center">
                {t("Zone")}
                <span className="material-symbols-outlined">location_on</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex gap-3 items-center">
                {t("supervisor")}
                <span className="material-symbols-outlined">engineering</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell>{z(zone.name)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {zone.supervisor ? (
                    // ถ้ามี zone.supervisor
                    <UserTooltip user={zone.supervisor}>
                      <div className="flex items-center gap-2">
                        {/* Check if supervisor has an image */}
                        <Avatar className="custom-shadow h-[35px] w-[35px]">
                          <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${zone.supervisor.profile.image?.path}`}
                          />
                          <AvatarFallback id={zone.supervisor.id.toString()}>
                            {getInitials(zone.supervisor.profile.name)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Supervisor Name */}
                        <p>{zone.supervisor.profile.name}</p>
                      </div>
                    </UserTooltip>
                  ) : (
                    // ถ้าไม่มี zone.supervisor
                    <p>No supervisor assigned</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
