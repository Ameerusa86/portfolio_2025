"use client";

import React from "react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Star, Calendar, Eye, EyeOff, Hash } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onTogglePublished?: (project: Project, published: boolean) => void;
  onToggleFeatured?: (project: Project, featured: boolean) => void;
}

export function ProjectRow({
  project,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const techStack = ((project as Record<string, unknown>).tech_stack ||
    []) as string[];
  const createdAt = project.created_at;

  const statusBadgeClasses = (published: boolean) =>
    published
      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
      : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-6 p-6">
          {/* Image */}
          <div className="relative flex-shrink-0">
            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.title || ""}
                className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow-md">
                <span className="text-xl">📁</span>
              </div>
            )}
            {project.featured && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Star className="h-3 w-3 text-white drop-shadow-sm" />
              </div>
            )}
          </div>

          {/* Content + Actions */}
          <div className="flex-1 min-w-0 flex items-start gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
                <Badge
                  className={`text-xs font-semibold px-3 py-1 shadow-sm ${statusBadgeClasses(
                    project.published
                  )}`}
                >
                  {project.published ? (
                    <Eye className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-1" />
                  )}
                  {project.published ? "published" : "draft"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>{formatDate(createdAt)}</span>
                </div>
                {techStack.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {techStack.slice(0, 3).map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 shadow-sm"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {techStack.length > 3 && (
                      <span className="text-xs text-gray-500 font-medium">
                        +{techStack.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions (right side) */}
            <div className="flex flex-col items-end gap-4 pt-1">
              <div className="flex flex-wrap justify-end gap-2 max-w-[14rem]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="h-10 px-4 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-medium transition-all duration-200 group/edit"
                >
                  <Edit className="h-4 w-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" />
                  Edit
                </Button>
                {onTogglePublished && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onTogglePublished(project, !project.published)
                    }
                    className={`h-10 px-4 border-2 font-medium transition-all duration-200 ${
                      project.published
                        ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 text-yellow-700"
                        : "border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700"
                    }`}
                  >
                    {project.published ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" /> Draft
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" /> Publish
                      </>
                    )}
                  </Button>
                )}
                {onToggleFeatured && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFeatured(project, !project.featured)}
                    className={`h-10 px-4 border-2 font-medium transition-all duration-200 ${
                      project.featured
                        ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 text-yellow-700"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {project.featured ? "Unfeature" : "Feature"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(project)}
                  className="h-10 px-4 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-700 font-medium transition-all duration-200 group/delete"
                >
                  <Trash2 className="h-4 w-4 mr-2 group-hover/delete:scale-110 transition-transform duration-200" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
