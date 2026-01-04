import type { Metadata } from "next";
import { Inter, Kumbh_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalWrapper } from "@/components/ConditionalWrapper";

// Body text: Inter (regular, medium, semibold, bold)
const bodySans = Inter({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Headlines: Kumbh Sans (regular, medium)
const headlineDisplay = Kumbh_Sans({
  variable: "--font-headline",
  weight: ["400", "500"],
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
},{verification: {google:"<meta name="google-site-verification" content="DinZqnFK7e0yyatABNoYCJVaVataoLbAcLwsRRqpj2U" />"};

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
