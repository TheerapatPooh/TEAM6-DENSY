'use client'
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations('PatrolPage')
  const locale = useLocale()
  return (
    <div>
      <h1 className="font-extrabold text-7xl">{t('greeting')}</h1>
      <Link href={`/${locale}/patrol`}>
        <Button variant="default">
          Patrol
        </Button>
      </Link>
    </div>
  );
}