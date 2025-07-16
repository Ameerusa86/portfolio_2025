import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share,
  BookOpen,
  Tag,
  Heart,
  Award,
  Code,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = params;
  let post: BlogPost | null = null;
  let relatedPosts: BlogPost[] = [];

  try {
    // Fetch the blog post
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs/${slug}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }
    post = await response.json();

    // Fetch related posts if we have tags
    if (post?.tags?.length) {
      const allPostsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs?status=published`
      );
      if (allPostsResponse.ok) {
        const allPosts: BlogPost[] = await allPostsResponse.json();
        relatedPosts = allPosts
          .filter((p) => p.slug !== slug)
          .filter((p) => p.tags.some((tag: string) => post?.tags.includes(tag)))
          .slice(0, 3);
      }
    }
  } catch (err) {
    console.error("Error fetching blog post:", err);
    notFound();
  }

  if (!post) notFound();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="absolute top-8 left-0 w-full z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Blog
              </Link>
              <span className="text-foreground font-medium">
                / {post.title}
              </span>
            </nav>
          </div>
        </div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-6 pt-20">
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {post.title}
            </h1>
            <p className="max-w-3xl mx-auto text-muted-foreground text-lg lg:text-xl leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{Math.ceil(post.content.length / 1000)}k words</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Button variant="outline" className="shadow-lg">
                <Share className="mr-2 h-4 w-4" /> Share Article
              </Button>
              <Button variant="outline" className="shadow-lg">
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Image */}
      {post.image && (
        <section className="w-full py-10 lg:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
      {/* Main Content */}
      <section className="w-full py-12 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Content Area */}
            <div className="lg:col-span-2 space-y-12">
              {/* Blog Content */}
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" /> Article Overview
                </h2>
                <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{
                          __html: post.content
                            .split("\n")
                            .map((line: string) => {
                              if (line.startsWith("# ")) {
                                return `<h1 class=\"text-3xl font-bold mt-8 mb-4\">${line.substring(
                                  2
                                )}</h1>`;
                              }
                              if (line.startsWith("## ")) {
                                return `<h2 class=\"text-2xl font-semibold mt-6 mb-3\">${line.substring(
                                  3
                                )}</h2>`;
                              }
                              if (line.startsWith("### ")) {
                                return `<h3 class=\"text-xl font-medium mt-4 mb-2\">${line.substring(
                                  4
                                )}</h3>`;
                              }
                              if (line.startsWith("```")) {
                                return line.includes("```") && line.length > 3
                                  ? `<pre class=\"bg-muted p-4 rounded-lg overflow-x-auto my-4\"><code>${line.substring(
                                      3
                                    )}</code></pre>`
                                  : '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>';
                              }
                              if (line === "```") {
                                return "</code></pre>";
                              }
                              if (line.startsWith("- ")) {
                                return `<li class=\"ml-4\">${line.substring(
                                  2
                                )}</li>`;
                              }
                              if (line.trim() && !line.startsWith("<")) {
                                return `<p class=\"mb-4 leading-relaxed\">${line}</p>`;
                              }
                              return line;
                            })
                            .join(""),
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Author Card */}
              <Card className="bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {post.author}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Full-stack developer passionate about creating
                        exceptional digital experiences with modern
                        technologies.
                      </p>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Article Info Card */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" /> Article Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Author</span>
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Published</span>
                      <span className="text-sm font-medium">
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Read Time</span>
                      <span className="text-sm font-medium">
                        {post.read_time} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tags</span>
                      <span className="text-sm font-medium">
                        {post.tags.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Share className="h-4 w-4 mr-2" /> Share Article
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Heart className="h-4 w-4 mr-2" /> Like Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Navigation */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold">Explore More</h3>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/blog">
                        <ArrowLeft className="h-4 w-4 mr-2" /> All Articles
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/contact">
                        <Heart className="h-4 w-4 mr-2" /> Work Together
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/about">
                        <Users className="h-4 w-4 mr-2" /> About Me
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="w-full py-12 lg:py-20 bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-100/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.slug}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    {relatedPost.image ? (
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-lg">
                        <span className="text-2xl">📖</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {relatedPost.read_time} min read
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Call to Action Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-100/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 lg:p-20 shadow-xl border border-white/50">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-white">
                  <Heart className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Enjoyed this article?
              </h2>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Subscribe to get notified when I publish new articles about web
                development and technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" className="text-lg px-8 py-4">
                  Subscribe to Newsletter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-4"
                >
                  <Link href="/blog">Read More Articles</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
