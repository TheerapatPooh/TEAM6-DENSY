import { useTranslations } from 'next-intl';
import React from 'react';

export default function NotFoundPage() {
    const t = useTranslations("General");

    return (
        <div className="flex flex-col py-[120px] items-center text-center text-muted-foreground h-screen">
            {/* รูปภาพ 404 */}
            <img
                src="/assets/img/densy.png"
                alt="404 Not Found"
                className="w-[380px] h-auto object-contain"
            />
            <div className='absolute top-1/3'>
                {/* ข้อความ Title */}
                <p className="text-4xl font-semibold text-card-foreground mb-2">
                    {t('PageNotFoundTitle')}
                </p>

                {/* ข้อความ Description */}
                <p className="text-base font-light mt-2 max-w-md mx-auto">
                    {t('PageNotFoundDescription')}
                </p>
            </div>

        </div>
    );
}
