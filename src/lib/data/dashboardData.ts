export const stats = [
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

export const cards = [
  {
    brand: "VISA",
    brandColor: "bg-blue-900",
    name: "Chase Sapphire Preferred",
    lastFour: "4209",
    amount: "$1,250.00",
    dueText: "Due in 5 days",
  },
];

export const alerts = [
  {
    type: "danger" as const,
    message: "Action Required: Your Chase Sapphire bill is due in 5 days.",
  },
  {
    type: "info" as const,
    message: "Simulation Insight: Paying an extra $200 saves $45 interest.",
  },
];
