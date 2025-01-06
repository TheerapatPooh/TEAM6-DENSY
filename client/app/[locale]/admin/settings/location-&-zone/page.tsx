'use client'
import { IUser, IZone } from '@/app/type'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserDropdown from '@/components/user-dropdown'
import { fetchData } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Map from '@/components/map'
import TabMenu from '@/components/tab-menu'

export default function Page() {
  const a = useTranslations("Alert");
  const t = useTranslations("General");

  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);

  const [zones, setZones] = useState<IZone[]>([]); // Zones state
  const [loading, setLoading] = useState<boolean>(true); // Loading state for zones
  const [error, setError] = useState<string | null>(null); // Error state for API errors

  const [selectedZone, setSelectedZone] = useState<IZone | null>(null); // Selected zone state
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number, lng: number } | null>(null); // Coordinates of clicked location


  useEffect(() => {
    const getData = async () => {
      setLoading(true); // Set loading to true when fetching
      setError(null); // Reset error state before making the request
      try {
        // Fetch users
        const users = await fetchData(
          "get",
          "/users?profile=true&image=true&user=true",
          true
        );
        setUserData(users);
        a
        // Fetch zone data.
        const zoneData = await fetchData("get", `/location/1`, true);
        setZones(zoneData?.zones || []);  // Ensure the response contains the "zones" array, or empty array if not

      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load zones data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser); // Set selected user
  };

  const handleMapClick = (lat: number, lng: number, zone: IZone) => {
    setSelectedCoordinates({ lat, lng }); // Set coordinates when user clicks on map
    setSelectedZone(zone); // Optionally, set the selected zone
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}` // Get first letters of first and last name
      : nameParts[0].substring(0, 2); // In case there's only one name
    return initials.toUpperCase();
  };
  const getRandomColor = (name: string | undefined): string => {
    // Use a hash function to get a number from the name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
      'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
    ];
    return colors[hash % colors.length];
  };


  const handleSave = async () => {
    if (!selectedZone || !selectUser || !selectedCoordinates) {
      alert("Please select a zone, a supervisor, and a location.");
      return;
    }

    // Construct the data to send to the API
    const dataToSend = {
      zoneId: selectedZone.id,
      supervisorId: selectUser.id,
      coordinates: selectedCoordinates
    };

    try {
      // Make API request to save the data
      await fetchData("post", "/api/save-location", true, dataToSend);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
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
        <span className="material-symbols-outlined text-muted-foreground">
          location_on
        </span>
        <p className="text-base font-semibold text-muted-foreground ">
          {t("Zone")}
        </p>
      </div>

      <div className="flex justify-center items-center bg-secondary w-full rounded-md py-8  ">
        <Map disable={false} />
      </div>

      <div className="flex gap-2 justify-between w-fit mt-5 mb-5">
        <div className="flex gap-1 items-center ">
          <span className="material-symbols-outlined text-muted-foreground">
            engineering
          </span>
          <p className="text-muted-foreground text-base font-semibold">
            {t("Supervisor")}
          </p>
        </div>
        <UserDropdown
          userData={userData}
          onUserSelect={handleUserSelect} selectUser={selectUser} />
      </div>

      <div>
        <p className="mb-5 text-2xl font-bold">{t("Zone")} & {t("Assigned Supervisor")}</p>

        {/* Loading state check */}
        {loading ? (
          <p>{t("Loading zones...")}</p>
        ) : error ? (
          <p className="text-red-500">{error}</p> // Display error message if any
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex gap-3 items-center">
                    {t("Zone")}
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex gap-3 items-center">
                    {t("Supervisor")}
                    <span className="material-symbols-outlined">
                      engineering
                    </span>
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
                      {/* Check if supervisor has an image */}
                      {zone.supervisor?.profile?.image?.path ? (
                        <img
                          src={`http://localhost:4000/uploads/${zone.supervisor.profile.image.path}`} // URL ของภาพ
                          alt={zone.supervisor.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-8 h-8 flex items-center justify-center text-white rounded-full ${getRandomColor(zone.supervisor?.profile?.name)}`}>
                          {getInitials(zone.supervisor?.profile?.name)}
                        </div>
                      )}

                      {/* Supervisor Name */}
                      <span>{zone.supervisor?.profile.name || t("No Supervisor")}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>


          </Table>
        )}
      </div>
    </div>
  )
}
