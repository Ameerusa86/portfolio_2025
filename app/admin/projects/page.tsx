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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio projects. Create, edit, and organize your
            work.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Add Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Projects
              </p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary">📁</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Featured
              </p>
              <p className="text-2xl font-bold">
                {projects.filter((p) => p.featured).length}
              </p>
            </div>
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary">⭐</span>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-card border rounded-lg">
        <ProjectTable
          projects={projects}
          onEdit={(project) => {
            setEditingProject(project);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />
    </div>
  );
}
