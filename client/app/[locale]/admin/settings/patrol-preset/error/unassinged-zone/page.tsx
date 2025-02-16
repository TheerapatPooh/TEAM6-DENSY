"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
export default function Page() {
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
          {t("PleaseGoTo")}{" "}
          <a
            href={`/${locale}/admin/settings/location-&-zone`}
            className="text-blue-500 underline"
          >
            {t("Location&Zone")}
          </a>{" "}
          {t("AssignUsersToTheZone")}
        </p>
      </div>
    </div>
  );
}
