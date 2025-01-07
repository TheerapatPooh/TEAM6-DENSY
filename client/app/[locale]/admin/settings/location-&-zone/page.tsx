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
import TabMenu from "@/components/tab-menu";

export default function Page() {
  const t = useTranslations("General");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");

  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const [zones, setZones] = useState<IZone[]>([]); // Zones state
  const [selectZone, setSelectZone] = useState<IZone | null>(null); // Select zone state

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch users
        const users = await fetchData(
          "get",
          "/users?profile=true&image=true&user=true&role=supervisor",
          true
        );
        setUserData(users);
        // Fetch zone data.
        const zoneData = await fetchData("get", `/location/1`, true);
        setZones(zoneData?.zones); // Ensure the response contains the "zones" array, or empty array if not
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);


  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser); // Set Select user
  };

  const handleZoneSelect = (zone: IZone) => {
    setSelectZone(zone); // Set Select Zone
  };


  const handleSave = async () => {
    if (!selectZone || !selectUser) {
      alert("Please select a zone, a supervisor, and a location.");
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
        // Update zones state with the new response
        setZones((prevZones) => {
          return prevZones.map((zone) =>
            zone.id === res.id ? res : zone 
          );
        });

        // Reset selections
        setSelectUser(null);
        setSelectZone(null);

      } 
      setSelectUser(null)
      setSelectZone(null)
      alert("Data saved successfully!");
    } catch (error) {
      alert("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
          <span className="material-symbols-outlined text-muted-foreground">location_on</span>
          <p className="text-base font-semibold text-muted-foreground">{t("Zone")}</p>
        </div>

        <div className="flex justify-center items-center bg-secondary w-full rounded-md py-8">
          <Map disable={false} toggle={true} onZoneSelect={(zones) => handleZoneSelect(zones[0])}
          />
        </div>

        <div className="flex gap-2 justify-between w-fit">
          <div className="flex gap-1 items-center ">
            <span className="material-symbols-outlined text-muted-foreground">engineering</span>
            <p className="text-muted-foreground text-base font-semibold">{t("Supervisor")}</p>
          </div>
          <UserDropdown
            color="secondary"
            userData={userData}
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
                {t("Supervisor")}
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
                    <>
                      {/* Check if supervisor has an image */}
                      <Avatar className="custom-shadow h-[35px] w-[35px]">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${zone.supervisor.profile.image?.path}`}
                        />
                        <AvatarFallback>
                          {getInitials(zone.supervisor.profile.name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Supervisor Name */}
                      <p>{zone.supervisor.profile.name}</p>
                    </>
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
