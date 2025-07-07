import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";

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
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="relative h-64">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Link href={`/blog/${postSlug}`} className="block group">
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime} min read
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full group" asChild>
            <Link href={`/blog/${postSlug}`}>
              Read More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-3xl">📖</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${postSlug}`} className="block group flex-1">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readTime} min
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
