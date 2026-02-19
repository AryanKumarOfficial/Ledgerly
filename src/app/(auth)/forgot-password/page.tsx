"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";
import { forgotPassword } from "@/lib/api/auth.api";

/* ---------------- SCHEMA ---------------- */

const forgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

/* ---------------- COMPONENT ---------------- */

const ForgetPassword: React.FC = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email")?.trim() || "";

  const [loading, setLoading] = useState(false);

  const hookform = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailParam,
    },
  });

  const handleSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const result = await forgotPassword(data.email);
      if (result.status === 500) {
        toast.error(`Failed to send Link`, {
          description: result?.data?.message || "",
        });
      }
      toast.success(result.data.message || "Reset link sent");
      hookform.reset();
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center min-h-screen">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Forgot your password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we’ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <Separator decorative className="container mx-auto" />

        <CardContent>
          <form onSubmit={hookform.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <Separator decorative className="justify-center" />

        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:text-primary/50"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default ForgetPassword;
