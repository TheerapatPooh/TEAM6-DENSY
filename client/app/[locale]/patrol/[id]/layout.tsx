'use client'

import { PatrolProvider, usePatrol } from '@/context/patrol-context';

export default function PatrolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <PatrolProvider>
            <div className="flex flex-col gap-4 px-6">
                {children}
            </div>
        </PatrolProvider>
    );
}