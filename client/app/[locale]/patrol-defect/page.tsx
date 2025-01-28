/**
 * คำอธิบาย:
 *   หน้า Patrol Defect ใช้สำหรับแสดงข้อมูลของ Defect ทั้งหมด และสามารถค้นหา และเรียงลำดับข้อมูลได้
 *
 * Input: 
 * - ไม่มี
 * Output:
 * - หน้า Patrol Defect ที่แสดงข้อมูลของ Defect ทั้งหมด และสามารถค้นหา และเรียงลำดับข้อมูลได้
 * - แสดงช่องค้นหา และช่องกรองข้อมูลของ Defect ตามช่วงวันที่ และประเภทของ Defect
 **/

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
import { DatePickerWithRange } from "@/components/date-picker";
import { Niconne } from "next/font/google";

export default function page() {
    const t = useTranslations("General");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [allDefects, setAllDefects] = useState<IDefect[]>([]);
    const s = useTranslations("Status");

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
                        <div className="text-lg">{t('Sort')}</div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="p-2 gap-2">
                        <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('SortBy')}</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={null}
                            onValueChange={null}
                        >
                            <DropdownMenuRadioItem value="Date" className="text-base" onSelect={(e) => e.preventDefault()}>
                                {t('Date')}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Status" className="text-base" onSelect={(e) => e.preventDefault()}>
                                {t('Status')}
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>

                        <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Order')}</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={null}
                            onValueChange={null}
                        >
                            <DropdownMenuRadioItem value="Ascending" className="text-base" onSelect={(e) => e.preventDefault()}>
                                {t('Ascending')}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Descending" className="text-base" onSelect={(e) => e.preventDefault()}>
                                {t('Descending')}
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
                    <DropdownMenuTrigger
                        className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
                       ${isFilterOpen ? "border border-destructive" : "border-none"}`}
                    >
                        <span className="material-symbols-outlined">page_info</span>
                        <div className="text-lg">{t('Filter')}</div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="flex flex-col justify-center gap-2 p-2 z-50"
                        align="end"
                    >
                        <div>
                            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Date')}</DropdownMenuLabel>
                            <DatePickerWithRange
                                startDate={null}
                                endDate={null}
                                onSelect={null}
                                className="my-date-picker"
                            />
                        </div>
                        <div>
                            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Status')}</DropdownMenuLabel>
                            <Select
                                value={t('All')}
                                onValueChange={null}
                            >
                                <SelectTrigger className="text-card-foreground">
                                    <SelectValue
                                        placeholder={t('All')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t('Status')}</SelectLabel>
                                        <SelectItem value="All">{t('All')}</SelectItem>
                                        {/* {defectStatus.map((status) => (
                                            <SelectItem value={status} key={status}>
                                                {s(status)}
                                            </SelectItem>
                                        ))} */}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">{t('Type')}</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={null}
                                onCheckedChange={null}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <BadgeCustom
                                    width="w-full"
                                    variant="green"
                                    showIcon={true}
                                    iconName="verified_user"
                                    children={s('safety')}
                                    shape="square"
                                />
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={null}
                                onCheckedChange={null}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <BadgeCustom
                                    width="w-full"
                                    variant="blue"
                                    showIcon={true}
                                    iconName="psychiatry"
                                    children={s('environment')}
                                    shape="square"
                                />
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={null}
                                onCheckedChange={null}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <BadgeCustom
                                    width="w-full"
                                    variant="red"
                                    showIcon={true}
                                    iconName="build"
                                    children={s('maintenance')}
                                    shape="square"
                                />
                            </DropdownMenuCheckboxItem>
                        </div>

                        <div className="flex w-full justify-end mt-4 gap-2">
                            <Button size="sm" variant="secondary" onClick={null}>
                                {t('Reset')}
                            </Button>
                            <Button size="sm" variant="primary" onClick={null}>{t('Apply')}</Button>
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
