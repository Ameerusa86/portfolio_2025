"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BlogTable from "@/components/admin/BlogTable";
import BlogFormModal from "@/components/admin/BlogFormModal";
import { BlogFormData } from "@/components/admin/BlogForm";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  Star,
  FileText,
  Heart,
} from "lucide-react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  // Load blogs from API
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      const blogData = await response.json();
      setBlogs(blogData);
      setFilteredBlogs(blogData);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      toast.error("❌ Failed to load blogs", {
        description: "Please refresh the page to try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter blogs based on search and status
  useEffect(() => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.excerpt &&
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, statusFilter]);

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async (blogSlug: string) => {
    const blog = blogs.find((b) => b.slug === blogSlug);
    const blogTitle = blog?.title || "this blog post";

    toast.warning("⚠️ Confirm Deletion", {
      description: `Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`,
      duration: 10000,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const response = await fetch(`/api/blogs/${blogSlug}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error(`Failed to delete blog: ${response.statusText}`);
            }
            setBlogs((prev) => prev.filter((blog) => blog.slug !== blogSlug));
            toast.success("✅ Blog post deleted successfully", {
              description: `"${blogTitle}" has been permanently removed.`,
            });
          } catch (error) {
            console.error("Failed to delete blog:", error);
            toast.error("❌ Failed to delete blog post", {
              description:
                "Please try again or contact support if the issue persists.",
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  const handleToggleStatus = async (
    blogSlug: string,
    status: "published" | "draft"
  ) => {
    try {
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update blog status: ${response.statusText}`);
      }
      const updatedBlog = await response.json();
      setBlogs((prev) =>
        prev.map((blog) => (blog.slug === blogSlug ? updatedBlog : blog))
      );
      const blog = blogs.find((b) => b.slug === blogSlug);
      toast.success(
        `✅ Blog post ${
          status === "published" ? "published" : "moved to draft"
        } successfully`,
        {
          description: `"${blog?.title}" status has been updated.`,
        }
      );
    } catch (error) {
      console.error("Failed to update blog status:", error);
      toast.error("❌ Failed to update blog status", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleToggleFeatured = async (blogSlug: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to update blog featured status: ${response.statusText}`
        );
      }
      const updatedBlog = await response.json();
      setBlogs((prev) =>
        prev.map((blog) => (blog.slug === blogSlug ? updatedBlog : blog))
      );
      const blog = blogs.find((b) => b.slug === blogSlug);
      toast.success(
        `⭐ Blog post ${
          featured ? "marked as featured" : "removed from featured"
        } successfully`,
        {
          description: `"${blog?.title}" feature status has been updated.`,
        }
      );
    } catch (error) {
      console.error("Failed to update blog featured status:", error);
      toast.error("❌ Failed to update featured status", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleSubmit = async (blogData: BlogFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedBlog) {
        // Update existing blog - map form data to database schema
        const updateData = {
          title: blogData.title,
          excerpt: blogData.excerpt,
          content: blogData.content,
          image: blogData.image,
          tags: blogData.tags,
          read_time: blogData.readTime,
          featured: blogData.featured || false,
          status: blogData.status,
        };
        const updatedBlogResponse = await fetch(
          `/api/blogs/${selectedBlog.slug}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );
        if (!updatedBlogResponse.ok) {
          throw new Error(
            `Failed to update blog: ${updatedBlogResponse.statusText}`
          );
        }
        const updatedBlog = await updatedBlogResponse.json();
        setBlogs((prev) =>
          prev.map((blog) =>
            blog.slug === selectedBlog.slug ? updatedBlog : blog
          )
        );
        toast.success("✅ Blog post updated successfully", {
          description: `"${blogData.title}" has been updated with your changes.`,
        });
      } else {
        // Create new blog - map form data to database schema
        const createData = {
          title: blogData.title,
          excerpt: blogData.excerpt,
          content: blogData.content,
          image: blogData.image,
          tags: blogData.tags,
          read_time: blogData.readTime,
          featured: blogData.featured || false,
          status: blogData.status,
        };
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createData),
        });
        if (!response.ok) {
          throw new Error(`Failed to create blog: ${response.statusText}`);
        }
        const newBlog = await response.json();
        setBlogs((prev) => [newBlog, ...prev]);
        toast.success("🎉 Blog post created successfully", {
          description: `"${blogData.title}" has been added to your blog collection.`,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error("❌ Failed to save blog post", {
        description: "Please check your input and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
    featured: blogs.filter((b) => b.featured).length,
    totalReadTime: blogs.reduce((acc, blog) => acc + blog.read_time, 0),
    totalViews: blogs.reduce((acc, blog) => acc + (blog.views || 0), 0),
    totalLikes: blogs.reduce((acc, blog) => acc + (blog.likes || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="site-container py-8 space-y-8">
      {/* Header */}
      <div className="rounded-2xl p-8 border border-border shadow-lg bg-card/70">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-border/50">
                <FileText className="h-7 w-7 text-background drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Blog Management
                </h1>
                <p className="text-muted-foreground font-medium">
                  Create, edit, and manage your blog posts
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreateBlog}
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-background shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5 mr-3" />
            Create New Blog Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats.published}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-3xl font-bold text-amber-400">
                  {stats.draft}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.featured}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Read Time
                </p>
                <p className="text-3xl font-bold text-orange-400">
                  {stats.totalReadTime}m
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Views</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card/70 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Likes</p>
                <p className="text-3xl font-bold text-pink-400">
                  {stats.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-border shadow-lg bg-card/70">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border focus:border-primary/50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status:
                </span>
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Draft" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() =>
                        setStatusFilter(
                          filter.value as "all" | "published" | "draft"
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        statusFilter === filter.value
                          ? "bg-primary text-background shadow-md border-primary hover:bg-primary/90"
                          : "bg-background text-foreground hover:bg-accent/30 border-border"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Showing {filteredBlogs.length} of {blogs.length} posts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Table */}
      <BlogTable
        blogs={filteredBlogs}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
      />

      {/* Modal */}
      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={selectedBlog}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
