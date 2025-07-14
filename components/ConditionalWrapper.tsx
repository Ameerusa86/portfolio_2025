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

  // Frontend routes get full-screen layout with navbar and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
