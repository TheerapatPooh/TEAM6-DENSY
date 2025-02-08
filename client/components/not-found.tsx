import { useTranslations } from 'next-intl';
import React from 'react'

interface INotFound {
    icon: string;
    title: string;
    description: string;
}

export default function NotFound({
    icon, title, description }: INotFound
) {
    const t = useTranslations('General')
    return (
        <div className="flex flex-col justify-center items-center text-center text-muted-foreground py-8">
            <span className="material-symbols-outlined text-9xl text-border mb-4">
                {icon}
            </span>
            <p className="text-2xl font-semibold text-card-foreground">
                {t(title)}
            </p>
            <p className="text-base font-light mt-2">
                {t(description)}
            </p>
        </div>
    )
}
