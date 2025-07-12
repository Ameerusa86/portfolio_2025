"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ImagePicker from "../ImagePicker";
import { uploadImageFile } from "@/lib/supabase-upload";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Star } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialData?: Project | null;
}

export function ProjectFormModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<Project>({
    id: "",
    slug: "",
    title: "",
    description: "",
    image: "",
    image_key: "",
    tech_stack: [],
    github_url: "",
    live_url: "",
    featured: false,
    published: true,
    created_at: new Date().toISOString(),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStackInput, setTechStackInput] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTechStackInput(
        Array.isArray(initialData.tech_stack)
          ? initialData.tech_stack.join(", ")
          : ""
      );
    } else {
      // Reset form when not editing
      setFormData({
        id: "",
        slug: "",
        title: "",
        description: "",
        image: "",
        image_key: "",
        tech_stack: [],
        github_url: "",
        live_url: "",
        featured: false,
        published: true,
        created_at: new Date().toISOString(),
      });
      setTechStackInput("");
      setSelectedFile(null);
    }
  }, [initialData, open]);

  const handleChange = (
    key: keyof Project,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required.");
      return;
    }

    let imageUrl = formData.image;
    let image_key = formData.image_key || "";

    // Only upload if a new file is selected and it's not the same as the current image
    if (selectedFile) {
      let alreadyUploaded = false;
      if (formData.image) {
        const urlParts = formData.image.split("/");
        const uploadedFileName = urlParts[urlParts.length - 1];
        if (uploadedFileName.includes(selectedFile.name)) {
          alreadyUploaded = true;
        }
      }
      if (!alreadyUploaded) {
        try {
          toast.info("Uploading image...");
          const uploadRes = await uploadImageFile(selectedFile);
          imageUrl = uploadRes.url;
          image_key = uploadRes.key;
          toast.success("Image uploaded successfully!");
        } catch (err: any) {
          toast.error("Image upload failed: " + err.message);
          return;
        }
      }
    }

    // Process tech stack input
    const tech_stack = techStackInput
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const project: Project = {
      ...formData,
      image: imageUrl,
      image_key,
      tech_stack,
      id: isEdit ? formData.id : crypto.randomUUID(),
      created_at: isEdit ? formData.created_at : new Date().toISOString(),
      published: formData.published,
      featured: formData.featured,
    };

    try {
      await onSave(project);
      toast.success(isEdit ? "Project updated!" : "Project created!");
      onClose();
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  // Summary line for clarity
  const summary = `This project will be ${
    formData.published ? "published" : "saved as draft"
  }${formData.featured ? " and featured" : ""} when ${
    isEdit ? "updated" : "created"
  }.`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] overflow-y-auto">
        <DialogHeader className="border-b pb-6 mb-6">
          <DialogTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
            {isEdit ? (
              <>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                Edit Project
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                Create New Project
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            {isEdit
              ? "Update your project details and settings below."
              : "Fill in the project details below to add it to your portfolio."}{" "}
            Required fields are marked with{" "}
            <span className="text-red-500 font-medium">*</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Premium Status Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-blue-900 dark:text-blue-100 font-medium">
                {summary}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Project Visibility Section */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Project Visibility
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                    formData.published
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-background hover:border-green-300"
                  }`}
                  onClick={() => handleChange("published", true)}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        formData.published ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          formData.published
                            ? "text-green-900 dark:text-green-100"
                            : "text-foreground"
                        }`}
                      >
                        Published
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visible to everyone
                      </p>
                    </div>
                  </div>
                  {formData.published && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                    !formData.published
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-background hover:border-yellow-300"
                  }`}
                  onClick={() => handleChange("published", false)}
                >
                  <div className="flex items-center gap-3">
                    <Circle
                      className={`w-5 h-5 ${
                        !formData.published
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          !formData.published
                            ? "text-yellow-900 dark:text-yellow-100"
                            : "text-foreground"
                        }`}
                      >
                        Draft
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hidden from public
                      </p>
                    </div>
                  </div>
                  {!formData.published && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    </div>
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose whether this project is visible on your public portfolio.
              </p>
            </div>

            {/* Featured Section */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Homepage Highlight
                </h3>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.featured
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        formData.featured
                          ? "text-yellow-600 fill-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Featured Project
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Highlighted on homepage
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.featured}
                  onChange={(e) => handleChange("featured", e.target.checked)}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Project Details
                </h3>
              </div>

              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter project title..."
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe your project in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="min-h-[120px] text-base resize-none"
                    required
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tech Stack
                  </label>
                  <Input
                    placeholder="React, TypeScript, Next.js, Tailwind CSS..."
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Separate technologies with commas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Image */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Project Image
                </h3>
              </div>

              {formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Project preview"
                    className="w-full h-48 object-cover rounded-lg border shadow-sm"
                  />
                </div>
              )}

              <ImagePicker
                onChange={(file) => setSelectedFile(file)}
                previewUrl={formData.image}
              />

              <p className="text-sm text-muted-foreground mt-3">
                Upload a high-quality image (recommended: 1200×600px, max 5MB)
              </p>
            </div>

            {/* Project Links */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Project Links
                </h3>
              </div>

              <div className="space-y-4">
                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    GitHub Repository
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={formData.github_url}
                      onChange={(e) =>
                        handleChange("github_url", e.target.value)
                      }
                      className="pl-10 h-12 text-base"
                      type="url"
                    />
                  </div>
                </div>

                {/* Live Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Live Demo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                        />
                      </svg>
                    </div>
                    <Input
                      placeholder="https://your-project-demo.com"
                      value={formData.live_url}
                      onChange={(e) => handleChange("live_url", e.target.value)}
                      className="pl-10 h-12 text-base"
                      type="url"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-3 text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isEdit ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update Project
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Project
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
