"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePassword,
  changePasswordSchema,
} from "@/lib/schema/ChnagePassword";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Check,
  ChevronsUpDown,
  CircleUser,
  Fingerprint,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { changePassword } from "@/lib/api/auth.api";
import { toast } from "sonner";
import { Profile, profileSchema } from "@/lib/schema/profile";
import { formatTimezone, getTimezones } from "@/lib/utility/time";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UpdateProfile } from "@/types/user.type";
import { updateProfileThunk } from "@/lib/features/auth/userThunks";

const ProfilePage: React.FC = () => {
  const { user, isInitializing } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const tz = React.useMemo(() => getTimezones(), []);
  const changePasswordHookForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const updateProfileHookForm = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      timezone: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const currentTz = React.useMemo(
    () => formatTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
    [],
  );
  useEffect(() => {
    if (!user) return;

    updateProfileHookForm.reset({
      fullName: user.name ?? "",
      phone: user.phone ?? "",
      timezone: user.timezone || "",
    });
  }, [user, updateProfileHookForm]);


  const onSubmitProfile = async (data: UpdateProfile) => {
    try {
      await dispatch(updateProfileThunk(data)).unwrap();
         toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error || `Something went wrong`);
    }
  };

  const onSubmitPassword = async (data: ChangePassword) => {
    try {
      const result = await changePassword(data);
      if (result.success) {
        toast.success(result.message || `Password changed successfully`);
      } else {
        toast.error(result.message || `Failed to change password`);
      }
    } catch (error) {
      toast.error((error as any).message || `Something went wrong`);
    } finally {
      changePasswordHookForm.reset();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="space-y-10 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage your personal details and account security.
        </p>
      </header>

      <div className="rounded-2xl p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg">
        <h2 className="text-xl font-semibold mb-8 text-slate-900 dark:text-white border-b border-white/20 dark:border-white/10 pb-4">
          Personal Information
        </h2>

        <form
          id="update-profile"
          className="space-y-6 flex flex-col"
          onSubmit={updateProfileHookForm.handleSubmit(onSubmitProfile)}
        >
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              control={updateProfileHookForm.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <CircleUser />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="fullName"
                      type="text"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup className="disabled:cursor-not-allowed">
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="cursor-not-allowed opacity-70"
                />
              </InputGroup>
            </Field>
            <Controller
              control={updateProfileHookForm.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="phone"
                      type="tel"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={updateProfileHookForm.control}
              name="timezone"
              render={({ field, fieldState }) => {
                const selected = tz.find((tz) => tz.value === field.value);
                const dispalyTz = selected ?? currentTz;
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          role="combobox"
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 to-muted-foreground" />
                            {dispalyTz
                              ? `(${dispalyTz.offset}) ${dispalyTz.label}`
                              : `Selected Timezone`}
                          </div>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search Timezones" />
                          <CommandList>
                            <CommandEmpty className="h-16 w-96 rounded-md flex justify-center items-center">
                              No Timezone found
                            </CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-72 w-96 rounded-md">
                                {tz.map((tz) => (
                                  <CommandItem
                                    key={tz.value}
                                    value={tz.value}
                                    onSelect={() => field.onChange(tz.value)}
                                  >
                                    <Check
                                      className={cn(
                                        `mr-2 h-4 w-4`,
                                        field.value === tz.value
                                          ? `opacity-100`
                                          : `opacity-0`,
                                      )}
                                    />
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                          ({tz.offset})
                                        </span>
                                      </div>

                                      <span className="text-muted-foreground tabular-nums">
                                        {tz.label}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                                <ScrollBar orientation="vertical" />
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <Button
            type="submit"
            className="w-fit self-end"
            disabled={updateProfileHookForm.formState.isSubmitting}
          >
            {updateProfileHookForm.formState.isSubmitting
              ? `Updating...`
              : `Update Profile`}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg">
        <h2 className="text-xl font-semibold mb-8 text-slate-900 dark:text-white border-b border-white/20 dark:border-white/10 pb-4">
          Security
        </h2>

        <form
          className="space-y-6 max-w-md"
          id="change-password"
          onSubmit={changePasswordHookForm.handleSubmit(onSubmitPassword)}
        >
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={changePasswordHookForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currentPassword">
                    Current Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Fingerprint />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="currentPassword"
                      type="password"
                      placeholder="********"
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
              name="newPassword"
              control={changePasswordHookForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Fingerprint />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="newPassword"
                      type="password"
                      placeholder="Strong Password"
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
              name="confirmPassword"
              control={changePasswordHookForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Fingerprint />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your Password"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error, fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {changePasswordHookForm.formState.isSubmitting
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
