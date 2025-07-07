import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  FileText,
  Eye,
  TrendingUp,
  Plus,
  Calendar,
  Activity,
} from "lucide-react";
import Link from "next/link";

const AdminPage = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      change: "+2 this month",
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Blog Posts",
      value: "8",
      change: "+1 this week",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Page Views",
      value: "1,234",
      change: "+15% this month",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Engagement",
      value: "89%",
      change: "+5% this week",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentActivity = [
    {
      action: "Created new project",
      item: "E-commerce Dashboard",
      time: "2 hours ago",
    },
    {
      action: "Updated project",
      item: "Task Management App",
      time: "1 day ago",
    },
    {
      action: "Published blog post",
      item: "React Best Practices",
      time: "3 days ago",
    },
    {
      action: "Updated portfolio",
      item: "About page content",
      time: "1 week ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" asChild>
            <Link href="/">
              <Eye className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/projects">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/projects">
                <FolderOpen className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/blogs">
                <FileText className="mr-2 h-4 w-4" />
                Write Blog Post
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/">
                <Eye className="mr-2 h-4 w-4" />
                Preview Site
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.action}{" "}
                      <span className="text-primary">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Published</span>
                <span className="font-medium">10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Featured</span>
                <span className="font-medium">3</span>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="font-medium">2 new projects</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Last Update
                </span>
                <span className="font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Views
                </span>
                <span className="font-medium">1,234</span>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/">View Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
