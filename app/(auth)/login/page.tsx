"use client"
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { Bug, CheckCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { loginAction } from "@/server/auth/login.actions";
import { errorToast, successToast } from "@/components/shared/app-toast";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { loginFormSchema } from "@/utils/schema/auth";

export default function Login() {
  const router = useRouter();

  // if already logged in
  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const [isPending, startTransition] = useTransition();
  const [isPendingGoogle, startGoogleTransition] = useTransition();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    startTransition(async () => {
      const { success, errorMessage } = await loginAction(data);
      if (success) {
        router.push("/dashboard");
        successToast("Login Successful!!", 2000);
      } else {
        errorToast(errorMessage);
      }
    });
  }

  return (
    <section
      id="login"
      className="bg-app-blue-1 px-4 pt-5 pb-10 md:px-0 md:pt-10 md:pb-15 lg:px-0 lg:pt-20 lg:pb-32 scroll-mt-[100rem]"
    >
      <form
        id="login-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted m-auto h-fit w-full max-w-[500px] overflow-hidden rounded-lg border shadow-md shadow-zinc-950/5"
      >
        <div className="bg-card -m-px rounded-lg border px-4 py-6 md:px-7 md:py-8 lg:px-8 lg:py-10">
          <div className="text-center">
        
            <h1 className="mt-4 text-base font-semibold md:text-xl">Sign In</h1>
            <h1 className="mb-1 text-base font-semibold md:text-xl">
              Fin Pay
            </h1>
            <p className="text-xs md:text-sm">
              Welcome back! Sign in to continue
            </p>
          </div>

          <FieldGroup>
            <div className="mt-6 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="block text-xs font-medium text-black md:text-sm"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="email@example.com"
                        className="focus-visible:border-app-black-1 focus-visible:ring-tranparent focus:ring-app-black-1 rounded-2xl py-5 text-sm transition focus:border-transparent focus:outline-none focus-visible:ring-1 md:py-6 md:text-base"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="space-y-0.5">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="password"
                          className="block text-xs font-medium text-black md:text-sm"
                        >
                          Password
                        </FieldLabel>
                        
                      </div>

                      <Input
                        {...field}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Your Password"
                        className="focus-visible:border-app-black-1 focus-visible:ring-tranparent focus:ring-app-black-1 rounded-2xl px-4 py-5 text-sm transition focus:border-transparent focus:outline-none focus-visible:ring-1 md:py-6 md:text-base"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Field>
                <Button
                  type="submit"
                  form="login-form"
                  className="bg-app-soft-green hover:bg-app-soft-green/80 mt-2 w-full cursor-pointer rounded-2xl py-5 text-black md:py-6"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner />
                  ) : (
                    <span className="text-sm md:text-base">Log in</span>
                  )}
                </Button>
              </Field>
            </div>
          </FieldGroup>

        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-xs md:text-sm">
            Don't have an account ?
            <Button variant="link" className="px-2">
              <Link
                href="/signup"
                className="text-sm font-semibold md:text-base"
              >
                Create account
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
