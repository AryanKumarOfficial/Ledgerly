"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendColor?: string;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendColor = "text-red-500",
  children,
}) => (
  <div className="rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {title}
    </p>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
      {value}
    </h2>

    {trend && <p className={`text-sm mt-2 ${trendColor}`}>{trend}</p>}

    {subtitle && (
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
        {subtitle}
      </p>
    )}

    {children}
  </div>
);

interface CardItemProps {
  brand: string;
  brandColor: string;
  name: string;
  lastFour: string;
  amount: string;
  dueText: string;
}

const CardItem: React.FC<CardItemProps> = ({
  brand,
  brandColor,
  name,
  lastFour,
  amount,
  dueText,
}) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-white/30 dark:border-white/10 transition hover:shadow-md">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-8 ${brandColor} rounded flex items-center justify-center text-xs text-white font-bold`}
      >
        {brand}
      </div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ends in •••• {lastFour}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-slate-900 dark:text-white">{amount}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{dueText}</p>
    </div>
  </div>
);

interface AlertCardProps {
  type: "danger" | "info";
  message: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ type, message }) => {
  const styles =
    type === "danger"
      ? "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
      : "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";

  return (
    <div className={`p-4 rounded-xl ${styles}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    {
      title: "Total Outstanding Liability",
      value: "$4,250.00",
      trend: "+12% from last month",
      trendColor: "text-red-500",
    },
    {
      title: "Next Payment Due",
      value: "Oct 24",
      subtitle: "$450.00 on Chase Sapphire",
    },
    {
      title: "Total Credit Utilization",
      value: "28%",
    },
  ];

  const cards = [
    {
      brand: "VISA",
      brandColor: "bg-blue-900",
      name: "Chase Sapphire Preferred",
      lastFour: "4209",
      amount: "$1,250.00",
      dueText: "Due in 5 days",
    },
    {
      brand: "MC",
      brandColor: "bg-orange-500",
      name: "Capital One Venture",
      lastFour: "8831",
      amount: "$3,000.00",
      dueText: "Due in 14 days",
    },
  ];

  const alerts = [
    {
      type: "danger" as const,
      message:
        "Action Required: Your Chase Sapphire bill is due in 5 days. Avoid late fees by scheduling a payment.",
    },
    {
      type: "info" as const,
      message:
        "Simulation Insight: Paying an extra $200 this month will save $45 in interest over 3 months.",
    },
  ];

  return (
    <section className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Financial Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, {user.name}.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
          + Add New Card
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat}>
            {stat.title === "Total Credit Utilization" && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "28%" }}
                />
              </div>
            )}
          </StatCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Cards
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <CardItem key={index} {...card} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Smart Alerts
          </h3>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard key={index} {...alert} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
