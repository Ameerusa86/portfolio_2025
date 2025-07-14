"use client";

import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  Edit,
  Trash2,
  Star,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectRow({ project, onEdit, onDelete }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Defensive: support both camelCase and snake_case, and default arrays/strings
  // Use type assertions to access possible snake_case fields from Supabase
  const techStack = (project as any).tech_stack || [];
  const githubUrl = (project as any).github_url || "";
  const liveUrl = project.live_url || "";
  const createdAt = project.created_at || "";

  return (
    <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200/60">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardContent className="p-6 relative">
        <div className="flex flex-col space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Project Image */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title || ""}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl">📁</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Title and Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {project.title || ""}
                  </h3>
                  {project.featured && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={project.published ? "default" : "outline"}
                    className={`text-xs ${
                      project.published
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(project)}
                className="hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(project)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="pl-20">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {project.description || ""}
            </p>

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {techStack.slice(0, 6).map((tech: string) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                  >
                    {tech}
                  </Badge>
                ))}
                {techStack.length > 6 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{techStack.length - 6} more
                  </Badge>
                )}
              </div>
            )}

            {/* External Links */}
            <div className="flex gap-3">
              {githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
                >
                  <Link
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </Link>
                </Button>
              )}
              {liveUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-blue-600"
                >
                  <Link
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
