"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BlogForm, { BlogFormData } from "./BlogForm";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: BlogPost | null;
  onSubmit: (blogData: BlogFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BlogFormModal({
  isOpen,
  onClose,
  blog,
  onSubmit,
  isSubmitting = false,
}: BlogFormModalProps) {
  const isEdit = !!blog;

  const handleSubmit = async (blogData: BlogFormData) => {
    try {
      await onSubmit(blogData);
      onClose();
    } catch (error) {
      console.error("Error in modal submission:", error);
      toast.error("Failed to process blog post. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl !max-w-[95vw]"
        style={{
          width: "95vw",
          maxWidth: "95vw",
          margin: "2.5vh auto",
        }}
      >
        <DialogHeader className="space-y-4 pb-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-100">
              <span className="text-white font-bold text-lg">
                {isEdit ? "E" : "N"}
              </span>
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
              <p className="text-gray-500 font-medium">
                {isEdit
                  ? "Update your blog post content and settings"
                  : "Share your thoughts and insights with the world"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 px-1">
          <BlogForm
            blog={blog}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
