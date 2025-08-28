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
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border border-purple-200/50 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white/50">
                <FileText className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-700 bg-clip-text text-transparent">
                  Blog Management
                </h1>
                <p className="text-gray-600 font-medium">
                  Create, edit, and manage your blog posts
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreateBlog}
            className="h-12 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-700 hover:from-purple-700 hover:via-pink-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5 mr-3" />
            Create New Blog Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.draft}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.featured}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Total Read Time
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.totalReadTime}m
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Views</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Likes</p>
                <p className="text-3xl font-bold text-pink-600">
                  {stats.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                      onClick={() => setStatusFilter(filter.value as "all" | "published" | "draft")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        statusFilter === filter.value
                          ? filter.value === "all"
                            ? "bg-gray-500 text-white shadow-md border-gray-600 hover:bg-gray-600"
                            : filter.value === "published"
                            ? "bg-green-500 text-white shadow-md border-green-600 hover:bg-green-600"
                            : "bg-yellow-500 text-white shadow-md border-yellow-600 hover:bg-yellow-600"
                          : filter.value === "all"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                          : filter.value === "published"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 font-medium">
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
