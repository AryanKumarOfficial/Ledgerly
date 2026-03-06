"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import CreditUtilization from "@/components/dashboard/CreditUtilization";
import ActiveCards from "@/components/dashboard/ActiveCards";
import SmartAlerts from "@/components/dashboard/SmartAlerts";

import { stats } from "@/lib/data/dashboardData";
import { AddCardDialog } from "@/components/shared/AddCard";

export default function DashboardPage() {
  const { user, isInitializing } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="space-y-10">
      <DashboardHeader
        name={user.name}
        onAddCard={() => setOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat}>
            {stat.title === "Total Credit Utilization" && (
              <CreditUtilization percent={28} />
            )}
          </StatCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActiveCards />
        <SmartAlerts />
      </div>

      <AddCardDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}