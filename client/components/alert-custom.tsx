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
       <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={handleContentClick}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="gap-2"
            onClick={() => handleAction(false)}
          >
            <span className="material-symbols-outlined">{secondaryIcon}</span>
            {secondaryButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="gap-2"
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
