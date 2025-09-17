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
  const [availableTags, setAvailableTags] = useState<string[]>([]);
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/technologies");
        const json = await res.json();
        if (!mounted) return;
        setAvailableTags((json.data || []).map((d: any) => d.name));
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      const issues = (
        err as { issues?: Array<{ path?: unknown[]; message: string }> }
      ).issues;
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
      <div className="flex items-center justify-between p-6 rounded-2xl border border-border shadow-lg bg-card/70">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg ring-4 ring-border/50">
              <FileText className="h-5 w-5 text-background drop-shadow-sm" />
            </div>
            Blog Status
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
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
              <div className="w-12 h-7 bg-border/60 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-primary drop-shadow-sm" />
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
              <div className="w-12 h-7 bg-border/60 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary drop-shadow-sm" />
              Published
            </span>
          </div>
          <div className="flex flex-col items-end min-w-[120px]">
            {autosaveStatus === "saving" && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Saving…
              </span>
            )}
            {autosaveStatus === "saved" && (
              <span className="text-xs text-emerald-400">Saved</span>
            )}
            {autosaveStatus === "error" && (
              <span className="text-xs text-red-500">Autosave failed</span>
            )}
          </div>
        </div>
      </div>

      {/* Blog Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-8">
          <Card className="border border-border shadow-lg bg-card/70">
            <CardHeader className="border-b border-border bg-card/60">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">📝</span>
                </div>
                Blog Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Blog Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-foreground"
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
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
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
                  className="text-sm font-semibold text-foreground"
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
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
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
                  className="text-sm font-semibold text-foreground"
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
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
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
                  className="text-sm font-semibold text-foreground"
                >
                  Tags
                </Label>
                {availableTags.length > 0 && (
                  <select
                    multiple
                    value={formData.tags}
                    onChange={(e) => {
                      const opts = Array.from(e.target.selectedOptions).map(
                        (o) => o.value
                      );
                      handleChange("tags", opts);
                      setTagsInput(opts.join(", "));
                    }}
                    className="h-28 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {availableTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}

                <div className="mt-2">
                  <Input
                    id="tags"
                    placeholder="React, TypeScript, Next.js (comma separated)"
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="h-12 text-base border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                {tagsInput && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-accent/10 rounded-lg border border-border">
                    {tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0)
                      .map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-accent/20 text-foreground border border-border shadow-sm"
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
          <Card className="border border-border shadow-lg bg-card/70">
            <CardHeader className="border-b border-border bg-card/60">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">📊</span>
                </div>
                Blog Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="author"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
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
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
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
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
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
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
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
          <Card className="border border-border shadow-lg bg-card/70">
            <CardHeader className="border-b border-border bg-card/60">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">🖼️</span>
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
                    className="object-cover rounded-xl border border-border shadow-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <ImagePicker
                  onChange={(file) => setSelectedFile(file)}
                  previewUrl={formData.image}
                />
                <div className="p-4 bg-accent/10 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground font-medium">
                    📸 Upload a featured image for your blog post
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1200x630px • Formats: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-8 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-8 py-3 h-12 text-base font-medium border-2 border-border hover:bg-accent/10 transition-all duration-200 text-foreground"
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
