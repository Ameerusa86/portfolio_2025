"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImagePicker from "@/components/ImagePicker";
import { BlogPost } from "@/types/blog";
import { createBlogSchema } from "@/lib/blog-schema";
import { ImageUploadService } from "@/lib/image-upload";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Calendar, Star, Eye, FileText, Clock } from "lucide-react";

interface BlogFormProps {
  blog?: BlogPost | null;
  onSubmit?: (blogData: BlogFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  author: string;
  readTime: number;
  featured?: boolean;
  status: "published" | "draft";
}

const INITIAL_FORM_DATA: BlogFormData = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  tags: [],
  author: "Ameer Hasan",
  readTime: 5,
  featured: false,
  status: "draft",
};

export default function BlogForm({
  blog,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(INITIAL_FORM_DATA);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autosaveStatus, setAutosaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");

  const isEdit = !!blog;

  // Initialize form data when blog changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content,
        image: blog.image || "",
        tags: blog.tags || [],
        author: blog.author,
        readTime: blog.read_time,
        featured: blog.featured || false,
        status: blog.status,
      });
      setTagsInput(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
    } else {
      setFormData(INITIAL_FORM_DATA);
      setTagsInput("");
    }
    setSelectedFile(null);
    setErrors({});
  }, [blog]);

  const validateForm = (): boolean => {
    try {
      createBlogSchema.parse({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || undefined,
        tags: formData.tags,
        read_time: formData.readTime,
        featured: formData.featured,
        status: formData.status,
      });
      setErrors({});
      return true;
    } catch (err) {
      const zodErrors: Record<string, string> = {};
      const issues = (err as { issues?: Array<{ path?: unknown[]; message: string }> }).issues;
      if (issues) {
        issues.forEach((issue) => {
          const path = issue.path?.[0];
          if (path === "read_time") {
            zodErrors["readTime"] = issue.message;
          } else if (path) {
            zodErrors[String(path)] = issue.message;
          }
        });
      }
      // Additional client-only fields
      if (!formData.author.trim()) {
        zodErrors.author = "Author name is required";
      }
      setErrors(zodErrors);
      return false;
    }
  };

  const handleChange = (
    field: keyof BlogFormData,
    value: string | boolean | Date | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Autosave draft to localStorage (client-side only)
  useEffect(() => {
    const serialized = JSON.stringify(formData);
    if (serialized === lastSavedRef.current) return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    setAutosaveStatus("saving");
    autosaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          blog ? `blog_edit_${blog.slug}` : "blog_new_draft",
          serialized
        );
        lastSavedRef.current = serialized;
        setAutosaveStatus("saved");
        setTimeout(() => setAutosaveStatus("idle"), 2000);
      } catch (e) {
        console.error("Autosave failed", e);
        setAutosaveStatus("error");
      }
    }, 800);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [formData, blog]);

  // Restore draft if creating a new blog
  useEffect(() => {
    if (!blog) {
      const draft = localStorage.getItem("blog_new_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setFormData((prev) => ({ ...prev, ...parsed }));
          if (parsed.tags) setTagsInput(parsed.tags.join(", "));
          toast.info("Restored autosaved draft");
        } catch {}
      }
    } else {
      const editDraft = localStorage.getItem(`blog_edit_${blog.slug}`);
      if (editDraft) {
        try {
          const parsed = JSON.parse(editDraft);
          setFormData((prev) => ({ ...prev, ...parsed }));
          if (parsed.tags) setTagsInput(parsed.tags.join(", "));
          toast.info("Restored autosaved edit draft");
        } catch {}
      }
    }
  }, [blog]);

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    handleChange("tags", tags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    if (!onSubmit) return;

    try {
      // Parse tags from comma-separated string
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await ImageUploadService.uploadBlogImage(selectedFile);
      }

      const blogData = {
        ...formData,
        image: imageUrl,
        tags: tags,
      };

      await onSubmit(blogData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to process form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Blog Status */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-orange-50/80 rounded-2xl border border-purple-200/50 shadow-lg backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 via-pink-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
              <FileText className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            Blog Status
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            Control visibility and highlighting
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-yellow-300/50 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-orange-500 shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 drop-shadow-sm" />
              Featured
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.status === "published"}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.checked ? "published" : "draft"
                  )
                }
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-green-300/50 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500 drop-shadow-sm" />
              Published
            </span>
          </div>
          <div className="flex flex-col items-end min-w-[120px]">
            {autosaveStatus === "saving" && (
              <span className="text-xs text-gray-500 animate-pulse">
                Saving…
              </span>
            )}
            {autosaveStatus === "saved" && (
              <span className="text-xs text-green-600">Saved</span>
            )}
            {autosaveStatus === "error" && (
              <span className="text-xs text-red-600">Autosave failed</span>
            )}
          </div>
        </div>
      </div>

      {/* Blog Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">📝</span>
                </div>
                Blog Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Blog Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700"
                >
                  Blog Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`h-12 text-base ${
                    errors.title
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-3">
                <Label
                  htmlFor="excerpt"
                  className="text-sm font-semibold text-gray-700"
                >
                  Excerpt <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your blog post..."
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  className={`min-h-[100px] resize-none text-base ${
                    errors.excerpt
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.excerpt}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Label
                  htmlFor="content"
                  className="text-sm font-semibold text-gray-700"
                >
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className={`min-h-[200px] resize-none text-base ${
                    errors.content
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                  }`}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label
                  htmlFor="tags"
                  className="text-sm font-semibold text-gray-700"
                >
                  Tags
                </Label>
                <Input
                  id="tags"
                  placeholder="React, TypeScript, Next.js (comma separated)"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                />
                {tagsInput && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg border">
                    {tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0)
                      .map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 shadow-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blog Meta */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                Blog Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="author"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Calendar className="h-4 w-4" />
                  Author <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  className={`h-12 text-base ${
                    errors.author
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                {errors.author && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.author}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="readTime"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Clock className="h-4 w-4" />
                  Read Time (minutes)
                </Label>
                <Input
                  id="readTime"
                  type="number"
                  min="1"
                  placeholder="5"
                  value={formData.readTime}
                  onChange={(e) =>
                    handleChange("readTime", parseInt(e.target.value) || 1)
                  }
                  className={`h-12 text-base ${
                    errors.readTime
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                {errors.readTime && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.readTime}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image */}
        <div className="space-y-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">🖼️</span>
                </div>
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {formData.image && (
                <div className="mb-6 relative w-full h-80">
                  <Image
                    src={formData.image}
                    alt="Blog featured image"
                    fill
                    className="object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <ImagePicker
                  onChange={(file) => setSelectedFile(file)}
                  previewUrl={formData.image}
                />
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 font-medium">
                    📸 Upload a featured image for your blog post
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x630px • Formats: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-8 py-3 h-12 text-base font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 h-12 text-base font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-orange-700 hover:from-purple-700 hover:via-pink-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Blog Post"
          ) : (
            "Create Blog Post"
          )}
        </Button>
      </div>
    </form>
  );
}
