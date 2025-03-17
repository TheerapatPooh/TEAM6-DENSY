/**
 * คำอธิบาย:
 * คอมโพเนนต์ RefreshPage ใช้สำหรับการรีเฟรช Token และทำการตรวจสอบสถานะของการรีเฟรช token จาก API ถ้าการรีเฟรชสำเร็จ จะทำการรีไดเร็กไปยังหน้าแรก หากไม่สำเร็จ จะนำผู้ใช้ไปที่หน้า login
 * ใช้ useEffect ในการเรียกฟังก์ชัน refresh ซึ่งทำงานเมื่อคอมโพเนนต์ถูกเรนเดอร์
 * 
 * Input:
 * - ไม่มีอินพุตโดยตรง เนื่องจากเป็นคอมโพเนนต์ที่ทำงานโดยอัตโนมัติเมื่อโหลด
 * 
 * Output:
 * - หากรีเฟรช token สำเร็จ จะนำผู้ใช้ไปที่หน้าแรก
 * - หากเกิดข้อผิดพลาดหรือล้มเหลวในการรีเฟรช token จะนำผู้ใช้ไปที่หน้า login
**/
"use client";
import { useEffect } from "react";
import { fetchData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useLocale } from "next-intl";

export default function RefreshPage() {
    const router = useRouter();
    const locale = useLocale()
    useEffect(() => {
        async function refresh() {
            try {
                const result = await fetchData("post",'/refresh-token',true)
                if (result.status !== 200) {
                    router.push(`/${locale}/login`);
                }
                router.push(`/`);
            } catch (error) {
                console.error("Error to get refresh token", error);
                router.push(`/${locale}/login`);
            }

        }

        refresh();
    }, []);

    return <Loading />;
}