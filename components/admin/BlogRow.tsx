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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center gap-6 p-6">
          {/* Featured Image */}
          <div className="relative flex-shrink-0">
            {blog.image && !imageError ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow-md">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            )}
            {blog.featured && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Star className="h-3 w-3 text-white drop-shadow-sm" />
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
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
            <div className="flex items-center gap-6 text-sm text-gray-500">
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
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Hash className="h-4 w-4 text-gray-400" />
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 shadow-sm"
                  >
                    {tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500 font-medium">
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
              className="h-10 px-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-medium transition-all duration-200 group/edit"
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
              className={`h-10 px-4 border-2 font-medium transition-all duration-200 ${
                blog.status === "published"
                  ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 text-yellow-700"
                  : "border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700"
              }`}
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
              className={`h-10 px-4 border-2 font-medium transition-all duration-200 ${
                blog.featured
                  ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 text-yellow-700"
                  : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              {blog.featured ? "Unfeature" : "Feature"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(blog.slug)}
              className="h-10 px-4 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-700 font-medium transition-all duration-200 group/delete"
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
