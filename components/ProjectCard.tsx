import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  const hasImage = project.image && project.image.trim() !== "";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-48 bg-muted">
        {hasImage ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error("Image failed to load:", project.image);
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📁</span>
              </div>
              <p className="text-sm text-muted-foreground">No Image</p>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-3 text-sm border-t">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 border rounded-md hover:bg-muted transition-colors"
            >
              GitHub
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Live Demo
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
