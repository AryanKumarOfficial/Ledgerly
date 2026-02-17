"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { frontendRegisterSchema, Register } from "@/lib/schema/register";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { registerThunk } from "@/lib/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { clearError } from "@/lib/features/auth/authSlice";
import {
  ArrowRight,
  Loader2,
  Mail,
  User,
  Phone,
  EyeOff,
  Eye,
  Lock,
} from "lucide-react";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Controller, useForm } from "react-hook-form";

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your account
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
                    <InputGroup>
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="name"
                        placeholder="John Doe"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
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

              <Controller
                name="phone"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Phone />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
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
              <Controller
                name="confirmPassword"
                control={hookform.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="conformPassword">
                      Confirm Password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="******"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupButton
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
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
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <Separator decorative={true} className="justify-center" />
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:text-primary/50"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default RegisterPage;
