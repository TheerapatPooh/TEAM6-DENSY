/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Defect ใช้สำหรับแสดงข้อมูลของ Defect ที่ได้รับจาก API
 * Input:
 * - defect: ข้อมูลของ Defect ที่ได้รับจาก API
 * Output:
 * - JSX ของ Defect ที่แสดงข้อมูลของ Defect ที่ได้รับจาก API
 **/

import React from "react";
import BadgeCustom from "./badge-custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatTime,
  getDefectStatusVariant,
  getInitials,
  getItemTypeVariant,
} from "@/lib/utils";
import { IDefect, itemType } from "@/app/type";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { UserTooltip } from "./user-tooltip";

export default function Defect({ defect }: { defect: IDefect }) {
  const s = useTranslations("Status");
  const t = useTranslations("General");
  const z = useTranslations("Zone");
  const router = useRouter();
  const locale = useLocale();
  const { variant, iconName } = getDefectStatusVariant(defect.status);
  const color = (type: itemType) => {
    switch (type) {
      case "safety":
        return "green";
      case "environment":
        return "primary";
      default:
        return "destructive";
    }
  };

  return (
    <div
      className={`bg-card p-4 rounded-md custom-shadow border-l-8 border-${color(
        defect.type
      )} cursor-pointer`}
      onClick={() => router.push(`/${locale}/defect/${defect.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center text-black-500 space-x-2">
          <span className="material-symbols-outlined text-muted-foreground cursor-default ">
            schedule
          </span>
          <span className="font-semibold text-lg text-muted-foreground">
            {formatTime(defect.startTime, locale)}
          </span>
        </div>
        <div>
          <BadgeCustom
            iconName={iconName}
            showIcon={true}
            showTime={false}
            variant={variant}
          >
            {s(defect.status)}
          </BadgeCustom>
        </div>
      </div>
      <div className="my-2">
        {(() => {
          const { variant, iconName } = getItemTypeVariant(defect.type);

          return (
            <BadgeCustom
              showTime={false}
              variant={variant}
              iconName={iconName}
              showIcon={true}
              shape={"square"}
            >
              {s(defect.type)}
            </BadgeCustom>
          );
        })()}
      </div>
      <div>
        <span className="font-bold text-2xl text-card-foreground">
          {defect.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-between">
          <span className="material-symbols-outlined text-muted-foreground">
            location_on
          </span>
          <span className="font-bold text-lg text-muted-foreground ml-2">
            {t("Zone")}
          </span>
          <span className="text-card-foreground text-lg ml-4">
            {z(defect.patrolResult.itemZone.zone.name)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-muted-foreground">
          person_search
        </span>
        <span className="font-bold text-lg text-muted-foreground">
          {t("inspector")}
        </span>

            <div className="flex items-center ps-2 p-2">
              <UserTooltip user={defect.user}>
                <Avatar className="custom-shadow ms-[-10px] me-2.5">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${defect.user.profile.image?.path}`}
                  />
                  <AvatarFallback id={defect.user.id.toString()}>
                    {getInitials(defect.user.profile.name)}
                  </AvatarFallback>
                </Avatar>
              </UserTooltip>
              <p className="text-[20px]">{defect.user.profile.name}</p>
            </div>

      </div>
    </div>
  );
}
