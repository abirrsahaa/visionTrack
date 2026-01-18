"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/stores";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  timezone: z.string().min(1, "Please select a timezone"),
});

type SignupForm = z.infer<typeof signupSchema>;

// Common timezones - in production, use a proper timezone library
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setTokens, isAuthenticated } = useAuthStore();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Auto-detect timezone
  const [detectedTimezone] = useState(() => {
    if (typeof window !== "undefined") {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return "America/New_York";
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      timezone: detectedTimezone,
    },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: (data: SignupForm) => api.auth.register(data),
    onSuccess: (response) => {
      console.log("Signup successful:", response);
      setUser(response.user);
      setTokens(response.tokens);
      
      // Wait for state and cookies to be set, then redirect
      setTimeout(() => {
        // Use window.location for a hard redirect to ensure middleware sees the cookie
        window.location.href = "/dashboard";
      }, 200);
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    },
  });

  const onSubmit = (data: SignupForm) => {
    signup(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Transform your effort into visual art
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register("name")}
              type="text"
              label="Full name"
              placeholder="John Doe"
              error={errors.name?.message}
              autoComplete="name"
            />
            <Input
              {...register("email")}
              type="email"
              label="Email address"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
            />
            <Input
              {...register("password")}
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <div className="w-full">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Timezone
              </label>
              <select
                {...register("timezone")}
                id="timezone"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onChange={(e) => setValue("timezone", e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              {errors.timezone && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.timezone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
              disabled={isPending}
            >
              Create account
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}