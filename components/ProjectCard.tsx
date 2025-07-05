import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-muted rounded-md dark:bg-gray-800"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-3 text-sm">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              className="underline text-primary"
            >
              GitHub
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="underline text-primary"
            >
              Live Demo
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
