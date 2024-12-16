import React from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import { fetchData } from "@/lib/api";

// const defectData = fetchData("get","/defect",true)

export default function Page() {
  return (
    <div className="min-h-screen bg-default">
      <Header />
      <div className="p-4">
        {/* Safety Badge */}
        <BadgeCustom showIcon={true} iconName="verified_user">
          Safety
        </BadgeCustom>

        <p className="mb-6">
          ตรวจสอบพื้นที่ในทุกโซนสะอาด ปราศจากคราบสกปรก น้ำมัน
          หรือของเหลวที่อาจเป็นอันตราย
        </p>

        <div className="bg-card rounded-lg shadow-lg p-4">
          {/* Title section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-left">
              <h1 className="text-xl font-bold flex items-center">
                <span className="material-symbols-outlined text-2xl mr-2">
                  schedule
                </span>
                09/07/2567 02:00 PM
              </h1>

              <div className="flex items-center mt-2">
                <BadgeCustom variant="mint" showIcon={true} iconName="campaign">
                  Reported
                </BadgeCustom>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant={"secondary"} size={"lg"}>
                Back
              </Button>
              <Button variant={"primary"} size={"lg"}>
                <span className="material-symbols-outlined">update</span>
                Accept
              </Button>
            </div>
          </div>

          {/* Reporter and Details */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left section - takes 7 columns */}
            <div className="col-span-5">
              <div className="flex items-center">
                <span className="material-symbols-outlined">person_alert</span>
                <div className="ml-2 text-sm text-gray-500">Reporter</div>
                <div className="ml-8 text-sm text-gray-500">Joe Dohn</div>
              </div>

              <div className="bg-secondary rounded-lg p-4 mb-4 h-40">
                <p className="text-sm">
                  zone A และ zone B มีคราบน้ำมันอยู่บริเวณพื้น
                </p>
              </div>
            </div>

            {/* Right section - takes 5 columns */}
            <div className="col-span-5">
              <div className="flex items-center">
                <span className="material-symbols-outlined">location_on</span>
                <div className="ml-2 text-sm text-gray-500">Location</div>
              </div>

              <div className="bg-secondary rounded-lg p-4 h-40 flex items-center justify-center">
                {/* Display image */}
                <img
                  src="/image.png"
                  alt="Factory Zones"
                  className="w-full h-full rounded-lg border"
                />
              </div>
            </div>
          </div>

          {/* Bottom section with "Before" and "After" */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-6">
              <h3 className="text-lg font-semibold">Before</h3>
              <div className="bg-secondary rounded-lg h-64 flex items-center justify-center">
                {/* Placeholder for "Before" image */}
                <span className="material-symbols-outlined text-6xl">
                  image
                </span>
              </div>
            </div>
            <div className="col-span-6">
              <h3 className="text-lg font-semibold">After</h3>
              <div className="bg-secondary rounded-lg h-64 flex items-center justify-center">
                {/* Placeholder for "After" image */}
                <span className="material-symbols-outlined text-6xl">
                  image
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
