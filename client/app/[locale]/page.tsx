import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations('PatrolPage')
  return (
    <div>
      <h1 className="font-extrabold text-7xl">{t('greeting')}</h1>
    </div>
  );
}