import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
export interface alertProps {
  title: String;
  description: String;
  primaryBottonText: String;
  secondaryBottonText: String;
  primaryIcon?:string,
  secondaryIcon?:string,
  backResult: (result: boolean) => void;
}

export function AlertCustom({
  title,
  description,
  primaryBottonText,
  secondaryBottonText,
  primaryIcon,
  secondaryIcon,
  backResult,
}: alertProps) {
  const [isOpen, setIsOpen] = useState(true);
  const handleAction = (result: boolean) => {
    backResult(result);
  };
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="gap-2" onClick={() => handleAction(false)}>
          <span className="material-symbols-outlined">{secondaryIcon}</span>
            {secondaryBottonText}
          </AlertDialogCancel>
          <AlertDialogAction className="gap-2"  onClick={() => handleAction(true)}>
            <span className="material-symbols-outlined">{primaryIcon}</span>
            {primaryBottonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}