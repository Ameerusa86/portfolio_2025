"use client";

import React, { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  pageViews: number;
  engagement: number;
  growth: {
    projects: number;
    blogs: number;
    views: number;
    engagement: number;
  };
  recentActivity: Array<{
    action: string;
    item: string;
    time: string;
  }>;
}

const AdminPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const dashboardStats = [
    {
      title: "Total Projects",
      value: stats.totalProjects.toString(),
      change: `+${stats.growth.projects} this month`,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs.toString(),
      change: `+${stats.growth.blogs} this week`,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Page Views",
      value: stats.pageViews.toLocaleString(),
      change: `+${stats.growth.views}% this month`,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Engagement",
      value: `${stats.engagement}%`,
      change: `+${stats.growth.engagement}% this week`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 w-full">
      <div className="w-full px-6 lg:px-8 py-8 space-y-8 max-w-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
              Welcome back! Here's what's happening with your portfolio.
            </p>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            <Button
              variant="outline"
              asChild
              className="hover:bg-gray-50 border-gray-300"
            >
              <Link href="/">
                <Eye className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/admin/projects">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.color} p-4 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300`}
                  >
                    <stat.icon className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold">
                <Plus className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/projects">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Add New Project
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/blogs">
                  <FileText className="mr-2 h-4 w-4" />
                  Write Blog Post
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
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
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
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
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Published
                  </span>
                  <span className="font-medium">{stats.publishedProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Drafts</span>
                  <span className="font-medium">{stats.draftProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Featured
                  </span>
                  <span className="font-medium">{stats.featuredProjects}</span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/projects">Manage Projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Projects
                  </span>
                  <span className="font-medium">{stats.totalProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Blogs
                  </span>
                  <span className="font-medium">{stats.totalBlogs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Page Views
                  </span>
                  <span className="font-medium">
                    {stats.pageViews.toLocaleString()}
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/">View Site</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
