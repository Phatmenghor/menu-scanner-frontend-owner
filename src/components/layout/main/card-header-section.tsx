"use client";
// components/CardHeaderSection.tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Ghost } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface CardHeaderSectionProps {
  breadcrumbs: BreadcrumbItemType[];
  title?: string;
  searchPlaceholder?: string;
  backHref?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  customAddNewButton?: React.ReactNode;
  buttonHref?: string;
  back?: boolean;
  openModal?: () => void;
  customSelect?: React.ReactNode;
  tabs?: React.ReactNode;
  children?: React.ReactNode;
}

export const CardHeaderSection: React.FC<CardHeaderSectionProps> = ({
  breadcrumbs,
  title,
  searchPlaceholder = "Search...",
  searchValue,
  customAddNewButton,
  onSearchChange,
  buttonText,
  buttonIcon,
  children,
  backHref,
  back,
  buttonHref,
  openModal,
  customSelect,
  tabs,
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div>
      <Card>
        <CardContent className="py-6 space-y-4">
          {/* Breadcrumb Section */}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink
                        href={item.href}
                        className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                      >
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-gray-400 font-medium">
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator
                      className="text-gray-600"
                      style={{
                        animationDelay: `${250 + index * 100}ms`,
                        animationFillMode: "backwards",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title Section with Back Button */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-start">
            {back && !isMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full flex-shrink-0 hover:cursor-pointer hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all duration-200"
                asChild
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}

            {title && (
              <div className="flex flex-col">
                <h5 className="lg:text-2xl text-xl font-bold mb-1">{title}</h5>
              </div>
            )}
          </div>

          {/* Search and Actions Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search input */}
            {onSearchChange && (
              <div className="relative w-full lg:w-[400px] group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="pl-10 w-full placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 transition-all duration-200"
                  value={searchValue}
                  onChange={onSearchChange}
                />
              </div>
            )}

            {/* Right side actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              {customSelect && (
                <div className="[&>*]:bg-gray-800 [&>*]:border-gray-700 [&>*]:text-gray-200">
                  {customSelect}
                </div>
              )}

              {customAddNewButton && <div>{customAddNewButton}</div>}

              {buttonText && buttonHref && (
                <div>
                  <Link
                    href={{
                      pathname: buttonHref,
                    }}
                  >
                    <Button>
                      {buttonIcon && (
                        <span className="transition-transform duration-200 group-hover:scale-110">
                          {buttonIcon}
                        </span>
                      )}
                      {buttonText}
                    </Button>
                  </Link>
                </div>
              )}
              {children && (
                <div className="px-0 pb-0 [&>*]:text-gray-200">{children}</div>
              )}
              {buttonText && openModal && (
                <div>
                  <Button
                    variant="default"
                    className="text-white border-0 flex gap-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 group"
                    onClick={openModal}
                  >
                    {buttonIcon && (
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {buttonIcon}
                      </span>
                    )}
                    {buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Tabs Section */}
        {tabs && (
          <div className="border-t border-gray-800 px-6 bg-gray-850">
            <div className="[&>*]:text-gray-300 [&>*:hover]:text-gray-100 [&>*[data-state=active]]:text-pink-400 [&>*[data-state=active]]:border-pink-400">
              {tabs}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
