import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RecentActivity {
  action: string;
  item: string;
  time: string;
  created_at: string;
}

export async function GET() {
  try {
    // Get project counts
    const { count: totalProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    const { count: publishedProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    const { count: featuredProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("featured", true);

    const draftProjects = (totalProjects || 0) - (publishedProjects || 0);

    // Get blog counts (assuming blogs table exists, if not we'll use 0)
    const { count: totalBlogs } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true });

    const { count: publishedBlogs } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    const { count: draftBlogs } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    // Get recent projects for activity
    const { data: recentProjects } = await supabase
      .from("projects")
      .select("title, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    // Get recent blogs for activity (handle if table doesn't exist)
    const { data: recentBlogs } = await supabase
      .from("blogs")
      .select("title, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    // Mock page views and engagement data (you can replace with real analytics later)
    const pageViews = Math.floor(Math.random() * 2000) + 1000; // Random between 1000-3000
    const engagement = Math.floor(Math.random() * 20) + 80; // Random between 80-100%

    // Calculate growth (mock data - you can implement real tracking later)
    const projectGrowth = Math.floor(Math.random() * 5) + 1;
    const blogGrowth = Math.floor(Math.random() * 3) + 1;
    const viewGrowth = Math.floor(Math.random() * 20) + 5;
    const engagementGrowth = Math.floor(Math.random() * 10) + 1;

    // Create recent activity from recent projects and blogs
    const recentActivity: (RecentActivity & { created_at_date: Date })[] = [];

    // Add recent projects
    if (recentProjects) {
      recentProjects.forEach((project: Record<string, unknown>) => {
        const createdAt = project.created_at
          ? new Date(project.created_at as string)
          : new Date();
        const timeAgo = getTimeAgo(createdAt);
        recentActivity.push({
          action: "Created new project",
          item: project.title as string,
          time: timeAgo,
          created_at: project.created_at as string,
          created_at_date: createdAt,
        });
      });
    }

    // Add recent blogs
    if (recentBlogs) {
      recentBlogs.forEach((blog: Record<string, unknown>) => {
        const createdAt = blog.created_at
          ? new Date(blog.created_at as string)
          : new Date();
        const timeAgo = getTimeAgo(createdAt);
        recentActivity.push({
          action: "Published blog post",
          item: blog.title as string,
          time: timeAgo,
          created_at: blog.created_at as string,
          created_at_date: createdAt,
        });
      });
    }

    // Sort by creation date and take the 4 most recent
    recentActivity.sort(
      (a, b) =>
        new Date(b.created_at_date).getTime() -
        new Date(a.created_at_date).getTime()
    );
    const limitedActivity = recentActivity.slice(0, 4);

    // Remove created_at_date from the response as it's only used for sorting
    const cleanActivity = limitedActivity.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ created_at_date, ...activity }) => activity
    );

    const stats = {
      totalProjects: totalProjects || 0,
      publishedProjects: publishedProjects || 0,
      draftProjects,
      featuredProjects: featuredProjects || 0,
      totalBlogs: totalBlogs || 0,
      publishedBlogs: publishedBlogs || 0,
      draftBlogs: draftBlogs || 0,
      pageViews,
      engagement,
      growth: {
        projects: projectGrowth,
        blogs: blogGrowth,
        views: viewGrowth,
        engagement: engagementGrowth,
      },
      recentActivity: cleanActivity,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
}
