"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      section: "Main",
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderOpen,
      section: "Main",
    },
    {
      name: "Blog Posts",
      href: "/admin/blogs",
      icon: FileText,
      section: "Main",
    },
    {
      name: "View Site",
      href: "/",
      icon: Home,
      section: "Other",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      section: "Other",
    },
  ];

  const groupedNavigation = navigation.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  return (
    <div className="min-h-screen bg-gray-50/30 w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden border-b shadow-sm px-4 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-100">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">AmeerHasan.dev</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 z-50 flex flex-col bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-2xl transition-all duration-300 ease-in-out group",
            "lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            sidebarCollapsed ? "lg:w-16 hover:lg:w-72" : "lg:w-72",
            "w-72" // Mobile width
          )}
          onMouseEnter={() => {
            if (sidebarCollapsed) {
              // Optional: Auto-expand on hover - uncomment if desired
              // setSidebarCollapsed(false);
            }
          }}
        >
          {/* Sidebar Header */}
          <div
            className={cn(
              "flex items-center justify-between h-16 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm relative",
              sidebarCollapsed ? "px-3" : "px-6"
            )}
          >
            {/* Collapsed state indicator */}
            {sidebarCollapsed && (
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-full opacity-60"></div>
            )}

            <div
              className={cn(
                "flex items-center",
                sidebarCollapsed ? "justify-center w-full" : "space-x-3"
              )}
            >
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-white font-bold">A</span>
              </div>
              {!sidebarCollapsed && (
                <div className="lg:block">
                  <h1 className="font-bold text-lg text-gray-900">
                    AmeerHasan.dev
                  </h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "hidden lg:flex p-1 hover:bg-gray-100 rounded-lg transition-all duration-200",
                sidebarCollapsed &&
                  "absolute -right-12 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md hover:shadow-lg z-10"
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* User Profile Section */}
          <div
            className={cn(
              "py-4 border-b border-gray-100/50",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
          >
            <div
              className={cn(
                "flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-gray-100 hover:to-blue-50/50 transition-all duration-200 cursor-pointer border border-gray-100/50 shadow-sm",
                sidebarCollapsed ? "justify-center p-2" : "space-x-3"
              )}
            >
              <div
                className={cn(
                  "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md",
                  sidebarCollapsed ? "h-10 w-10" : "h-8 w-8"
                )}
              >
                <User
                  className={cn(
                    "text-white",
                    sidebarCollapsed ? "h-5 w-5" : "h-4 w-4"
                  )}
                />
              </div>
              {!sidebarCollapsed && (
                <div className="lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    Ameer Hasan
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 py-6 space-y-6 overflow-y-auto",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
          >
            {Object.entries(groupedNavigation).map(([section, items]) => (
              <div
                key={section}
                className={cn("space-y-2", sidebarCollapsed && "space-y-1")}
              >
                {!sidebarCollapsed && (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
                    {section}
                  </p>
                )}
                <div
                  className={cn("space-y-1", sidebarCollapsed && "space-y-2")}
                >
                  {items.map((item) => (
                    <AdminNavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      isActive={pathname === item.href}
                      collapsed={sidebarCollapsed}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.name}
                    </AdminNavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div
            className={cn(
              "p-4 border-t border-gray-200 bg-gray-50",
              sidebarCollapsed && "px-2"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors group rounded-xl",
                sidebarCollapsed
                  ? "justify-center w-12 h-12 p-0 mx-auto"
                  : "w-full justify-start"
              )}
            >
              <LogOut
                className={cn(
                  "group-hover:text-red-600 transition-colors",
                  sidebarCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
                )}
              />
              {!sidebarCollapsed && <span>Sign out</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 min-h-screen w-full overflow-x-hidden",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
          )}
        >
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({
  href,
  icon: Icon,
  children,
  isActive,
  collapsed,
  onClick,
}: {
  href: string;
  icon: any;
  children: ReactNode;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center text-sm font-medium rounded-xl transition-all duration-200 group relative border",
        collapsed ? "justify-center w-12 h-12 p-0 mx-auto" : "px-3 py-3",
        isActive
          ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border-blue-400/50 scale-[1.02]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 border-transparent hover:border-gray-200/50 hover:shadow-sm"
      )}
      title={collapsed ? children?.toString() : undefined}
    >
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0 transition-all duration-200",
          collapsed ? "" : "mr-3",
          isActive
            ? "text-white drop-shadow-sm"
            : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
        )}
      />
      {!collapsed && <span className="font-medium">{children}</span>}

      {/* Enhanced Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-700/50">
          {children}
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45"></div>
        </div>
      )}
    </Link>
  );
}
