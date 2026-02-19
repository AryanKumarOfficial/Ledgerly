"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/lib/hooks";

const ProfilePage: React.FC = () => {
  const { user, isInitializing } = useAppSelector((state) => state.auth);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" defaultValue={user.name} />

            <FormInput
              label="Email Address"
              type="email"
              defaultValue={user.email}
              disabled
            />

            <FormInput label="Phone Number" defaultValue={user.phone || ""} />

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Timezone
              </label>
              <select
                defaultValue={user.timezone || "UTC"}
                className="w-full px-4 py-2.5 rounded-xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">
                  Eastern Time (US & Canada)
                </option>
                <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              onClick={() => setIsUpdatingProfile(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg">
        <h2 className="text-xl font-semibold mb-8 text-slate-900 dark:text-white border-b border-white/20 dark:border-white/10 pb-4">
          Security
        </h2>

        <form
          className="space-y-6 max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormInput label="Current Password" type="password" />
          <FormInput label="New Password" type="password" />
          <FormInput label="Confirm New Password" type="password" />

          <button
            type="submit"
            onClick={() => setIsChangingPassword(true)}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;

interface FormInputProps {
  label: string;
  type?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  defaultValue,
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      defaultValue={defaultValue}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    />
  </div>
);
