"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  User,
  FileText,
  Hash,
  Heart,
} from "lucide-react";

interface BlogRowProps {
  blog: BlogPost;
  onEdit: (blog: BlogPost) => void;
  onDelete: (blogSlug: string) => void;
  onToggleStatus: (blogSlug: string, status: "published" | "draft") => void;
  onToggleFeatured: (blogSlug: string, featured: boolean) => void;
}

export default function BlogRow({
  blog,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: BlogRowProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "draft":
        return "bg-gradient-to-r from-yellow-500 to-orange-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-border bg-card/70 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center gap-6 p-6">
          {/* Featured Image */}
          <div className="relative flex-shrink-0">
            {blog.image && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.image}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded-xl border border-border shadow-md group-hover:shadow-lg transition-all duration-300"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-24 h-24 bg-accent/10 rounded-xl border border-border flex items-center justify-center shadow-md">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {blog.featured && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                <Star className="h-3 w-3 text-white drop-shadow-sm" />
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs font-semibold px-3 py-1 shadow-sm ${getStatusColor(
                    blog.status
                  )}`}
                >
                  {blog.status === "published" ? (
                    <Eye className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-1" />
                  )}
                  {blog.status}
                </Badge>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>
                  {blog.published_at
                    ? formatDate(blog.published_at)
                    : "Not published"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{blog.read_time} min read</span>
              </div>
              {typeof blog.views === "number" && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span>{blog.views.toLocaleString()}</span>
                </div>
              )}
              {typeof blog.likes === "number" && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span>{blog.likes.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Hash className="h-4 w-4 text-muted-foreground" />
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-accent/20 text-foreground border border-border shadow-sm"
                  >
                    {tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground font-medium">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(blog)}
              className="h-10 px-4 border-2 border-border hover:bg-accent/10 text-foreground font-medium transition-all duration-200 group/edit"
            >
              <Edit3 className="h-4 w-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onToggleStatus(
                  blog.slug,
                  blog.status === "published" ? "draft" : "published"
                )
              }
              className={`h-10 px-4 border-2 font-medium transition-all duration-200 border-border hover:bg-accent/10 text-foreground`}
            >
              {blog.status === "published" ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Draft
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFeatured(blog.slug, !blog.featured)}
              className={`h-10 px-4 border-2 font-medium transition-all duration-200 border-border hover:bg-accent/10 text-foreground`}
            >
              <Star className="h-4 w-4 mr-2" />
              {blog.featured ? "Unfeature" : "Feature"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(blog.slug)}
              className="h-10 px-4 border-2 border-border hover:bg-accent/10 text-foreground font-medium transition-all duration-200 group/delete"
            >
              <Trash2 className="h-4 w-4 mr-2 group-hover/delete:scale-110 transition-transform duration-200" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
