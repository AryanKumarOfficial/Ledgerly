import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

interface AlertCardProps {
  type: "danger" | "info";
  message: string;
}

export default function AlertCard({ type, message }: AlertCardProps) {
  const config = {
    danger: {
      icon: AlertTriangle,
      border: "border-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-300",
    },
    info: {
      icon: Info,
      border: "border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-300",
    },
  };

  const { icon: Icon, border, bg, text } = config[type];

  return (
    <Card className={`border-l-4 ${border} ${bg}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${text}`} />

        <p className={`text-sm leading-relaxed ${text}`}>
          {message}
        </p>
      </CardContent>
    </Card>
  );
}