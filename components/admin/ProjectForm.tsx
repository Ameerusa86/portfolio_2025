"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImagePicker from "@/components/ImagePicker";
import { Project } from "@/types/project";
import { toast } from "sonner";
import { useMemo } from "react";
import { Loader2, Globe, Github, Star, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { uploadImageFile } from "@/lib/supabase-upload";

interface ProjectFormProps {
  project?: Project | null;
  onSubmit?: (projectData: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  showActions?: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  published: boolean;
}

const INITIAL_FORM_DATA: ProjectFormData = {
  title: "",
  description: "",
  image: "",
  tech_stack: [],
  github_url: "",
  live_url: "",
  featured: false,
  published: false,
};

export default function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = "",
  showActions = true,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStackInput, setTechStackInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableTechs, setAvailableTechs] = useState<string[]>([]);

  const isEdit = !!project;

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image || "",
        tech_stack: project.tech_stack || [],
        github_url: project.github_url || "",
        live_url: project.live_url || "",
        featured: project.featured || false,
        published: project.published || false,
      });
      setTechStackInput(
        Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : ""
      );
    } else {
      setFormData(INITIAL_FORM_DATA);
      setTechStackInput("");
    }
    setSelectedFile(null);
    setErrors({});
  }, [project]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/technologies");
        const json = await res.json();
        if (!mounted) return;
        setAvailableTechs((json.data || []).map((d: any) => d.name));
      } catch (err) {
        console.error("Failed to load technologies", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (formData.github_url && !isValidUrl(formData.github_url)) {
      newErrors.github_url = "Please enter a valid GitHub URL";
    }

    if (formData.live_url && !isValidUrl(formData.live_url)) {
      newErrors.live_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (
    field: keyof ProjectFormData,
    value: string | boolean | Date | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTechStackChange = (value: string) => {
    setTechStackInput(value);
    const techStack = value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);
    handleChange("tech_stack", techStack);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    if (!onSubmit) return;

    try {
      // Parse tech stack from comma-separated string
      const techStack = techStackInput
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      let imageUrl = formData.image;
      let imageKey = "";

      // Upload new image if selected
      if (selectedFile) {
        // Use Supabase upload instead of uploadthing
        const uploadResult = await uploadImageFile(selectedFile);
        imageUrl = uploadResult.url;
        imageKey = uploadResult.key;
      }

      const projectData = {
        ...formData,
        image: imageUrl,
        imageKey: imageKey,
        tech_stack: techStack,
        // Make sure we're using the correct field names
        github_url: formData.github_url,
        live_url: formData.live_url,
      };

      console.log("Submitting project data:", projectData); // Debug log

      await onSubmit(projectData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to process form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Project Status */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-border shadow-lg bg-card/70">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg ring-4 ring-border/50">
              <Star className="h-5 w-5 text-background drop-shadow-sm" />
            </div>
            Project Status
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
                checked={formData.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-border/60 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary drop-shadow-sm" />
              Published
            </span>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-8">
          <Card className="border border-border shadow-lg bg-card/70">
            <CardHeader className="border-b border-border bg-card/60">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">📝</span>
                </div>
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Project Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-foreground"
                >
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
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

              {/* Description */}
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-foreground"
                >
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`min-h-[140px] resize-none text-base ${
                    errors.description
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <Label
                  htmlFor="tech-stack"
                  className="text-sm font-semibold text-foreground"
                >
                  Tech Stack
                </Label>
                {/* Canonical techs select - styled Dropdown with checkboxes */}
                {availableTechs.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full text-left h-12 px-3 py-2 rounded-md border border-border bg-background text-foreground flex items-center justify-between"
                      >
                        <span className="truncate">
                          {formData.tech_stack && formData.tech_stack.length > 0
                            ? formData.tech_stack.join(", ")
                            : "Select technologies"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 opacity-60"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-72 overflow-auto bg-card border border-border text-foreground">
                      {availableTechs.map((t) => (
                        <DropdownMenuCheckboxItem
                          key={t}
                          checked={formData.tech_stack.includes(t)}
                          onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            const next = isChecked
                              ? Array.from(new Set([...formData.tech_stack, t]))
                              : formData.tech_stack.filter((x) => x !== t);
                            handleChange("tech_stack", next);
                            setTechStackInput(next.join(", "));
                          }}
                        >
                          {t}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <div className="mt-2">
                  <Input
                    id="tech-stack"
                    placeholder="React, TypeScript, Next.js (comma separated)"
                    value={techStackInput}
                    onChange={(e) => handleTechStackChange(e.target.value)}
                    className="h-12 text-base border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                {techStackInput && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-accent/10 rounded-lg border border-border">
                    {techStackInput
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter((tech) => tech.length > 0)
                      .map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-accent/20 text-foreground border border-border shadow-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Links */}
          <Card className="border border-border shadow-lg bg-card/70">
            <CardHeader className="border-b border-border bg-card/60">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-background font-bold text-sm">🔗</span>
                </div>
                Project Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="github-url"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <Github className="h-4 w-4" />
                  GitHub URL
                </Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/username/project"
                  value={formData.github_url}
                  onChange={(e) => handleChange("github_url", e.target.value)}
                  type="url"
                  className={`h-12 text-base ${
                    errors.github_url
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.github_url && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.github_url}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="live-url"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Live Demo URL
                </Label>
                <Input
                  id="live-url"
                  placeholder="https://your-project.com"
                  value={formData.live_url}
                  onChange={(e) => handleChange("live_url", e.target.value)}
                  type="url"
                  className={`h-12 text-base ${
                    errors.live_url
                      ? "border-red-500 ring-red-200/30"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.live_url && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.live_url}
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
                Project Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {formData.image && (
                <div className="mb-6 relative w-full h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Project preview"
                    className="w-full h-full object-cover rounded-xl border border-border shadow-lg"
                    loading="lazy"
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
                    📸 Upload a project screenshot or demo image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 800x600px • Formats: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
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
            className="px-8 py-3 h-12 text-base font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
