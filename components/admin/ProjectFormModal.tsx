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
import { uploadImageFile } from "@/lib/uploadthing";

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
    techStack: [],
    githubUrl: "",
    liveUrl: "",
    createdAt: new Date().toISOString(),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStackInput, setTechStackInput] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTechStackInput(initialData.techStack.join(", "));
    } else {
      // Reset form when not editing
      setFormData({
        id: "",
        slug: "",
        title: "",
        description: "",
        image: "",
        techStack: [],
        githubUrl: "",
        liveUrl: "",
        createdAt: new Date().toISOString(),
      });
      setTechStackInput("");
      setSelectedFile(null);
    }
  }, [initialData, open]);

  const handleChange = (key: keyof Project, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required.");
      return;
    }

    let imageUrl = formData.image;

    // Upload image if a new file is selected
    if (selectedFile) {
      try {
        toast.info("Uploading image...");
        imageUrl = await uploadImageFile(selectedFile);
        toast.success("Image uploaded successfully!");
      } catch (err: any) {
        toast.error("Image upload failed: " + err.message);
        return;
      }
    }

    // Process tech stack input
    const techStackArray = techStackInput
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const project: Project = {
      ...formData,
      image: imageUrl,
      techStack: techStackArray,
      id: isEdit ? formData.id : crypto.randomUUID(),
      createdAt: isEdit ? formData.createdAt : new Date().toISOString(),
    };

    try {
      await onSave(project);
      toast.success(isEdit ? "Project updated!" : "Project created!");
      onClose();
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            Fill in the project details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Project title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Textarea
            placeholder="Project description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Input
            placeholder="Tech stack (comma separated, e.g. React, TypeScript, Node.js)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="rounded-lg w-full h-48 object-cover"
            />
          )}

          <ImagePicker
            onChange={(file) => setSelectedFile(file)}
            previewUrl={formData.image}
          />

          <Input
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={(e) => handleChange("githubUrl", e.target.value)}
          />

          <Input
            placeholder="Live demo URL"
            value={formData.liveUrl}
            onChange={(e) => handleChange("liveUrl", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
