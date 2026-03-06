import CardItem from "./CardItem";
import { cards } from "@/lib/data/dashboardData";

export default function ActiveCards() {
  return (
    <div className="lg:col-span-2 rounded-2xl p-6 bg-card border shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Active Cards</h3>
        <button className="text-sm text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <CardItem key={card.lastFour} {...card} />
        ))}
      </div>
    </div>
  );
}