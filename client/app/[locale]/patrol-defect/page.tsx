'use client'
import { useEffect, useState } from "react";
import Textfield from "@/components/textfield";
import { Button } from "@/components/ui/button";
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
import { fetchData } from "@/lib/utils";
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
import {
    IDefect,
} from "@/app/type";
import { IUser } from "@/app/type";
import Loading from "@/components/loading";
import ReportDefect from "@/components/report-defect";

export default function page() {
    const t = useTranslations("General");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [allDefects, setAllDefects] = useState<IDefect[]>([]);

    const getAllDefects = async () => {
        try {
            const allData = await fetchData("get", "/patrol/defects", true);
            setAllDefects(allData);
        } catch (error) {
            console.error("Failed to fetch all defect:", error);
        }
    };

    useEffect(() => {
        getAllDefects()
        setLoading(false)
    }, []);

    if (loading) {
        return <Loading />
    }

    const fetchRealtimeData = (defect: IDefect) => {
        setAllDefects((prevDefects) =>
            prevDefects.map((d) => (d.id === defect.id ? defect : d))
        );
    };

    return (
        <div className="flex flex-col px-6 py-4 gap-4">
            <div className="flex items-center gap-2">
                <Textfield
                    iconName="search"
                    showIcon={true}
                    placeholder={t("Search")}
                />

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
                        </div>

                        <div>
                            <DropdownMenuLabel>Status</DropdownMenuLabel> {/* เมนูกรองสถานะ */}
                            <DropdownMenuCheckboxItem checked>
                                <BadgeCustom
                                    width="w-full"
                                    variant="green"
                                    showIcon={true}
                                    iconName="check"
                                    children="Safety"
                                ></BadgeCustom>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                <BadgeCustom
                                    width="w-full"
                                    variant="blue"
                                    showIcon={true}
                                    iconName="campaign"
                                    children="Environment"
                                ></BadgeCustom>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                <BadgeCustom
                                    width="w-full"
                                    variant="orange"
                                    showIcon={true}
                                    iconName="chat"
                                    children="Maintenance"
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
            <div>
                {allDefects.map((defect: IDefect) => {
                    return (
                        <div className="pb-4">
                            <ReportDefect
                                defect={defect}
                                page={"patrol-defect"}
                                response={(defect: IDefect) => {
                                    fetchRealtimeData(defect);
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
