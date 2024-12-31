'use client'
import { IUser } from '@/app/type'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserDropdown from '@/components/user-dropdown'
import { fetchData } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Map from '@/components/map'

export default function Page() {
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectUser, setSelectUser] = useState<IUser | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const users = await fetchData(
          "get",
          "/users?profile=true&image=true&user=true",
          true
        );
        setUserData(users);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const handleUserSelect = (dropdownUser: IUser) => {
    setSelectUser(dropdownUser);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">{t("Choose Zone and Supervisor")}</p>
        <Button variant="primary" size="lg" className="flex gap-2">
          <span className="material-symbols-outlined">save</span>
          {t("Save")}
        </Button>
      </div>

      <div className="flex gap-2">
        <span className="material-symbols-outlined text-muted-foreground">
          location_on
        </span>
        <p className="text-base font-semibold text-muted-foreground">
          {t("Zone")}
        </p>
      </div>

      <div className="bg-secondary w-full rounded-md ">
        <Map disable={false} />
      </div>

      <div className="flex gap-2 justify-between w-fit">
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
          onUserSelect={handleUserSelect}
        />
      </div>

      <div>
        <p className="text-2xl font-bold">{t("Zone")} & {t("Assigned Supervisor")}</p>
        <Table>
          <TableHeader>
            <TableRow className="">
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
            <TableRow>
              <TableCell>ASSEMBLY LINE ZONE</TableCell>
              <TableCell>Michael Johnson</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
