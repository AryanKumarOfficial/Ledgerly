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
import { loginSchema, Login } from "@/lib/schema/login";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { loginThunk } from "@/lib/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { clearError } from "@/lib/features/auth/authSlice";
import { ArrowRight, Loader2, Mail, EyeOff, Eye, Lock } from "lucide-react";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Controller, useForm } from "react-hook-form";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const hookform = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [router, isAuthenticated, dispatch]);

  const onSubmit = async (data: Login) => {
    try {
      const message = await dispatch(loginThunk(data)).unwrap();
      toast.success("Logged In!", {
        description: message as string,
        duration: 5000,
      });
      hookform.reset();
    } catch {}
  };

  return (
    <main className="flex justify-center items-center w-full my-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your credentails below to login to your account
          </CardDescription>
        </CardHeader>
        <Separator decorative={true} className="container mx-auto" />
        <CardContent>
          <form id="login-form" onSubmit={hookform.handleSubmit(onSubmit)}>
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
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> logging In
                    to your account...
                  </>
                ) : (
                  <>
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <Separator decorative={true} className="justify-center" />
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have account yet?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:text-primary/50"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;
