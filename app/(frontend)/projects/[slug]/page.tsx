"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Tag,
  ChevronRight,
  Star,
  Code,
  Zap,
  Globe,
  Eye,
  Share2,
  Heart,
  Award,
  Download,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjectImageUrl } from "@/lib/supabase-storage";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  created_at: string;
  updated_at?: string;
  technologies: string[];
  features: string[];
  status?: string;
  published?: boolean;
  featured?: boolean;
}

// Move to client-side data fetching
export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/404");
            return;
          }
          throw new Error(`Failed to fetch project: ${response.statusText}`);
        }
        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProject();
    }
  }, [params.slug, router]);

  const handleShare = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing or sharing failed
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Resolve technologies from multiple possible fields returned by the API
  const displayTechs: string[] = (() => {
    const anyP = project as any;
    if (!anyP) return [];
    if (Array.isArray(anyP.technologies) && anyP.technologies.length)
      return anyP.technologies;
    if (Array.isArray(anyP.tech_stack) && anyP.tech_stack.length)
      return anyP.tech_stack;
    if (Array.isArray(anyP.tags) && anyP.tags.length) return anyP.tags;
    if (Array.isArray(anyP.features) && anyP.features.length)
      return anyP.features;
    return [];
  })();

  if (!project) return null;

  // Determine published state: prefer explicit boolean 'published', fall back to status string
  const isPublished =
    typeof project.published === "boolean"
      ? project.published
      : (project.status || "").toLowerCase() === "published";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />

        {/* Navigation Breadcrumb */}
        <div className="absolute top-8 left-0 w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Projects
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {project.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-6">
            {project.featured && (
              <div className="flex justify-center">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm">
                  <Star className="h-4 w-4 mr-1" />
                  Featured Project
                </Badge>
              </div>
            )}

            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {project.title}
            </h1>

            <p className="max-w-4xl mx-auto text-muted-foreground text-lg lg:text-xl leading-relaxed">
              {project.description}
            </p>

            {/* Project Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {displayTechs.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Technologies
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatDate(project.created_at).split(",")[1]}
                </div>
                <div className="text-sm text-muted-foreground">Year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {isPublished ? "Live" : "Dev"}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            {project.demo_url && (
              <Button size="lg" asChild className="text-lg px-8 py-4 shadow-xl">
                <Link
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  View Live Demo
                  <ExternalLink className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            )}

            {project.github_url && (
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm border-white/50 shadow-xl"
              >
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View Source Code
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Project Showcase Image */}
      {project.image && (
        <section className="w-full py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-video lg:aspect-[21/9] w-full">
                  <Image
                    src={
                      getProjectImageUrl(project.image) ||
                      "/placeholder-project.jpg"
                    }
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Floating Action Buttons */}
                  <div className="absolute bottom-6 right-6 flex gap-3">
                    {project.demo_url && (
                      <Button size="sm" asChild className="shadow-lg">
                        <Link
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Technologies preview removed — techs will show under Project Overview */}

      {/* Main Content */}
      <section className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Content Area */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Overview */}
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  Project Overview
                </h2>
                <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                  <CardContent className="p-8">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Technology Stack */}
              {displayTechs && displayTechs.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                    <Code className="h-8 w-8 text-primary" />
                    Technology Stack
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {displayTechs.map((tech) => (
                      <Card
                        key={tech}
                        className="text-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
                      >
                        <CardContent className="space-y-3">
                          <div className="flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Zap className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="font-medium text-sm">{tech}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  Key Features & Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-lg transition-all duration-300">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Globe className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">Responsive Design</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Fully responsive interface that works seamlessly across
                        all devices and screen sizes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-lg transition-all duration-300">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Code className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">Clean Architecture</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Well-structured, maintainable code following industry
                        best practices and standards.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-lg transition-all duration-300">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">Performance Optimized</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Optimized for speed and performance with modern
                        development techniques.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-lg transition-all duration-300">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">User Experience</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Intuitive and user-friendly interface designed with
                        accessibility in mind.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Info Card */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Project Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={isPublished ? "default" : "secondary"}
                        className="font-medium"
                      >
                        {isPublished ? "Live & Active" : "In Development"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    {project.updated_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Technologies
                      </span>
                      <span className="text-sm font-medium">
                        {displayTechs.length}
                      </span>
                    </div>

                    {project.featured && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Featured</span>
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Source Code
                        </Link>
                      </Button>
                    )}

                    {project.demo_url && (
                      <Button size="sm" asChild className="w-full">
                        <Link
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Project
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const projectInfo = `Project: ${
                          project.title
                        }\n\nDescription: ${
                          project.description
                        }\n\nTechnologies: ${project.technologies?.join(
                          ", "
                        )}\n\nCreated: ${formatDate(project.created_at)}`;
                        const blob = new Blob([projectInfo], {
                          type: "text/plain",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${project.title.replace(
                          /\s+/g,
                          "_"
                        )}_info.txt`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        toast.success("Project info downloaded!");
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Info
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold">Explore More</h3>

                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/projects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        All Projects
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/contact">
                        <Heart className="h-4 w-4 mr-2" />
                        Work Together
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/about">
                        <Users className="h-4 w-4 mr-2" />
                        About Me
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 lg:p-20 shadow-xl border border-white/50">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-white">
                  <Heart className="h-8 w-8" />
                </div>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold">
                Impressed by This Project?
              </h2>

              <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Let's collaborate and bring your vision to life with the same
                attention to detail, quality, and passion that went into this
                project.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/contact">
                    <Heart className="h-5 w-5 mr-2" />
                    Start Your Project
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-4"
                >
                  <Link href="/projects">
                    <Code className="h-5 w-5 mr-2" />
                    View More Work
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
