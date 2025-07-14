"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/types/project";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Code,
  Zap,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique technologies from all projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech_stack?.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on search and technology
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech =
        !selectedTech || project.tech_stack?.includes(selectedTech);
      return matchesSearch && matchesTech;
    });
  }, [projects, searchTerm, selectedTech]);

  const featuredProjects = projects.filter((project) => project.featured);
  const stats = {
    total: projects.length,
    featured: featuredProjects.length,
    technologies: allTechnologies.length,
    published: projects.filter((p) => p.published).length,
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched projects:", data); // Debug log
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden min-h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
          <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
              <div className="h-6 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-6 bg-slate-200 rounded-lg animate-pulse max-w-3xl mx-auto" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="w-full bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
                >
                  <div className="h-8 bg-slate-200 rounded-lg animate-pulse mb-2" />
                  <div className="h-4 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {/* Projects Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl h-96 animate-pulse border border-white/50 shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-lg mb-6">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Featured Work & Projects
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              My Projects
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A curated collection of innovative projects showcasing
              cutting-edge technologies, creative solutions, and professional
              development expertise.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg text-blue-800"
              >
                <Code className="w-3 h-3 mr-1 text-blue-600" />
                Full Stack Development
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm border border-purple-200 shadow-lg text-purple-800"
              >
                <Zap className="w-3 h-3 mr-1 text-purple-600" />
                Modern Technologies
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm border border-green-200 shadow-lg text-green-800"
              >
                <Award className="w-3 h-3 mr-1 text-green-600" />
                Production Ready
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Projects
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stats.featured}
              </div>
              <div className="text-sm text-gray-600 font-medium">Featured</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-1">
                {stats.technologies}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Technologies
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.published}
              </div>
              <div className="text-sm text-gray-600 font-medium">Published</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-400 transition-all"
                />
              </div>

              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white/80 text-gray-700 focus:bg-white focus:border-blue-400 transition-all min-w-48"
              >
                <option value="">All Technologies</option>
                {allTechnologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {(searchTerm || selectedTech) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">
                Filters active:
              </span>
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-900 border border-blue-200"
                >
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 hover:text-blue-700 text-blue-600 font-bold"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedTech && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-900 border border-purple-200"
                >
                  Tech: {selectedTech}
                  <button
                    onClick={() => setSelectedTech("")}
                    className="ml-2 hover:text-purple-700 text-purple-600 font-bold"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {projects.length}
              </span>{" "}
              projects
            </p>
            {filteredProjects.length > 0 && (
              <p className="text-sm text-gray-500">
                Updated {new Date().toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedTech
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : "No projects are available at the moment. Check back later for updates!"}
            </p>
            {(searchTerm || selectedTech) && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTech("");
                }}
                variant="outline"
                className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
