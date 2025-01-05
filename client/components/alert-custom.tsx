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
import { buttonVariants } from "./ui/button";

export interface alertProps {
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
  primaryVariant,
  backResult,
}: alertProps) {
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
      <AlertDialogContent onClick={(e) => e.stopPropagation()} className="flex flex-col px-6 py-4 gap-6 max-w-[600px]">
        <AlertDialogHeader className="flex gap-2">
          <AlertDialogTitle className="text-xl font-semibold text-card-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium text-card-foreground">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: "secondary", size: "lg" })}
            onClick={() => handleAction(false)}
          >
            <span className="material-symbols-outlined">
              {secondaryIcon}
            </span>
            {secondaryButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: primaryVariant ? primaryVariant : 'destructive', size: "lg" })}
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
