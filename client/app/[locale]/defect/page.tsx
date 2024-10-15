/* 
  Code by : Korawit rinnairak , Supatsara Yuraksa
  Job Position : Quality Assurance
  วันที่: 10 ตุลาคม 2024
  อธิบาย: ดูรายละเอียดของ Defect ทั้งหมด (Defect List View)
*/

"use client";
/* -------------------------------------------------------------------- ส่วนนี้เป็น Import ทั้งหมด ---------------------------------------------------------------*/
import { useEffect, useState } from "react";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import {DatePickerWithRange,} from "../../../components/date-picker";
import BadgeCustom from "@/components/badge-custom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatrolCard } from "@/components/patrol-card";

/* -------------------------------------------------------------------- สิ้นสุดการ Import ทั้งหมด ---------------------------------------------------------------*/


export default function Page() {
  const t = useTranslations("General");  /* เรียกใช้งานฟังก์ชันสำหรับการแปลภาษา */
  const [isSortOpen, setIsSortOpen] = useState(false);  /* สถานะสำหรับการเปิด/ปิดเมนูการจัดเรียง */
  const [isFilterOpen, setIsFilterOpen] = useState(false);  /* สถานะสำหรับการเปิด/ปิดเมนูการกรอง */

/* ------------------------------------------------------------------- Return ------------------------------------------------------------*/
  return ( 
    <div className="flex flex-col p-0 gap-y-5"> {/* Header */}
      <Header></Header> 
       
      <div className="flex items-center gap-2"> {/* แถบค้นหาและเมนูการจัดเรียง/กรอง */}
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
        />
        
{/* -----------------------------------------------------------------------------เมนูการจัดเรียง -----------------------------------------------*/}

        <DropdownMenu onOpenChange={(open) => setIsSortOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
            ${isSortOpen ? "border border-destructive" : "border-none"}`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg	">Sort</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="Doc No.">
              <DropdownMenuRadioItem value="Doc No." className="text-base">
                Doc No.
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">
                Date
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="Order">
              <DropdownMenuRadioItem value="Order" className="text-base">
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Date" className="text-base">
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
{/* -------------------------------------------------------------------------------- เมนูการกรอง --------------------------------------------------*/}

        <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
        <DropdownMenuTrigger
          className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
          ${isFilterOpen ? "border border-destructive" : "border-none"}`}
        >
          {" "}
          <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg	">Filter</div>

        </DropdownMenuTrigger> {/* เมนูกรองวันที่ */}
        <DropdownMenuContent className="flex flex-col justify-center gap-2 p-2">
            <div>
              <DropdownMenuLabel>Date</DropdownMenuLabel>
              <DatePickerWithRange />
            </div>

            <div>
              <DropdownMenuLabel>Status</DropdownMenuLabel> {/* เมนูกรองสถานะ */}
              <DropdownMenuCheckboxItem checked>
                <BadgeCustom
                  width="w-full"
                  variant="green"
                  showIcon={true}
                  iconName="check"
                  children="Complete"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <BadgeCustom
                  width="w-full"
                  variant="blue"
                  showIcon={true}
                  iconName="campaign"
                  children="Reported"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <BadgeCustom
                  width="w-full"
                  variant="brown"
                  showIcon={true}
                  iconName="chat"
                  children="Comment"
                ></BadgeCustom>
              </DropdownMenuCheckboxItem>
            </div>
            <div>

              <DropdownMenuLabel>Defect</DropdownMenuLabel> {/* เมนูกรอง Preset */}
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Defect</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="09/07/2567 02:40 PM">
                    ตรวจสอบการจัดการและการจัดเก็บวัสดุอันตรายในแต่ละโซนให้เป็นไปตามข้อกำหนด
                    </SelectItem>
                    <SelectItem value="09/07/2567 02:35 PM">
                    ตรวจสอบว่าพื้นในทุกโซนสะอาด ปราศจากคราบสกปรก น้ำมัน หรือของเหลวที่อาจเป็นอันตราย
                    </SelectItem>
                    <SelectItem value="09/07/2567 02:00 PM">
                    ตรวจสอบการทำงานของระบบระบายอากาศและฟิลเตอร์ว่าไม่มีสิ่งสกปรก
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full justify-end gap-2"> {/* ปุ่มสำหรับรีเซ็ตและใช้การตั้งค่า */}
              <Button size="sm" variant="secondary">
                Reset
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
{/* ----------------------------------------------------------------- แสดงรายการที่ 1 -----------------------------------------------------------*/}

      <div className="mt-0 bg-white p-5 rounded-lg shadow-md space-y-1 border-l-8 border-green-500 pl-2">
        <div className="flex items-center justify-between">
        <div className="flex items-center text-black-500 space-x-2">
          <span className="material-symbols-outlined text-[#707A8A] cursor-default ">schedule</span>
          <span className="font-semibold text-small text-gray-500">09/07/2567 02:00 PM</span>
        </div>
            <BadgeCustom
              width="w-32"
              variant="green"
              showIcon={true}
              iconName="check"
              children="Completed"
            />
        </div>

        <div className="my-2">
          <button className="bg-red-500 text-white font-bold px-9 py-0 text-sm rounded-full">
            <span className="text-sm font-semibold">Safety</span>
          </button>
        </div>

        <div>
          <span className="font-bold text-lg text-black">ตรวจสอบการทำงานของระบบระบายอากาศและฟิลเตอร์ว่าไม่มีสิ่งสกปรก</span>
        </div>

        <div className="text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined">person_alert</span>
            <span className="font-bold text-small text-gray-500 space-y-1">Reporter</span>
          </div>

          <div className="flex items-center space-x-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined">location_on</span>
            <span className="font-bold text-small text-gray-500 space-y-1 ml-2">Location</span>
            <span className="text-sm font-normal ml-4">Zone A</span>
          </div>
          </div>
        </div>
      </div>
{/* ----------------------------------------------------------------- สิ้นสุดแสดงรายการที่ 1 -----------------------------------------------------------*/}

{/* ----------------------------------------------------------------- แสดงรายการที่ 2 -----------------------------------------------------------*/}

      <div className="mt-1 bg-white p-5 rounded-lg shadow-md space-y-1 border-l-8 border-cyan-300 pl-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-black-500 space-x-2">
          <span className="material-symbols-outlined text-[#707A8A] cursor-default ">schedule</span>
          <span className="font-semibold text-small text-gray-500">09/07/2567 02:00 PM</span>
        </div>
          <BadgeCustom
              width="w-32"
              variant="cyan"
              showIcon={true}
              iconName="campaign"
              children="Reported"
            />
        </div>

        <div className="my-2">
          <button className="bg-red-500 text-white font-bold px-9 text-sm rounded-full">
            <span className="text-sm font-semibold">Safety</span>
          </button>
        </div>

        <div>
          <span className="font-bold text-lg text-black">ตรวจสอบว่าพื้นในทุกโซนสะอาด ปราศจากคราบสกปรก น้ำมัน หรือของเหลวที่อาจเป็นอันตราย</span>
        </div>

        <div className="text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined">person_alert</span>
            <span className="font-bold text-small text-gray-500 space-y-1">Reporter</span>
          </div>

          <div className="flex items-center space-x-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined">location_on</span>
            <span className="font-bold text-small text-gray-500 space-y-1 ml-2">Location</span>
            <span className="text-sm font-normal ml-4">Zone B</span>
          </div>
          </div>
        </div>
    </div>
{/* ----------------------------------------------------------------- สิ้นสุดแสดงรายการที่ 2 -----------------------------------------------------------*/}

{/* ----------------------------------------------------------------- แสดงรายการที่ 3 -----------------------------------------------------------*/}

      <div className="mt-1 bg-white p-5 rounded-lg shadow-md space-y-1 border-l-8 border-[#A2845E] pl-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-black-500 space-x-2">
          <span className="material-symbols-outlined text-[#707A8A] cursor-default ">schedule</span>
          <span className="font-semibold text-small text-gray-500">09/07/2567 02:35 PM</span>
        </div>
          <BadgeCustom
              width="w-32"
              variant="brown"
              showIcon={true}
              iconName="chat"
              children="Comment"
            />
        </div>

        <div className="my-2">
          <button className="bg-red-500 text-white font-bold px-9 text-sm rounded-full">
            <span className="text-sm font-semibold">Safety</span>
          </button>
        </div>

        <div>
          <span className="font-bold text-lg text-black">ตรวจสอบการทำงานของระบบระบายอากาศและฟิลเตอร์ว่าไม่มีสิ่งสกปรก</span>
        </div>

        <div className="text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined">person_alert</span>
            <span className="font-bold text-small text-gray-500 space-y-1">Reporter</span>
          </div>

          <div className="flex items-center space-x-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined">location_on</span>
            <span className="font-bold text-small text-gray-500 space-y-1 ml-2">Location</span>
            <span className="text-sm font-normal ml-4">Zone C</span>
          </div>
          </div>
        </div>
      </div>
{/* ----------------------------------------------------------------- สิ้นสุดแสดงรายการที่ 3 -----------------------------------------------------------*/}      
    </div>
  );
}