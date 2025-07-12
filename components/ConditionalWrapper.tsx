"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ConditionalWrapperProps {
  children: ReactNode;
}

export function ConditionalWrapper({ children }: ConditionalWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes get full-width treatment with no navbar/footer
    return <>{children}</>;
  }

  // Frontend routes get the traditional layout with navbar, footer, and responsive container
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
