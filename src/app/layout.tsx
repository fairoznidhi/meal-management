'use client'
//import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/QueryProvider";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { QueryClient } from "@tanstack/react-query";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




{/*export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};*/}
const queryClient= new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><SessionProvider>
        <QueryProvider>{children}</QueryProvider></SessionProvider>
      
      </body>
    </html>
  );
}
