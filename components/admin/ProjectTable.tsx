"use client";

import { Project } from "@/types/project";
import { ProjectRow } from "./ProjectRow";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectTable({ projects, onEdit, onDelete }: Props) {
  if (projects.length === 0) {
    return (
      <Card className="border border-border bg-card/70">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-border">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            No projects yet
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            Get started by creating your first project. Projects showcase your
            work and skills to potential clients and employers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
