"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Home,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const mainNavigation = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: FolderOpen,
    },
    {
      title: "Blog Posts",
      url: "/admin/blogs",
      icon: FileText,
    },
  ];

  const otherNavigation = [
    {
      title: "View Site",
      url: "/",
      icon: Home,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl"
      >
        <SidebarHeader className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <span className="text-white font-bold">A</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="font-bold text-lg text-gray-900">
                AmeerHasan.dev
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* User Profile Section */}
          <SidebarGroup>
            <div className="px-4 py-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-gray-100 hover:to-blue-50/50 transition-all duration-200 cursor-pointer border border-gray-100/50 shadow-sm group-data-[collapsible=icon]:justify-center">
                <div className="h-8 w-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium text-gray-900">
                    Ameer Hasan
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </SidebarGroup>

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={cn(
                        "rounded-xl border transition-all duration-200",
                        pathname === item.url
                          ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border-blue-400/50 scale-[1.02]"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 border-transparent hover:border-gray-200/50 hover:shadow-sm"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={cn(
                            "transition-all duration-200",
                            pathname === item.url
                              ? "text-white drop-shadow-sm"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Other Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Other
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {otherNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={cn(
                        "rounded-xl border transition-all duration-200",
                        pathname === item.url
                          ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border-blue-400/50 scale-[1.02]"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 border-transparent hover:border-gray-200/50 hover:shadow-sm"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={cn(
                            "transition-all duration-200",
                            pathname === item.url
                              ? "text-white drop-shadow-sm"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200 bg-gray-50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl">
                <LogOut className="group-hover:text-red-600 transition-colors" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-100">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                AmeerHasan.dev
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <SidebarTrigger className="hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105" />
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
