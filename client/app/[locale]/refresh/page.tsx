"use client";

import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useLocale } from "next-intl";

export default function RefreshPage() {
    const router = useRouter();
    const locale = useLocale()
    useEffect(() => {
        async function refresh() {
            try {
                const result = await refreshAccessToken();
                if (result.status === 401) {
                    router.push(`/${locale}/login`);
                }
                router.push(`/`);
            } catch (error) {
                router.push(`/${locale}/login`);
            }

        }

        refresh();
    }, []);

    return <Loading />;
}