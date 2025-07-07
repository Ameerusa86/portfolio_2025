import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

interface RecentActivity {
  action: string;
  item: string;
  time: string;
  createdAt: Date;
}

export async function GET() {
  try {
    const db = await getDb();
    
    // Get project counts
    const totalProjects = await db.collection("projects").countDocuments();
    const publishedProjects = await db.collection("projects").countDocuments({ published: true });
    const draftProjects = totalProjects - publishedProjects;
    const featuredProjects = await db.collection("projects").countDocuments({ featured: true });
    
    // Get blog counts
    const totalBlogs = await db.collection("blogs").countDocuments();
    const publishedBlogs = await db.collection("blogs").countDocuments({ status: "published" });
    const draftBlogs = await db.collection("blogs").countDocuments({ status: "draft" });
    
    // Get recent projects and blogs for activity
    const recentProjects = await db.collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
      
    const recentBlogs = await db.collection("blogs")
      .find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
    
    // Mock page views and engagement data (you can replace with real analytics later)
    const pageViews = Math.floor(Math.random() * 2000) + 1000; // Random between 1000-3000
    const engagement = Math.floor(Math.random() * 20) + 80; // Random between 80-100%
    
    // Calculate growth (mock data - you can implement real tracking later)
    const projectGrowth = Math.floor(Math.random() * 5) + 1;
    const blogGrowth = Math.floor(Math.random() * 3) + 1;
    const viewGrowth = Math.floor(Math.random() * 20) + 5;
    const engagementGrowth = Math.floor(Math.random() * 10) + 1;
    
    // Create recent activity from recent projects and blogs
    const recentActivity: RecentActivity[] = [];
    
    // Add recent projects
    recentProjects.forEach((project: any) => {
      const createdAt = project.createdAt ? new Date(project.createdAt) : new Date();
      const timeAgo = getTimeAgo(createdAt);
      recentActivity.push({
        action: "Created new project",
        item: project.title,
        time: timeAgo,
        createdAt: createdAt
      });
    });
    
    // Add recent blogs
    recentBlogs.forEach((blog: any) => {
      const createdAt = blog.createdAt ? new Date(blog.createdAt) : new Date();
      const timeAgo = getTimeAgo(createdAt);
      recentActivity.push({
        action: "Published blog post",
        item: blog.title,
        time: timeAgo,
        createdAt: createdAt
      });
    });
    
    // Sort by creation date and take the 4 most recent
    recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const limitedActivity = recentActivity.slice(0, 4);
    
    // Remove createdAt from the response as it's only used for sorting
    const cleanActivity = limitedActivity.map(({ createdAt, ...activity }) => activity);
    
    const stats = {
      totalProjects,
      publishedProjects,
      draftProjects,
      featuredProjects,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      pageViews,
      engagement,
      growth: {
        projects: projectGrowth,
        blogs: blogGrowth,
        views: viewGrowth,
        engagement: engagementGrowth
      },
      recentActivity: cleanActivity
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
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
}
