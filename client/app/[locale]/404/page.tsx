/**
 * คำอธิบาย:
 *   คอมโพเนนต์ NotFoundPage ใช้สำหรับแสดงหน้าข้อผิดพลาด 404 (Page Not Found) 
 *   พร้อมข้อความที่รองรับหลายภาษาโดยใช้ `useTranslations` จาก `next-intl`
 *
 * Input:
 * - ไม่มี Input ที่รับเข้ามาโดยตรง
 *
 * Output:
 * - JSX ของหน้าข้อผิดพลาด 404 ประกอบด้วย:
 *   - รูปภาพ (`densy.png`) แสดงอยู่ตรงกลางของหน้าจอ
 *   - ข้อความแจ้งเตือนว่าหน้าไม่พบ (`PageNotFoundTitle`)
 *   - คำอธิบายเพิ่มเติม (`PageNotFoundDescription`)
**/
import { useTranslations } from 'next-intl';
import React from 'react';

export default function NotFoundPage() {
    const t = useTranslations("General");

    return (
        <div className="flex flex-col items-center text-center text-muted-foreground h-screen relative">
        {/* Image */}
        <img
          src="/assets/img/densy.png"
          alt="404 Not Found"
          className="absolute w-[380px] object-contain"
        />
        
        <div className="pt-80">
          {/* Title */}
          <p className="text-4xl font-semibold text-card-foreground mb-2">
            {t('PageNotFoundTitle')}
          </p>
      
          {/* Description */}
          <p className="text-base font-light mt-2 max-w-md mx-auto">
            {t('PageNotFoundDescription')}
          </p>
        </div>
      </div>
      
    );
}
