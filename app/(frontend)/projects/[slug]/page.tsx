import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { getProjectImageUrl } from "@/lib/supabase-storage";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
      }/api/projects/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const project = await response.json();
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/projects" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-lg text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="flex gap-3">
              {project.live_url && (
                <Button asChild>
                  <Link
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Link>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <Link
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Project Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(project.created_at)}
            </div>
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              {project.tech_stack.length} Technologies
            </div>
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
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
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  About This Project
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></span>
                    Modern, responsive design that works on all devices
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></span>
                    Built with the latest web technologies
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></span>
                    Optimized for performance and SEO
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></span>
                    Clean, maintainable code structure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Links */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.live_url && (
                    <Link
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  )}
                  {project.github_url && (
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Source Code
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span>
                      {project.updated_at
                        ? formatDate(project.updated_at)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">
                Interested in working together?
              </h3>
              <p className="text-muted-foreground mb-6">
                I'm always open to discussing new projects and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Get In Touch</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/projects">View More Projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
