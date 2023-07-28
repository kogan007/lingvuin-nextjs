"use client";
import EmbedBuilder from "@/components/EmbedBuilder";
import RoleManager from "@/components/RoleManager";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
export default function Home() {
  return (
    <div className="flex h-screen">
      <QueryClientProvider client={queryClient}>
        <EmbedBuilder />
        <RoleManager />
      </QueryClientProvider>
    </div>
  );
}
