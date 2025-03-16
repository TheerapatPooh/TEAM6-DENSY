"use client";

import { useEffect } from "react";
import { fetchData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useLocale } from "next-intl";

export default function RefreshPage() {
    const router = useRouter();
    const locale = useLocale()
    useEffect(() => {
        async function refresh() {
            try {
                const result = await fetchData("post",'/refresh-token',true)
                if (result.status !== 200) {
                    router.push(`/${locale}/login`);
                }
                router.push(`/`);
            } catch (error) {
                console.error("Error to get refresh token", error);
                router.push(`/${locale}/login`);
            }

        }

        refresh();
    }, []);

    return <Loading />;
}