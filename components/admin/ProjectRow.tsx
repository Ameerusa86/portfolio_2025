"use client";

import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectRow({ project, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-md px-4 py-3 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground">
          {project.techStack.join(", ")}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
