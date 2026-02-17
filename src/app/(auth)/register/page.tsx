"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  frontendRegisterSchema,
  Register,
  registerSchema,
} from "@/lib/schema/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { registerThunk } from "@/lib/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { clearError } from "@/lib/features/auth/authSlice";

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const hookform = useForm<Register>({
    resolver: zodResolver(frontendRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: Register) => {
    try {
      const message = await dispatch(registerThunk(data)).unwrap();
      toast.success(
        "Account created successfully! Please check your email to activate your account.",
      );
      toast.success("Account created!", {
        description: message as string,
        duration: 5000,
      });
      hookform.reset();
      router.push("/login");
    } catch {}
  };

  return (
    <main className="flex justify-center items-center w-full my-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Help us improve by reporting bugs you encounter.
          </CardDescription>
        </CardHeader>
        <Separator decorative={true} className="container mx-auto" />
        <CardContent>
          <form
            id="registration-form"
            onSubmit={hookform.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your Name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your Email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="+91 12586 75925"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="*******"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="conformPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="conformPassword"
                      aria-invalid={fieldState.invalid}
                      placeholder="conformPassword"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <Separator decorative={true} className="container mx-auto" />
        <CardFooter>
          <Field
            orientation={"horizontal"}
            className="flex flex-wrap justify-between"
          >
            <Button
              type="button"
              variant={"outline"}
              onClick={() => hookform.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="registration-form">
              {loading ? `Registering` : `Register`}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </main>
  );
};

export default RegisterPage;
