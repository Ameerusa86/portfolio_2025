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
    <Card className="group hover:shadow-xl transition-all duration-300 border border-border bg-card/70 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-6 p-6">
          {/* Image */}
          <div className="relative flex-shrink-0">
            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.title || ""}
                className="w-24 h-24 object-cover rounded-xl border border-border shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            ) : (
              <div className="w-24 h-24 bg-accent/10 rounded-xl border border-border flex items-center justify-center shadow-md">
                <span className="text-xl">📁</span>
              </div>
            )}
            {project.featured && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
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
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
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

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>{formatDate(createdAt)}</span>
                </div>
                {techStack.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {techStack.slice(0, 3).map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-accent/20 text-foreground border border-border shadow-sm"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {techStack.length > 3 && (
                      <span className="text-xs text-muted-foreground font-medium">
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
                  className="h-10 px-4 border-2 border-border hover:bg-accent/10 text-foreground font-medium transition-all duration-200 group/edit"
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
                    className={`h-10 px-4 border-2 font-medium transition-all duration-200 border-border hover:bg-accent/10 text-foreground`}
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
                    className={`h-10 px-4 border-2 font-medium transition-all duration-200 border-border hover:bg-accent/10 text-foreground`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {project.featured ? "Unfeature" : "Feature"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(project)}
                  className="h-10 px-4 border-2 border-border hover:bg-accent/10 text-foreground font-medium transition-all duration-200 group/delete"
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
