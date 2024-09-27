import { LoginSchema } from "@/app/[locale]/login/page";
import axios from "axios";
import { z } from "zod";

export async function login(values: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid field!" }
    }
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, values, { withCredentials: true })
        return response.data
    } catch (err: any) {
        return { error: err.response?.data?.message || "Login failed" };
    }
}

export async function logout() {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`, {}, { withCredentials: true });
    } catch (error: any) {
        throw new Error("Logout failed");
    }
}