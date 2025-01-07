'use client'
import { IUser, IZone } from '@/app/type'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserDropdown from '@/components/user-dropdown'
import { fetchData } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState, useCallback } from 'react'
import Map from '@/components/map'
import TabMenu from '@/components/tab-menu'

// Utility function for generating user initials and random color
const getInitials = (name: string | undefined): string => {
  if (!name) return '';
  const nameParts = name.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[1][0]}`
    : nameParts[0].substring(0, 2);
  return initials.toUpperCase();
};

const getRandomColor = (name: string | undefined): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
  return colors[hash % colors.length];
};

const ZoneTable = ({ zones, t }: { zones: IZone[], t: any }) => (
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
          <TableCell>{zone.name}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              {zone.supervisor?.profile?.image?.path ? (
                <img
                  src={`http://localhost:4000/uploads/${zone.supervisor.profile.image.path}`}
                  alt={zone.supervisor.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className={`w-8 h-8 flex items-center justify-center text-white rounded-full ${getRandomColor(zone.supervisor?.profile?.name)}`}>
                  {getInitials(zone.supervisor?.profile?.name)}
                </div>
              )}
              <span>{zone.supervisor?.profile.name || t("No Supervisor")}</span>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function Page() {
  const t = useTranslations("General");
  const a = useTranslations("Alert");

  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const [zones, setZones] = useState<IZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  // Fetch data with useCallback to avoid unnecessary re-fetching
  const fetchDataAsync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await fetchData("get", "/users?profile=true&image=true&user=true", true);
      setUserData(users);

      const zoneData = await fetchData("get", `/location/1`, true);
      setZones(zoneData?.zones || []);
    } catch (error) {
      setError("Failed to load zones data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataAsync();
  }, [fetchDataAsync]);

  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser);
  };

  //new add
  const handleMapClick = (lat: number, lng: number, zone: IZone) => {
    setSelectedCoordinates({ lat, lng });
    setSelectedZone(zone);
  };

  //new add
  const handleSave = async () => {
    if (!selectedZone || !selectUser || !selectedCoordinates) {
      alert("Please select a zone, a supervisor, and a location.");
      return;
    }
    const dataToSend = {
      zoneId: selectedZone.id,
      supervisorId: selectUser.id,
      coordinates: selectedCoordinates
    };
    try {
      await fetchData("post", "//api", true, dataToSend);
      alert("Data saved successfully!");
    } catch (error) {
      alert("Failed to save data. Please try again.");
    }
  };

  return (
    <div>
      <div className='mb-2'>
        <TabMenu />
      </div>

      <div className="flex justify-between items-center">
        <p className="mt-6 mb-6 text-2xl font-bold">{t("Choose Zone and Supervisor")}</p>
        <Button variant="primary" size="lg" className="flex gap-2" onClick={handleSave}>
          <span className="material-symbols-outlined">save</span>
          {t("Save")}
        </Button>
      </div>

      <div className="flex gap-2 ">
        <span className="material-symbols-outlined text-muted-foreground">location_on</span>
        <p className="text-base font-semibold text-muted-foreground">{t("Zone")}</p>
      </div>

      <div className="flex justify-center items-center bg-secondary w-full rounded-md py-8">
        <Map disable={false}/>
      </div>

      <div className="flex gap-2 justify-between w-fit mt-5 mb-5">
        <div className="flex gap-1 items-center ">
          <span className="material-symbols-outlined text-muted-foreground">engineering</span>
          <p className="text-muted-foreground text-base font-semibold">{t("Supervisor")}</p>
        </div>
        <UserDropdown
          userData={userData}
          onUserSelect={handleUserSelect}
          selectUser={selectUser}
        />
      </div>

      <div>
        <p className="mb-5 text-2xl font-bold">{t("Zone")} & {t("Assigned Supervisor")}</p>

        {loading ? (
          <p>{t("Loading zones...")}</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ZoneTable zones={zones} t={t} />
        )}
      </div>
    </div>
  );
}
