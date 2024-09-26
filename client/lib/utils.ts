import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LoginSchema } from "@/app/[locale]/login/page"
import * as z from "zod"
import { error } from "console"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values)
  if(!validatedFields.success) {
      return { error: "Invalid field!"}
  }
  return { success: "Login successfully!"}
}