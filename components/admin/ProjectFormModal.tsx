"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "@/components/ImagePicker";
import { Project } from "@/types/project";
import { toast } from "sonner";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onProjectUpdated: () => void;
}

interface ProjectFormData {
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

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStackInput, setTechStackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!project;

  // Parse tech stack back to string for input field
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
  }, [project, isOpen]);

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Parse tech stack from comma-separated string
      const techStack = techStackInput
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", selectedFile);

        const uploadResponse = await fetch("/api/uploadthing", {
          method: "POST",
          body: formDataForUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
      }

      const projectData = {
        ...formData,
        image: imageUrl,
        tech_stack: techStack,
      };

      const url = isEdit ? `/api/projects/${project.slug}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} project`);
      }

      toast.success(`Project ${isEdit ? "updated" : "created"} successfully!`);
      onProjectUpdated();
      onClose();
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(
        `Failed to ${isEdit ? "update" : "create"} project. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">
            {isEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update project details"
              : "Add a new project to your portfolio"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Status Toggles */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-1">
              <p className="text-sm font-medium">Project Status</p>
              <p className="text-xs text-muted-foreground">
                Control visibility and highlighting
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange("featured", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium">Featured</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      handleChange("published", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium">Published</span>
              </div>
            </div>
          </div>

          {/* Two Column Layout for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Describe your project"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tech Stack</label>
                <Input
                  placeholder="React, TypeScript, Next.js (comma separated)"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="h-11"
                />
                {techStackInput && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techStackInput
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter((tech) => tech.length > 0)
                      .map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    placeholder="https://github.com/..."
                    value={formData.github_url}
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    type="url"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Live Demo URL</label>
                  <Input
                    placeholder="https://..."
                    value={formData.live_url}
                    onChange={(e) => handleChange("live_url", e.target.value)}
                    type="url"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Image</label>
                {formData.image && (
                  <div className="mb-3">
                    <img
                      src={formData.image}
                      alt="Project preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <ImagePicker
                  onChange={(file) => setSelectedFile(file)}
                  previewUrl={formData.image}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
