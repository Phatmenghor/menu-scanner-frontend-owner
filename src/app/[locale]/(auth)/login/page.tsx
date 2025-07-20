"use client";

import { useState, useTransition } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginService } from "@/services/auth/login.service";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("auth");
  const router = useRouter();

  // Create form schema with translations
  const formSchema = z.object({
    username: z.string().email(t("validation.email-required")),
    password: z.string().min(8, {
      message: t("validation.password-min"),
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "admin@example.com",
      password: "88889999",
    },
  });

  async function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        const response = await loginService({
          username: values.username,
          password: values.password,
        });

        if (response) {
          toast.success(t("messages.welcome"));
          router.replace(ROUTES.DASHBOARD.INDEX);
        }
      } catch (error: any) {
        const errorMsg =
          error?.errorMessage ===
          "An unexpected error occurred: Bad credentials"
            ? t("messages.incorrect-credentials")
            : error?.errorMessage ||
              error?.rawError?.message ||
              error?.message ||
              t("messages.error-general");

        toast.error(errorMsg);
      }
    });
  }

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <main className="flex mt-40 items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 blur-3xl" />
      </div>
      <section className="flex w-full max-w-md flex-col justify-center space-y-6">
        <article className="relative group">
          {/* Gradient border animation */}
          <span
            aria-hidden="true"
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 opacity-70 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-gradient-x"
          />

          {/* Login card */}
          <section className="relative rounded-xl border bg-card p-8 shadow-xl">
            <header className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight">
                {t("login.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("login.subtitle")}
              </p>
            </header>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login.username")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("login.username-placeholder")}
                          disabled={isLoading}
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login.password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            placeholder={t("login.password-placeholder")}
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute hover:bg-transparent right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            aria-label={
                              showPassword
                                ? t("login.hide-password")
                                : t("login.show-password")
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full shadow-md active:scale-95 font-semibold transition-all duration-300 hover:shadow-lg focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? t("login.signing-in") : t("login.sign-in")}
                </Button>
              </form>
            </Form>
          </section>
        </article>
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
