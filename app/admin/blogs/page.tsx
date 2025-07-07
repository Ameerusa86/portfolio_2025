import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Calendar, Eye } from "lucide-react";

const BlogsAdminPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      excerpt: "Learn the latest features and improvements in Next.js 14...",
      status: "Published",
      publishedAt: "2025-01-15",
      views: 234,
    },
    {
      id: 2,
      title: "Building Responsive UIs with Tailwind CSS",
      excerpt: "Master the art of creating beautiful, responsive interfaces...",
      status: "Draft",
      publishedAt: null,
      views: 0,
    },
    {
      id: 3,
      title: "TypeScript Best Practices for 2025",
      excerpt: "Discover the latest TypeScript patterns and practices...",
      status: "Published",
      publishedAt: "2025-01-10",
      views: 567,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog content. Write, edit, and publish articles.
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <p className="text-2xl font-bold">{blogPosts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <p className="text-2xl font-bold">
                {blogPosts.filter((p) => p.status === "Published").length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Drafts
              </p>
              <p className="text-2xl font-bold">
                {blogPosts.filter((p) => p.status === "Draft").length}
              </p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">📝</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold">
                {blogPosts.reduce((sum, post) => sum + post.views, 0)}
              </p>
            </div>
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="space-y-4">
        {blogPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Start sharing your knowledge and experiences by creating your
                first blog post.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {(() => {
                            const date = new Date(post.publishedAt);
                            const months = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ];
                            return `${
                              months[date.getMonth()]
                            } ${date.getDate()}, ${date.getFullYear()}`;
                          })()}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views} views
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-col lg:w-32">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:w-full"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:w-full"
                    >
                      {post.status === "Published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogsAdminPage;
