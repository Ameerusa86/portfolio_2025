import React from "react";
import { User, Code, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Full-stack developer passionate about creating exceptional digital
            experiences
          </p>
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-8">
            <User className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">My Story</h2>
            <p className="text-muted-foreground">
              I'm a passionate full-stack developer with experience in modern
              web technologies. I love building applications that solve
              real-world problems and provide great user experiences.
            </p>
            <p className="text-muted-foreground">
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing my knowledge with
              the developer community.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Skills & Technologies
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "MongoDB",
                "PostgreSQL",
                "Tailwind CSS",
                "Python",
              ].map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground mb-6">
            I'm always interested in new opportunities and exciting projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/projects">
                <Briefcase className="h-4 w-4 mr-2" />
                View My Work
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
