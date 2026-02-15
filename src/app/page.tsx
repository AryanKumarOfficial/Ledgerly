import { baseEnv } from "@/env";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the {baseEnv.appName}</h1>
    </main>
  );
}
