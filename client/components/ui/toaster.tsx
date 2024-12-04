"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const typeStyles: Record<"info" | "success" | "error", string> = {
  info: "bg-white text-black border-l-blue-500",
  success: "bg-white text-black border-l-green-500",
  error: "bg-white text-black border-l-red-500",
};

const typeIcons: Record<"info" | "success" | "error", string> = {
  info: "info",
  success: "check",
  error: "close",
};

const typeColor: Record<"info" | "success" | "error", string> = {
  info: "bg-blue-500",
  success: "bg-green-500",
  error: "bg-red-500",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, type = "info", action }) => {
        const typeClass = typeStyles[type];
        const icon = typeIcons[type];
        const color = typeColor[type];
        return (
          <Toast
            key={id}
            className={`border-0 p-4 rounded-md border-l-[10px] ${typeClass}`}
          >
            <div className="gap-3 flex items-center">
              <div className={`w-[24px] h-[24px] rounded-full flex justify-center items-center  ${color}`}>
                <span className="material-symbols-outlined  text-white">{icon}</span>
              </div>

              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}