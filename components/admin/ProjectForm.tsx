"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImagePicker from "@/components/ImagePicker";
import { Project } from "@/types/project";
import { toast } from "sonner";
import { Loader2, Globe, Github, Star, Eye } from "lucide-react";
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

  const handleChange = (field: keyof ProjectFormData, value: any) => {
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
      };

      await onSubmit(projectData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to process form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Project Status */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
              <Star className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            Project Status
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
                checked={formData.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-green-300/50 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-105"></div>
            </label>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500 drop-shadow-sm" />
              Published
            </span>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">📝</span>
                </div>
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Project Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700"
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
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
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
                  className="text-sm font-semibold text-gray-700"
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
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
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
                  className="text-sm font-semibold text-gray-700"
                >
                  Tech Stack
                </Label>
                <Input
                  id="tech-stack"
                  placeholder="React, TypeScript, Next.js (comma separated)"
                  value={techStackInput}
                  onChange={(e) => handleTechStackChange(e.target.value)}
                  className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                />
                {techStackInput && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg border">
                    {techStackInput
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter((tech) => tech.length > 0)
                      .map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm"
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
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">🔗</span>
                </div>
                Project Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="github-url"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
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
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
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
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
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
                      ? "border-red-500 ring-red-100"
                      : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
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
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">🖼️</span>
                </div>
                Project Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {formData.image && (
                <div className="mb-6">
                  <img
                    src={formData.image}
                    alt="Project preview"
                    className="w-full h-80 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
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
                    📸 Upload a project screenshot or demo image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
