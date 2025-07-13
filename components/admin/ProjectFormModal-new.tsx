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
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto">
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

        <div className="mt-6">
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
