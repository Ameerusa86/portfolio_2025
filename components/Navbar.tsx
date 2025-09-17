"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Menu, X, Home, User, Briefcase, Mail, FileText } from "lucide-react";
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
      <Link
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
      >
        Skip to content
      </Link>
      <div className="site-container">
        <div className="relative rounded-3xl bg-card/70 text-foreground shadow-[0_2px_6px_-1px_rgba(0,0,0,.30),0_0_0_1px_rgba(0,0,0,.25)] border border-border backdrop-blur-md">
          {/* Desktop Navigation: logo left, links right */}
          <div className="hidden md:flex items-center h-16 px-8 gap-6 justify-between">
            {/* Brand left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" aria-label="Home">
                <Image
                  src="/Images/Logo.png"
                  alt="Ameer Hasan logo"
                  width={64}
                  height={64}
                  className="rounded-lg"
                  priority
                />
              </Link>
            </div>
            {/* Right nav */}
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
                      "group relative px-3 py-2 rounded-lg transition-all duration-200 " +
                      (active
                        ? "text-foreground bg-accent/30"
                        : "text-muted-foreground hover:bg-accent/30 hover:text-foreground")
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                    <span
                      className={
                        "absolute left-3 right-3 -bottom-1 h-[2px] rounded-full bg-primary/90 transform origin-left scale-x-0 transition-transform duration-300 " +
                        (active ? "scale-x-100" : "group-hover:scale-x-100")
                      }
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center h-16 px-6 justify-between">
            <Link href="/" className="flex items-center" aria-label="Home">
              <Image
                src="/Images/Logo.png"
                alt="Ameer Hasan logo"
                width={48}
                height={48}
                className="rounded-sm"
                priority
              />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="h-9 w-9 p-0 text-foreground hover:bg-accent/30"
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
            <div className="px-6 py-4 space-y-1 border-t border-border bg-card/70">
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
                        "px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 " +
                        (active
                          ? "text-foreground bg-accent/30"
                          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground")
                      }
                      aria-current={active ? "page" : undefined}
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
