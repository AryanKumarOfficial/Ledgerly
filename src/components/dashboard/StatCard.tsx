import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendColor?: string;
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendColor = "text-red-500",
  children,
}: Props) {
  return (
    <Card className="rounded-2xl backdrop-blur-md">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>

        <h2 className="text-3xl font-bold mt-2">{value}</h2>

        {trend && (
          <p className={`text-sm mt-2 ${trendColor}`}>
            {trend}
          </p>
        )}

        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}

        {children}
      </CardContent>
    </Card>
  );
}