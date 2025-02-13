"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
export default function Page() {
  //แปลภาษา
  const a = useTranslations("Alert");
  const t = useTranslations("General");
  const z = useTranslations("Zone");

  const router = useRouter();
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
          Zone Without Assigned Users
        </p>
        {/* Message to admin */}
        <p className="text-lg font-medium mt-4">
          It seems that the selected preset has zone without assigned
          supervisor.
        </p>
        <p className="text-lg font-medium mt-2">
          Please go to the{" "}
          <a
            href={`/${locale}/admin/settings/location-&-zone`}
            className="text-blue-500 underline"
          >
            Location & Zone
          </a>{" "}
          section and assign users to the zone.
        </p>
      </div>
    </div>
  );
}
