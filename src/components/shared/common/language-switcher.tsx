"use client";

import { locales } from "@/i18n";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Languages, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { localeConfig } from "@/constants/AppResource/status/status";

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "flag-only";
  showBadge?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  variant = "default",
  showBadge = false,
  className,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations();
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false); // Track dropdown open state

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    setOpen(false); // Close dropdown first

    // Delay navigation to avoid DOM cleanup race condition
    setTimeout(() => {
      startTransition(() => {
        const pathWithoutLocale =
          pathname.replace(`/${currentLocale}`, "") || "/";
        const newPath = `/${newLocale}${pathWithoutLocale}`;
        router.push(newPath);
      });
    }, 100); // Delay lets Dropdown unmount cleanly
  };

  if (!isClient) {
    return (
      <div
        className={cn("w-10 h-10 animate-pulse bg-muted rounded-md", className)}
      />
    );
  }

  const currentLocaleConfig =
    localeConfig[currentLocale as keyof typeof localeConfig];

  if (variant === "compact") {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2", className)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="text-sm">{currentLocaleConfig.flag}</span>
                <span className="ml-1 text-xs font-medium">
                  {currentLocaleConfig.code}
                </span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {locales.map((locale) => {
            const config = localeConfig[locale as keyof typeof localeConfig];
            const isSelected = locale === currentLocale;

            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  isSelected && "bg-accent"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{config.flag}</span>
                  <span className="font-medium">{config.nativeName}</span>
                </div>
                {isSelected && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "flag-only") {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <img
                src={currentLocaleConfig.flag}
                alt={`${currentLocaleConfig.nativeName} flag`}
                className="w-5 h-4 object-cover rounded-sm"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {locales.map((locale) => {
            const config = localeConfig[locale as keyof typeof localeConfig];
            const isSelected = locale === currentLocale;

            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  isSelected && "bg-accent"
                )}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={config.flag}
                    alt={`${config.nativeName} flag`}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                  <span className="font-medium">{config.nativeName}</span>
                </div>
                {isSelected && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showBadge && (
        <Badge variant="secondary" className="text-xs">
          {t("language")}
        </Badge>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Languages className="h-4 w-4 mr-2" />
            )}
            <img
              src={currentLocaleConfig.flag}
              alt={`${currentLocaleConfig.nativeName} flag`}
              className="h-4 w-6 rounded-sm object-cover"
            />
            <span className="font-medium">
              {currentLocaleConfig.nativeName}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              {t("selectLanguage")}
            </p>
          </div>

          {locales.map((locale) => {
            const config = localeConfig[locale as keyof typeof localeConfig];
            const isSelected = locale === currentLocale;

            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2",
                  isSelected && "bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={config.flag}
                    alt={`${config.nativeName} flag`}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{config.nativeName}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.name}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
