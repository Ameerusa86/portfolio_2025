"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/types/project";
import React, { useEffect, useState } from "react";
import { Search, Grid3X3, List, Star, Code, Zap, Award } from "lucide-react";
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
      <div className="w-full min-h-screen bg-background text-foreground">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden min-h-[40vh]">
          <div className="relative w-full h-full flex items-center justify-center site-container">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="h-16 bg-muted rounded-lg animate-pulse" />
              <div className="h-6 bg-muted rounded-lg animate-pulse" />
              <div className="h-6 bg-muted rounded-lg animate-pulse max-w-3xl mx-auto" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="w-full py-16">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="h-8 bg-muted rounded-lg animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {/* Projects Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/70 rounded-2xl h-96 animate-pulse border border-border shadow-lg"
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
      <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-card/70 rounded-2xl p-8 border border-border shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative w-full site-container py-16 sm:py-24">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-accent/40 px-4 py-2 rounded-full border border-border shadow-lg mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/90">
                Featured Work & Projects
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
              My Projects
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A curated collection of innovative projects showcasing
              cutting-edge technologies, creative solutions, and professional
              development expertise.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge
                variant="secondary"
                className="bg-background border border-border text-foreground"
              >
                <Code className="w-3 h-3 mr-1 text-primary" />
                Full Stack Development
              </Badge>
              <Badge
                variant="secondary"
                className="bg-background border border-border text-foreground"
              >
                <Zap className="w-3 h-3 mr-1 text-primary" />
                Modern Technologies
              </Badge>
              <Badge
                variant="secondary"
                className="bg-background border border-border text-foreground"
              >
                <Award className="w-3 h-3 mr-1 text-primary" />
                Production Ready
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Total Projects
              </div>
            </div>
            <div className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.featured}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Featured
              </div>
            </div>
            <div className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.technologies}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Technologies
              </div>
            </div>
            <div className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.published}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Published
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-12 sm:py-16">
        <div className="site-container">
          {/* Filters and Search */}
          <div className="bg-card/70 rounded-2xl p-6 border border-border shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-background border-border focus:border-primary/50 transition-all"
                  />
                </div>

                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary/50 transition-all min-w-48"
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
                      ? "bg-primary hover:bg-primary/90 text-background border-primary"
                      : "bg-background border-border text-foreground hover:bg-accent/30"
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
                      ? "bg-primary hover:bg-primary/90 text-background border-primary"
                      : "bg-background border-border text-foreground hover:bg-accent/30"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {(searchTerm || selectedTech) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Filters active:
                </span>
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/30"
                  >
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-primary text-primary/90 font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedTech && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/30"
                  >
                    Tech: {selectedTech}
                    <button
                      onClick={() => setSelectedTech("")}
                      className="ml-2 hover:text-primary text-primary/90 font-bold"
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
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredProjects.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {projects.length}
                </span>{" "}
                projects
              </p>
              {filteredProjects.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Updated {new Date().toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
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
                  className="bg-background border-border text-foreground hover:bg-accent/30"
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
