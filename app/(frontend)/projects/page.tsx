import { ProjectCard } from "@/components/ProjectCard";
import { sampleProjects } from "@/lib/sample-projects";
import React from "react";

const ProjectsPage = () => {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {sampleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsPage;
