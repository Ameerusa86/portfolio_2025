"use client";

import { Project } from "@/types/project";
import { ProjectRow } from "./ProjectRow";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectTable({ projects, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects found.</p>
      ) : (
        projects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
