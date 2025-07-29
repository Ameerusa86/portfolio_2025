import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalWrapper } from "@/components/ConditionalWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ameer Hasan – Portfolio",
  description:
    "Portfolio site built with Next.js 15, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          "h-full bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ConditionalWrapper>{children}</ConditionalWrapper>
        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
