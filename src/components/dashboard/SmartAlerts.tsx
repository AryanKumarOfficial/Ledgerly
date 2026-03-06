import AlertCard from "./AlertCard";
import { alerts } from "@/lib/data/dashboardData";

export default function SmartAlerts() {
  return (
    <div className="rounded-2xl p-6 bg-card border shadow">
      <h3 className="text-lg font-bold mb-6">Smart Alerts</h3>

      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <AlertCard key={i} type={alert.type} message={alert.message} />
        ))}
      </div>
    </div>
  );
}
