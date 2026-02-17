import { baseEnv } from "@/env";
import { ModeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the {baseEnv.appName}</h1>
      <ModeToggle />
    </main>
  );
}
