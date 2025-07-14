import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share,
  BookOpen,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";
import { BlogService } from "@/lib/blog-service";
import { getBlogImageUrl } from "@/lib/supabase-storage";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await BlogService.getBlog(slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getRelatedPosts(
  currentSlug: string,
  tags: string[]
): Promise<BlogPost[]> {
  try {
    const allPosts = await BlogService.getBlogs({ status: "published" });
    return allPosts
      .filter((post) => post.slug !== currentSlug)
      .filter((post) => tags.some((tag) => post.tags.includes(tag)))
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.tags);

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
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
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

            {/* Share Button */}
            <div className="flex gap-3 mb-8">
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share Article
              </Button>
              <Button variant="outline">Save for Later</Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-muted">
              <Image
                src={getBlogImageUrl(post.image) || "/placeholder-blog.jpg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split("\n")
                  .map((line) => {
                    // Convert markdown-style headers
                    if (line.startsWith("# ")) {
                      return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.substring(
                        2
                      )}</h1>`;
                    }
                    if (line.startsWith("## ")) {
                      return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.substring(
                        3
                      )}</h2>`;
                    }
                    if (line.startsWith("### ")) {
                      return `<h3 class="text-xl font-medium mt-4 mb-2">${line.substring(
                        4
                      )}</h3>`;
                    }
                    // Convert code blocks
                    if (line.startsWith("```")) {
                      return line.includes("```") && line.length > 3
                        ? `<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>${line.substring(
                            3
                          )}</code></pre>`
                        : '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>';
                    }
                    if (line === "```") {
                      return "</code></pre>";
                    }
                    // Convert bullet points
                    if (line.startsWith("- ")) {
                      return `<li class="ml-4">${line.substring(2)}</li>`;
                    }
                    // Regular paragraphs
                    if (line.trim() && !line.startsWith("<")) {
                      return `<p class="mb-4 leading-relaxed">${line}</p>`;
                    }
                    return line;
                  })
                  .join(""),
              }}
            />
          </div>
        </article>

        {/* Author Card */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                {post.author.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{post.author}</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Full-stack developer passionate about creating exceptional
                  digital experiences with modern technologies.
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

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
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
          </section>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Subscribe to get notified when I publish new articles about web
                development and technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>Subscribe to Newsletter</Button>
                <Button variant="outline" asChild>
                  <Link href="/blog">Read More Articles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
