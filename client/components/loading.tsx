/**
 * คำอธิบาย:
 *   คอมโพเนนต์ loading ใช้สำหรับแสดงการโหลดข้อมูล โดยจะแสดง loader และข้อความ "Loading" ในระหว่างการโหลดข้อมูล
 * Input: 
 * - ไม่มี
 * Output:
 * - JSX ของการโหลดข้อมูล
**/

import React from 'react'

export default function loading() {
    return (
        <div className="flex w-full h-screen justify-center items-center bg-gray/40">
            <div className="flex w-96 items-center justify-between">
                <div className="loader"></div>
                <div className="loader2">Load&nbsp;ng</div>
            </div>
        </div>

    )
}
