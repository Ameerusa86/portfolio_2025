"use client";

import React from "react";
import BlogRow from "./BlogRow";
import { BlogPost } from "@/types/blog";

interface BlogTableProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (blogSlug: string) => void;
  onToggleStatus: (blogSlug: string, status: "published" | "draft") => void;
  onToggleFeatured: (blogSlug: string, featured: boolean) => void;
}

export default function BlogTable({
  blogs,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: BlogTableProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-border shadow-lg bg-card/70">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-20 w-20 bg-accent/10 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-border">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            No blog posts yet
          </h3>
          <p className="text-muted-foreground">
            Start creating engaging content to share your thoughts and insights
            with your audience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <BlogRow
          key={blog.id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onToggleFeatured={onToggleFeatured}
        />
      ))}
    </div>
  );
}
