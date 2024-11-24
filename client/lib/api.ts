import { LoginSchema } from '@/app/type';
import axios, { AxiosRequestConfig } from "axios";
import { z } from "zod";

export async function login(values: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid field!" }
    }
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, values, { withCredentials: true })
        return response.data
    } catch (err: any) {
        return { error: err.response?.data?.message || "Login failed" };
    }
}

export async function logout() {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
    } catch (error: any) {
        throw new Error("Logout failed");
    }
}



export async function fetchData(
    type: "get" | "delete" | "post" | "put",
    endpoint: string,
    credential: boolean,
    value?: any,
    form?: boolean
) {
    try {
        const config: AxiosRequestConfig = {
            withCredentials: credential,
            headers:
                form ? {
                    "Content-Type": "multipart/form-data",
                }
                    : {
                        'Content-Type': 'application/json',
                    }
        };

        let response;
        if (type === "get" || type === "delete") {
            response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
        } else if (type === "post" || type === "put") {
            response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, value, config);
        }

        return response?.data; // response.data will contain the response body
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null; // Returning null on error
    }
}
