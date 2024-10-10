import { notFound } from "next/navigation";
import { getRequestConfig, unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
// Can be imported from a shared config
const locales = ["en", "th"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  unstable_setRequestLocale(locale);
  
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});