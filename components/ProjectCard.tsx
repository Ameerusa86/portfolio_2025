import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { getProjectImageUrl } from "@/lib/supabase-storage";
import {
  ExternalLink,
  Github,
  Star,
  ArrowUpRight,
  Calendar,
  Code,
  Eye,
  Sparkles,
} from "lucide-react";

export function ProjectCard({
  project,
  viewMode = "grid",
}: {
  project: Project;
  viewMode?: "grid" | "list";
}) {
  const imageUrl =
    getProjectImageUrl(project.image) || "/placeholder-project.jpg";
  const hasImage = project.image && project.image.trim() !== "";

  // Fallback to ID if slug is not available (for backward compatibility)
  const projectSlug = project.slug || project.id;

  if (viewMode === "list") {
    return (
      <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-blue-200/60">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative w-full lg:w-96 h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-700"
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">
                    No Preview Available
                  </p>
                </div>
              </div>
            )}

            {/* Featured Star */}
            {project.featured && (
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <Link
              href={`/projects/${projectSlug}`}
              className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Eye className="w-4 h-4" />
                  <span>View Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 p-8 space-y-6">
            <div className="space-y-4">
              <Link
                href={`/projects/${projectSlug}`}
                className="block group/title"
              >
                <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 group-hover/title:tracking-wide">
                  {project.title}
                </h3>
              </Link>

              <p className="text-gray-600 leading-relaxed text-base line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    Technologies
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech: string, index) => (
                    <Badge
                      key={tech}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200/60 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 px-3 py-1.5 text-xs font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-300 font-medium"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </Link>
              )}
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col hover:border-blue-200/60">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section - Perfect aspect ratio */}
      <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <div className="aspect-video w-full relative">
          {hasImage ? (
            <>
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-700"
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Hover overlay */}
              <Link
                href={`/projects/${projectSlug}`}
                className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl transform scale-95 hover:scale-100 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-center">
                <Code className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium text-sm">
                  No Preview Available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Featured Star - Top Right */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-6 flex-1 flex flex-col space-y-4">
        {/* Project Header */}
        <div className="space-y-3">
          <Link href={`/projects/${projectSlug}`} className="block group/title">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
              {project.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {new Date(project.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 6).map((tech: string) => (
                <Badge
                  key={tech}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200/60 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 px-2.5 py-1 text-xs font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 6 && (
                <Badge variant="outline" className="text-xs px-2.5 py-1">
                  +{project.tech_stack.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 relative z-10">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm font-medium relative z-20 pointer-events-auto"
              onClick={(e) => {
                console.log("GitHub button clicked!", project.github_url);
                e.stopPropagation();
              }}
            >
              <Github className="w-3.5 h-3.5" />
              Code
            </Link>
          )}
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 text-sm font-medium relative z-20 pointer-events-auto"
              onClick={(e) => {
                console.log("Demo button clicked!", project.live_url);
                e.stopPropagation();
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Demo
            </Link>
          )}
        </div>

        {/* Single button fallback */}
        {(!project.github_url || !project.live_url) && (
          <div className="pt-2 relative z-10">
            {!project.github_url && project.live_url && (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  console.log("Single Demo button clicked!", project.live_url);
                  e.stopPropagation();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 text-sm font-medium relative z-20 pointer-events-auto"
              >
                <ExternalLink className="w-4 h-4" />
                View Live Demo
              </Link>
            )}
            {project.github_url && !project.live_url && (
              <Link
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  console.log(
                    "Single GitHub button clicked!",
                    project.github_url
                  );
                  e.stopPropagation();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm font-medium relative z-20 pointer-events-auto"
              >
                <Github className="w-4 h-4" />
                View Source Code
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
