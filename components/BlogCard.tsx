import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Eye, Heart } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { getBlogImageUrl } from "@/lib/supabase-storage";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
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

  // Fallback to ID if slug is not available (for backward compatibility)
  const postSlug = post.slug || post.id;

  if (featured) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full border border-border/60 relative">
        <Link
          href={`/blog/${postSlug}`}
          aria-label={`Read article: ${post.title}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative h-56">
          {post.image ? (
            <Image
              src={getBlogImageUrl(post.image) || "/placeholder-blog.jpg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <Badge className="bg-primary text-primary-foreground shadow-sm">
              Featured
            </Badge>
            {typeof post.views === "number" && (
              <span
                aria-label={`${post.views} views`}
                className="flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-0.5 text-[11px] font-medium shadow border border-border/60"
              >
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
            )}
            {typeof post.likes === "number" && (
              <span
                aria-label={`${post.likes} likes`}
                className="flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-0.5 text-[11px] font-medium shadow border border-border/60"
              >
                <Heart className="h-3 w-3" />
                {post.likes}
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-5 relative z-20">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] font-medium"
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-[11px] font-medium">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {post.read_time} min read
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-9 text-sm group relative z-30"
            asChild
          >
            <Link
              href={`/blog/${postSlug}`}
              aria-label={`Read full article: ${post.title}`}
            >
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col border border-border/60 relative">
      <Link
        href={`/blog/${postSlug}`}
        aria-label={`Read article: ${post.title}`}
        className="absolute inset-0 z-10"
      />
      <div className="relative h-40">
        {post.image ? (
          <Image
            src={getBlogImageUrl(post.image) || "/placeholder-blog.jpg"}
            alt={post.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-3xl">📖</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          {typeof post.views === "number" && (
            <span
              aria-label={`${post.views} views`}
              className="flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-0.5 text-[10px] font-medium shadow border border-border/60"
            >
              <Eye className="h-3 w-3" />
              {post.views}
            </span>
          )}
          {typeof post.likes === "number" && (
            <span
              aria-label={`${post.likes} likes`}
              className="flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-0.5 text-[10px] font-medium shadow border border-border/60"
            >
              <Heart className="h-3 w-3" />
              {post.likes}
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-3.5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] font-medium"
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 2 && (
            <Badge variant="secondary" className="text-[10px] font-medium">
              +{post.tags.length - 2}
            </Badge>
          )}
        </div>
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-[13px] mb-3 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-auto pt-1.5">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.published_at || post.created_at)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.read_time} min
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
