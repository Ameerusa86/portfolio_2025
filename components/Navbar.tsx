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
        "sticky top-4 z-50 w-full px-4 transition-all duration-300 " +
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
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl bg-gradient-to-r from-white/85 via-white/80 to-white/70 text-zinc-800 shadow-[0_2px_6px_-1px_rgba(0,0,0,.15),0_0_0_1px_rgba(0,0,0,.05)] ring-1 ring-zinc-200 backdrop-blur-md">
          {/* Desktop Navigation */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16 px-8 gap-6">
            {/* Left nav */}
            <nav
              className="flex items-center gap-6 text-sm font-medium"
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
                      "relative px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-zinc-900 " +
                      (active
                        ? "text-zinc-900 bg-gradient-to-r from-blue-50 to-purple-50"
                        : "text-zinc-500")
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                    <span
                      className={
                        "absolute left-3 right-3 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 transform origin-left scale-x-0 transition-transform duration-300 " +
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
                className="font-extrabold text-lg tracking-wide select-none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                AmeerHasan.dev
              </Link>
            </div>

            {/* Right side now empty spacer for symmetry */}
            <div className="flex items-center justify-end gap-6 text-sm font-medium" />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center h-16 px-6 justify-between">
            <Link
              href="/"
              className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              AmeerHasan.dev
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="h-9 w-9 p-0 text-zinc-700 hover:bg-zinc-900/5"
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

          {/* Mobile dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
              isMenuOpen ? "max-h-72" : "max-h-0"
            }`}
          >
            <div className="px-6 py-4 space-y-1 border-t border-zinc-200/70">
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
                        "px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-zinc-900 " +
                        (active
                          ? "text-zinc-900 bg-gradient-to-r from-blue-50 to-purple-50"
                          : "text-zinc-600")
                      }
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
