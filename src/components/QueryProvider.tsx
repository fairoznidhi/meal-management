"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize QueryClient in state to ensure it's client-safe
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
     
    </QueryClientProvider>
  );
};

export default QueryProvider;
