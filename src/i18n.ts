import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "kh", "zh-CN"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  console.log("=== i18n getRequestConfig ===");
  console.log("Received locale:", locale);

  // Validate locale
  if (!locale || !locales.includes(locale)) {
    console.log("Invalid locale, using default:", defaultLocale);
    locale = defaultLocale;
  }

  console.log("Loading messages for locale:", locale);

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    console.log("Messages loaded successfully for:", locale);

    return {
      messages,
      locale,
    };
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);

    // Fallback to default locale messages
    const fallbackMessages = (await import(`./messages/${defaultLocale}.json`))
      .default;
    return {
      locale: defaultLocale,
      messages: fallbackMessages,
    };
  }
});
