"use client";

import { useState } from "react";
import Image from "next/image";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { showToast } from "@/components/shared/common/app-toast";
import { useAuthState } from "@/redux/features/auth/store/state/auth-state";
import { login } from "@/redux/features/auth/store/thunks/auth-thunks";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { isLoading, error, dispatch } = useAuthState();

  // Create form schema
  const formSchema = z.object({
    userIdentifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userIdentifier: "phatmenghor19@gmail.com",
      password: "88889999",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      const result = await dispatch(
        login({
          userIdentifier: values.userIdentifier || "",
          password: values.password,
        })
      ).unwrap();

      if (result) {
        showToast.success("Welcome to the emenu dashboard!");
        router.replace(ROUTES.DASHBOARD.USERS);
      }
    } catch (err: any) {
      showToast.error(error || "Login failed. Please try again.");
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side with CPBank background image */}
      <div className="hidden flex-1 relative lg:block">
        <Image
          src="/assets/image/cpbank.png"
          alt="CPBank Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side with login form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-md border border-gray-200 shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Panel Login
            </h1>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email/Username Field */}
                <FormField
                  control={form.control}
                  name="userIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email or Username
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            {...field}
                            id="userIdentifier"
                            type="text"
                            placeholder="name@example.com"
                            disabled={isLoading}
                            autoComplete="email"
                            className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            onKeyDown={handleKeyPress}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Password
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pl-10 pr-10 h-11 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            onKeyDown={handleKeyPress}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold mt-6"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            {/* Footer Links */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
