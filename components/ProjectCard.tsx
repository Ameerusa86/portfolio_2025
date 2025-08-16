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
      <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border border-border/60 shadow hover:shadow-lg transition-all duration-300 hover:border-blue-300/60 hover:-translate-y-0.5 will-change-transform">
        {/* Full-card clickable overlay */}
        <Link
          href={`/projects/${projectSlug}`}
          aria-label={`View project: ${project.title}`}
          className="absolute inset-0 z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative w-full lg:w-[360px] xl:w-[400px] p-3">
            <div className="relative aspect-video w-full rounded-md overflow-hidden shadow-sm border border-border/60 bg-white">
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
                <div className="absolute top-3 right-3 z-20">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 via-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/70">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Eye className="w-4 h-4" />
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 p-6 lg:p-7 space-y-5 relative z-20">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 group-hover:tracking-wide line-clamp-2">
                {project.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm md:text-[15px] line-clamp-3 max-w-prose">
                {project.description}
              </p>

              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
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
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
                  <Code className="w-3 h-3 text-blue-600" />
                  Technologies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.slice(0, 10).map((tech: string) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-medium tracking-wide transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 10 && (
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-blue-700">
                      +{project.tech_stack.length - 10}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Optional Tags / Status */}
            {(project.tags?.length || project.status) && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags?.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags && project.tags.length > 4 && (
                  <Badge variant="outline" className="text-[10px] font-medium">
                    +{project.tags.length - 4}
                  </Badge>
                )}
                {project.status && (
                  <Badge className="text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">
                    {project.status}
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 relative z-30">
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 h-10 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium shadow-sm text-sm"
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
                  className="inline-flex items-center gap-2 px-5 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 font-medium shadow-sm text-sm"
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
    <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border border-border/60 shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col hover:border-blue-200/60">
      <Link
        href={`/projects/${projectSlug}`}
        aria-label={`View project: ${project.title}`}
        className="absolute inset-0 z-10"
      />
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section - Perfect aspect ratio */}
      <div className="relative w-full p-3">
        <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-border/60 bg-white shadow-sm">
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
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
              {project.tech_stack.slice(0, 5).map((tech: string) => (
                <Badge
                  key={tech}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200/60 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 px-2.5 py-1 text-[11px] font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 5 && (
                <Badge
                  variant="outline"
                  className="text-[11px] px-2.5 py-1 font-medium"
                >
                  +{project.tech_stack.length - 5}
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
            {/* {project.github_url && !project.live_url && (
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
            )} */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
