/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Textfield ใช้สำหรับรับข้อมูลจากผู้ใช้ โดยมีคุณสมบัติดังนี้
 * Input: 
 * - placeholder: ข้อความที่แสดงในช่องกรอกข้อมูล
 * - iconName: ชื่อไอคอนที่ใช้แสดงในช่องกรอกข้อมูล
 * - type: ประเภทของช่องกรอกข้อมูล เช่น text, password
 * - showIcon: สถานะที่ใช้สำหรับแสดงไอคอนในช่องกรอกข้อมูล
 * - className: ชื่อคลาสที่ใช้สำหรับสร้างสไตล์ของช่องกรอกข้อมูล
 * - value: ค่าที่ใส่ในช่องกรอกข้อมูล
 * - onChange: ฟังก์ชันที่ใช้สำหรับเปลี่ยนค่าในช่องกรอกข้อมูล
 * - ref: อ้างอิงของช่องกรอกข้อมูล
 * - name: ชื่อของช่องกรอกข้อมูล
 * Output:
 * - JSX ของ Textfield ที่ใช้สำหรับรับข้อมูลจากผู้ใช้
 * - แสดงช่องกรอกข้อมูลที่มีไอคอน และสามารถแสดงหรือซ่อนข้อมูลที่อยู่ในช่องกรอกข้อมูล
 * - สามารถรับค่าจากผู้ใช้และเปลี่ยนค่าในช่องกรอกข้อมูลได้
 **/

'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils"


interface ITextfield {
  placeholder?: string;
  iconName?: string;
  type?: string;
  showIcon?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
  name?: string;
}

export default function Textfield({
  placeholder,
  iconName,
  showIcon = false,
  type = 'text',
  className,
  value,
  onChange,
  ref,
  name 
}: ITextfield) {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);
  return (
    <div className="relative flex items-center w-full h-full" >
      <Input
        type={type === 'password' ? (visible ? 'text' : 'password') : type}
        placeholder={placeholder}
        className={cn("ps-10 h-[40px] outline-none border-none bg-card flex-1 text-card-foreground text-base placeholder:text-input", className)}
        value={value}
        onChange={onChange}
        ref={ref}
        name={name}
      />
      {showIcon && iconName && (
        <span
          className={`material-symbols-outlined absolute left-2 text-input transition-opacity duration-300 ${showIcon ? 'opacity-100' : 'opacity-0'}`}
          style={{ visibility: showIcon ? 'visible' : 'hidden' }}
        >
          {iconName}
        </span>
      )}
      {type === 'password' && (
        <span
          className="material-symbols-outlined absolute right-2 cursor-pointer text-input"
          onClick={toggleVisibility}
        >
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      )}
    </div>
  );
}
