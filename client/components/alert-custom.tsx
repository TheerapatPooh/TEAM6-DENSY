/**
 * คำอธิบาย:
 *   คอมโพเนนต์ AlertCustom ใช้สำหรับแสดง Alert ที่มีปุ่ม Action 2 ปุ่ม และสามารถกำหนดไอคอนและสีปุ่มได้
 * Input: 
 * - title: ชื่อหัวข้อของ Alert
 * - description: คำอธิบายของ Alert
 * - primaryButtonText: ข้อความบนปุ่ม Action 1
 * - secondaryButtonText: ข้อความบนปุ่ม Action 2
 * - primaryIcon: ไอคอนบนปุ่ม Action 1
 * - secondaryIcon: ไอคอนบนปุ่ม Action 2
 * - primaryVariant: สีของปุ่ม Action 1
 * - backResult: ฟังก์ชันที่รับค่า boolean จากการกดปุ่ม Action 1 หรือ Action 2
 * Output:
 * - JSX ของ AlertCustom ที่มีหัวข้อ, คำอธิบาย, 2 ปุ่ม Action และสามารถกำหนดไอคอนและสีของปุ่มได้
**/

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export interface IAlertCustom {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryIcon?: string;
  secondaryIcon?: string;
  primaryVariant?: 'default' | 'destructive' | 'success' | 'fail' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  backResult: (result: boolean) => void;
}

export function AlertCustom({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryIcon,
  secondaryIcon,
  primaryVariant = 'destructive',
  backResult,
}: IAlertCustom) {
  const [isOpen, setIsOpen] = useState(true);

  const handleAction = (result: boolean) => {
    backResult(result);
    setIsOpen(false);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent onClick={handleContentClick} className="flex flex-col px-6 py-4 sm:w-[90%] xl:w-[60%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-card-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-card-foreground text-base">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={`gap-2 ${buttonVariants({ variant: "secondary", size: "lg" })}`}
            onClick={() => handleAction(false)}
          >
            <span className="material-symbols-outlined">{secondaryIcon}</span>
            {secondaryButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`gap-2 ${buttonVariants({ variant: primaryVariant, size: "lg"  })}`}
            onClick={() => handleAction(true)}
          >
            <span className="material-symbols-outlined">{primaryIcon}</span>
            {primaryButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
