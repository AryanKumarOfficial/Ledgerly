import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  onAddCard: () => void;
}

export default function DashboardHeader({ name, onAddCard }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {name}.</p>
      </div>

      <Button onClick={onAddCard}>+ Add New Card</Button>
    </header>
  );
}
