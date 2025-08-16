"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code,
  Home,
  User,
  Briefcase,
  Mail,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Detect scroll for elevated style
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: User },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <header
      className={
        "sticky top-3 z-50 w-full px-3 transition-all duration-300 " +
        (isScrolled ? "" : "")
      }
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-full bg-[#080707]/95 text-white shadow-[0_2px_6px_-1px_rgba(0,0,0,.5),0_0_0_1px_rgba(255,255,255,.06)] ring-1 ring-white/10 backdrop-blur-md">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 px-6 gap-4">
            {/* Left nav */}
            <nav
              className="hidden md:flex items-center gap-8 text-sm font-medium"
              aria-label="Primary"
            >
              {navigationItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={
                      "relative transition-colors hover:text-white " +
                      (active ? "text-white" : "text-zinc-400")
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                    <span
                      className={
                        "absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-white/90 transform origin-left scale-x-0 transition-transform duration-300 " +
                        (active ? "scale-x-100" : "group-hover:scale-x-100")
                      }
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Brand center */}
            <div className="justify-self-center">
              <Link
                href="/"
                className="font-extrabold text-lg tracking-wide select-none"
              >
                AmeerHasan.dev
              </Link>
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center justify-end gap-6 text-sm font-medium">
              <Link
                href="/admin"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-orange-400 active:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-colors"
              >
                Start Testing
              </Link>
            </div>

            {/* Mobile: brand left, burger right overlaying grid (shown only < md) */}
            <div className="flex md:hidden col-span-3 items-center justify-between w-full">
              <Link href="/" className="font-bold tracking-wide text-base py-2">
                AmeerHasan.dev
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="h-9 w-9 p-0 text-white hover:bg-white/10"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-6 pb-6 space-y-4">
              <nav className="flex flex-col gap-3" aria-label="Mobile Primary">
                {navigationItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={
                        "text-sm font-medium transition-colors " +
                        (active
                          ? "text-white"
                          : "text-zinc-300 hover:text-white")
                      }
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-zinc-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-400 active:bg-orange-500 transition-colors"
                >
                  Start Testing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
