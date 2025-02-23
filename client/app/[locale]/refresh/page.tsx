"use client";

import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function RefreshPage() {
    const router = useRouter();

    useEffect(() => {
        async function refresh() {
            await refreshAccessToken();
            router.push("/");
        }

        refresh();
    }, []);

    return <Loading />;
}
