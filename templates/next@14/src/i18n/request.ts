import { routing } from "./routing";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the requested locale
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    // Define reusable flag for Arabic
    const isArabic = locale === "ar";

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
