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
  Tag,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const mainNavigation = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Projects", url: "/admin/projects", icon: FolderOpen },
    { title: "Technologies", url: "/admin/technologies", icon: Tag },
    { title: "Blogs", url: "/admin/blogs", icon: FileText },
    { title: "About", url: "/admin/about", icon: User },
  ];

  const otherNavigation = [
    { title: "View Site", url: "/", icon: Home },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  const renderNavGroup = (
    items: {
      title: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
    }[],
    label: string
  ) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase group-data-[collapsible=icon]:hidden px-3">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "relative mx-2 my-0.5 flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors",
                        "before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-blue-500 before:to-indigo-500 before:opacity-0 before:transition-opacity",
                        isActive
                          ? "bg-zinc-900 text-white shadow-sm before:opacity-100"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 hover:before:opacity-100"
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-zinc-600"
                          )}
                        />
                        <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar
          collapsible="icon"
          className="border-r bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        >
          <SidebarHeader className="border-b border-zinc-200/60 py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                A
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="font-bold text-base tracking-tight text-zinc-900">
                  AmeerHasan.dev
                </h1>
                <p className="text-xs text-zinc-500">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Profile (static for now) */}
            <SidebarGroup>
              <div className="px-4 py-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-zinc-100/70 hover:bg-zinc-100 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium leading-none text-zinc-900">
                          Ameer Hasan
                        </p>
                        <p className="text-xs text-zinc-500">Administrator</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Ameer Hasan</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarGroup>

            {renderNavGroup(mainNavigation, "Main")}
            {renderNavGroup(otherNavigation, "Other")}
          </SidebarContent>

          <SidebarFooter className="border-t border-zinc-200/60 px-2 py-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton className="relative mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-red-600 hover:bg-red-50/80 transition-colors before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-red-500 before:to-rose-600 before:opacity-0 hover:before:opacity-100">
                      <LogOut className="h-5 w-5" />
                      <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                        Sign out
                      </span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          {/* Mobile Header */}
          <header className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-base">
                A
              </div>
              <div>
                <h1 className="font-semibold text-sm text-zinc-900 leading-none">
                  AmeerHasan.dev
                </h1>
                <p className="text-[11px] text-zinc-500">Admin Panel</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="size-8 rounded-lg hover:bg-zinc-100" />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Toggle Sidebar (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
          </header>

          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/10 w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
