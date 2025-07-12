"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { ProjectTable } from "@/components/admin/ProjectTable";
import ProjectFormModal from "@/components/admin/ProjectFormModal";
import { Button } from "@/components/ui/button";
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?admin=true");
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

  const handleDelete = async (project: Project) => {
    if (!project || (!project.slug && !project.id)) {
      console.error("Invalid project: missing both slug and id");
      return;
    }

    try {
      const identifier = project.slug || project.id;
      console.log("Deleting project:", { identifier, project });

      const res = await fetch(`/api/projects/${identifier}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete failed:", errorData);
        throw new Error(errorData.error || "Failed to delete project");
      }

      await fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Error deleting project:", error);
      // You can add toast notification here if you want to show error to user
    }
  };

  // Filtering logic
  const filteredProjects =
    filter === "all"
      ? projects
      : filter === "published"
      ? projects.filter((p) => p.published)
      : projects.filter((p) => !p.published);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 w-full">
      <div className="w-full px-6 lg:px-8 py-8 space-y-8 max-w-none">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Manage your portfolio projects. Create, edit, and organize your
              work with our premium interface.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            className="w-full lg:w-auto px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            size="lg"
          >
            <span className="mr-2 text-lg">+</span>
            Add Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="h-7 w-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                  Featured
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.filter((p) => p.featured).length}
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                  Published
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.filter((p) => p.published).length}
                </p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <span className="font-semibold text-base text-gray-800">
              Filter Projects:
            </span>
            <div className="flex gap-3">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="min-w-[80px]"
              >
                All ({projects.length})
              </Button>
              <Button
                variant={filter === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("published")}
                className="min-w-[80px]"
              >
                Published ({projects.filter((p) => p.published).length})
              </Button>
              <Button
                variant={filter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("draft")}
                className="min-w-[80px]"
              >
                Draft ({projects.filter((p) => !p.published).length})
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <ProjectTable
            projects={filteredProjects}
            onEdit={(project) => {
              setEditingProject(project);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        <ProjectFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onProjectUpdated={() => {
            fetchProjects();
            setModalOpen(false);
            setEditingProject(null);
          }}
        />
      </div>
    </div>
  );
}
