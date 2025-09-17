"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm, { ProjectFormData } from "./ProjectForm";
import { Project } from "@/types/project";
import { toast } from "sonner";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onProjectUpdated: () => void;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!project;

  const handleSubmit = async (projectData: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      // Use slug if available, otherwise fall back to id
      const identifier = isEdit ? project?.slug || project?.id : null;
      const url = isEdit ? `/api/projects/${identifier}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      console.log("Submitting project:", {
        isEdit,
        identifier,
        url,
        projectData,
        project: project
          ? { id: project.id, slug: project.slug, title: project.title }
          : null,
      });

      if (isEdit && !identifier) {
        throw new Error(
          "Cannot update project: missing identifier (both slug and id are undefined)"
        );
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(
          `Failed to ${isEdit ? "update" : "create"} project: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Success response:", result);

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
      <DialogContent
        className="w-[95vw] max-h-[95vh] overflow-y-auto !max-w-[95vw] bg-card/90 backdrop-blur-xl border border-border shadow-2xl"
        style={{
          width: "95vw",
          maxWidth: "95vw",
          margin: "2.5vh auto",
        }}
      >
        <DialogHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-accent/30 border border-border text-primary shadow-lg">
              <span className="font-bold text-lg">{isEdit ? "E" : "N"}</span>
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold text-foreground">
                {isEdit ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <p className="text-muted-foreground font-medium">
                {isEdit
                  ? "Update project details and settings"
                  : "Add a new project to your portfolio"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 px-1">
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
