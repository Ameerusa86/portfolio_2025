"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Eye,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogPost } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogImageUrl } from "@/lib/supabase-storage";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [popular, setPopular] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const [allRes, popRes] = await Promise.all([
        fetch("/api/blogs?status=published"),
        fetch("/api/blogs?status=published&popular=true"),
      ]);
      if (!allRes.ok) throw new Error("Failed blogs");
      if (!popRes.ok) throw new Error("Failed popular");
      const data = await allRes.json();
      const popData = await popRes.json();
      setBlogs(data);
      setPopular(popData);
      setError(null);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Filter blogs based on search and tag
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredPosts = filteredBlogs.filter((post) => post.featured);
  const recentPosts = filteredBlogs.filter((post) => !post.featured);

  // Get all unique tags for filter dropdown
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags))
  ).sort();

  if (error) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Error Loading Blog
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadBlogs} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-blue-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Latest Insights & Tutorials
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Blog
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights, tutorials, and thoughts on web development,
            technology, and the craft of building exceptional digital
            experiences.
          </p>
        </div>
      </section>

      <div className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Add Popular Posts Section */}
          {!loading && popular.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center mb-8">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-primary rounded-full w-12 mr-4" />
                <h2 className="text-3xl font-bold">Most Viewed</h2>
                <div className="h-1 bg-gradient-to-r from-primary to-transparent rounded-full flex-1 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {popular.map((post) => (
                  <Card
                    key={post.id}
                    className="relative overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                        <span>{(post.views ?? 0).toLocaleString()} views</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-12 h-12 bg-white/70 dark:bg-gray-800/70 border-white/30 focus:border-primary/50 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Tag Filter */}
                <div className="relative min-w-[200px]">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="h-12 w-full pl-10 pr-4 bg-white/70 dark:bg-gray-800/70 border border-white/30 focus:border-primary/50 rounded-xl text-sm appearance-none cursor-pointer"
                    >
                      <option value="">All Tags</option>
                      {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <BlogSkeleton />
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <section className="mb-20">
                  <div className="flex items-center mb-8">
                    <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full w-12 mr-4" />
                    <h2 className="text-3xl font-bold">Featured Articles</h2>
                    <div className="h-1 bg-gradient-to-r from-secondary to-transparent rounded-full flex-1 ml-4" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.map((post) => (
                      <FeaturedPostCard
                        key={post.id}
                        post={post}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Posts */}
              {recentPosts.length > 0 ? (
                <section>
                  <div className="flex items-center mb-8">
                    <div className="h-1 bg-gradient-to-r from-secondary to-primary rounded-full w-12 mr-4" />
                    <h2 className="text-3xl font-bold">Recent Articles</h2>
                    <div className="h-1 bg-gradient-to-r from-primary to-transparent rounded-full flex-1 ml-4" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                !loading &&
                filteredBlogs.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-semibold mb-2">
                      No Articles Found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || selectedTag
                        ? "Try adjusting your search or filter criteria."
                        : "No blog posts have been published yet."}
                    </p>
                    {(searchTerm || selectedTag) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTag("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )
              )}
            </>
          )}

          {/* Newsletter Signup */}
          <section className="mt-24">
            <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-0 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10" />

              <CardContent className="relative p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Stay in the Loop
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Get the latest articles, insights, and tutorials delivered
                    directly to your inbox. Join our community of developers and
                    tech enthusiasts.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      placeholder="Enter your email address"
                      type="email"
                      className="flex-1 h-12 bg-white/80 dark:bg-gray-800/80 border-white/50 focus:border-primary/50 rounded-xl"
                    />
                    <Button className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl font-medium">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function FeaturedPostCard({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (date: string) => string;
}) {
  return (
    <Card className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative h-80 overflow-hidden">
        {post.image ? (
          <Image
            src={getBlogImageUrl(post.image) || "/placeholder-blog.jpg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-6xl opacity-50">📖</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-6 left-6">
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/title">
          <h3 className="text-2xl font-bold mb-4 group-hover/title:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            {post.author || "Admin"}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5" />
            {formatDate(post.published_at || post.created_at)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            {post.read_time} min
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1.5" />
            {(post.views ?? 0).toLocaleString()}
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1.5" />
            {(post.likes ?? 0).toLocaleString()}
          </div>
        </div>

        <Button
          className="w-full group/btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
          asChild
        >
          <Link href={`/blog/${post.slug}`}>
            Read Full Article
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function BlogPostCard({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (date: string) => string;
}) {
  return (
    <Card className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        {post.image ? (
          <Image
            src={getBlogImageUrl(post.image) || "/placeholder-blog.jpg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">📖</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 2).map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/title flex-1">
          <h3 className="text-xl font-bold mb-3 group-hover/title:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.published_at || post.created_at)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.read_time} min
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {(post.views ?? 0).toLocaleString()}
          </div>
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            {(post.likes ?? 0).toLocaleString()}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full group/btn border-primary/20 hover:bg-primary/10 hover:border-primary/40"
          asChild
        >
          <Link href={`/blog/${post.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function BlogSkeleton() {
  return (
    <div className="space-y-16">
      {/* Featured Posts Skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-80 w-full" />
              <div className="p-8 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Posts Skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-56 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
