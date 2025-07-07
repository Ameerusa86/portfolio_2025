import { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-border">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Main
              </p>
              <AdminNavLink href="/admin" icon={LayoutDashboard}>
                Dashboard
              </AdminNavLink>
              <AdminNavLink href="/admin/projects" icon={FolderOpen}>
                Projects
              </AdminNavLink>
              <AdminNavLink href="/admin/blogs" icon={FileText}>
                Blog Posts
              </AdminNavLink>
            </div>

            <div className="pt-6 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Other
              </p>
              <AdminNavLink href="/" icon={Home}>
                View Site
              </AdminNavLink>
              <AdminNavLink href="/admin/settings" icon={Settings}>
                Settings
              </AdminNavLink>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:pl-64 w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: any;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
      {children}
    </Link>
  );
}
