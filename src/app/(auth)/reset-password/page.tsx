"use client";
import { Button } from "@/components/ui/button";
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
  InputGroupButton,
} from "@/components/ui/input-group";
import { resetPassword } from "@/lib/api/auth.api";
import { passwordSchema } from "@/lib/schema/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye, Loader2, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Separator } from "@/components/ui/separator";
const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const router = useRouter();
  const resetSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .superRefine((form, ctx) => {
      if (form.password !== form.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: `Password diddn't Match`,
        });
      }
    });

  type Reset = z.infer<typeof resetSchema>;

  const hookForm = useForm<Reset>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");
  if (!token || !uid) {
    return (
      <main className="flex justify-center items-center w-full my-10">
        <Card className="w-full sm:max-w-md">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Invalid or Expired Link
            </CardTitle>
            <CardDescription>
              This password reset link is no longer valid.
            </CardDescription>
          </CardHeader>

          <Separator decorative className="container mx-auto" />

          <CardContent className="flex justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardContent>

          <Separator decorative />

          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:text-primary/50"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const onSubmit = async (data: Reset) => {
    try {
      const preparedData = {
        token,
        uid,
        newPassword: data.confirmPassword,
      };

      const result = await resetPassword(preparedData);
      if (!result.success) {
        toast.error(result.message || "Failed to reset password");
        return;
      }

      toast.success(result.message || `Password Updated`);
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <main className="flex justify-center items-center w-full my-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Reset Your Password
          </CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>

        <Separator decorative className="container mx-auto" />

        <CardContent>
          <form
            id="reset-password-form"
            onSubmit={hookForm.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              {/* New Password */}
              <Controller
                name="password"
                control={hookForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>

                      <InputGroupInput
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="******"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />

                      <InputGroupButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={hookForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>

                      <InputGroupInput
                        {...field}
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="******"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />

                      <InputGroupButton
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
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
                size="lg"
                disabled={hookForm.formState.isSubmitting}
              >
                {hookForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating your password...
                  </>
                ) : (
                  <>
                    Update Password
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
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:text-primary/50"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ResetPasswordPage;
