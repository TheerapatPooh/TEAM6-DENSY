/**
 * คำอธิบาย:
 *  หน้าผลลัพธ์เมื่อไม่พบข้อมูลที่เกี่ยวข้องกับ Zone โดยจะแสดงข้อความแจ้งเตือนให้ผู้ใช้ไปที่หน้าตั้งค่าต่างๆ
 *  ในระบบเพื่อกำหนดผู้ใช้ให้กับ Zone ที่ไม่มีการมอบหมาย
 *  ใช้การแปลภาษาและแสดงภาพที่เหมาะสมในการสื่อความหมาย
 * Input:
 * - ไม่มี
 * Output:
 * - แสดงข้อความที่แปลแล้วตามภาษาในระบบ
 * - แสดงลิงค์เพื่อให้ผู้ใช้ไปตั้งค่าการมอบหมายผู้ใช้ให้กับ Zone
**/
"use client";
import { useLocale, useTranslations } from "next-intl";
export default function ErrorPage() {
  //แปลภาษา
  const t = useTranslations("General");

  const locale = useLocale();

  return (
    <div className=" flex flex-col items-center text-center text-muted-foreground">
      <img
        src="/assets/img/login_cover_2.png"
        alt="404 Not Found"
        className=" absolute w-[380px] object-contain"
      />
      <div className="pt-80">
        {/* Title */}
        <p className="text-4xl font-semibold text-card-foreground mb-2">
          {t("ZoneWithoutAssignedUsers")}
        </p>
        {/* Message to admin */}
        <p className="text-lg font-medium mt-4">
          {t("ZoneWithoutAssignedUsersDescription")}
        </p>
        <p className="text-lg font-medium mt-2">
          {t("PleaseGoTo")}
          <a
            href={`/${locale}/admin/settings/location-&-zone`}
            className="text-primary underline"
          >
            {t("Location&Zone")}
          </a>
          {t("AssignUsersToTheZone")}
        </p>
      </div>
    </div>
  );
}
