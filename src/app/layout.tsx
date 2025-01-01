"use client"
import "./globals.css";
import { QueryClientProvider,QueryClient } from "@tanstack/react-query"
const queryClient= new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
