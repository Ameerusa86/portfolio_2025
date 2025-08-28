import type { Metadata } from "next";
import { Lato, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalWrapper } from "@/components/ConditionalWrapper";

// Body text: Lato – readable sans-serif
const bodySans = Lato({
  variable: "--font-body",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Headlines: Playfair Display – strong editorial serif
const headlineDisplay = Playfair_Display({
  variable: "--font-headline",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
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
          "h-full bg-background font-sans antialiased scroll-smooth",
          bodySans.variable,
          headlineDisplay.variable,
          geistMono.variable
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] px-4 py-2 rounded-md bg-primary text-primary-foreground shadow"
        >
          Skip to content
        </a>
        <ConditionalWrapper>
          <div id="main-content" className="contents">
            {children}
          </div>
        </ConditionalWrapper>
        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
