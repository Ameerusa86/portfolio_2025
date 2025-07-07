"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { ProjectFormModal } from "@/components/admin/ProjectFormModal";
import { Button } from "@/components/ui/button";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fetch failed:", errorText);
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleSave = async (project: Project) => {
    try {
      const res = editingProject
        ? await fetch(`/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          })
        : await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save project");
      }

      await fetchProjects();
      setModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (res.ok) fetchProjects();
  };

  return (
    <section className="space-y-6 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your portfolio projects
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Project
        </Button>
      </div>

      <ProjectTable
        projects={projects}
        onEdit={(project) => {
          setEditingProject(project);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />
    </section>
  );
}
