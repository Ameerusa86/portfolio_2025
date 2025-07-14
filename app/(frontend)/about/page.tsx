import React from "react";
import { User, Code, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <User className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              About Me
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Full-stack developer passionate about creating exceptional digital
              experiences that make a difference
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">My Story</h2>
              <p className="text-gray-600 leading-relaxed">
                I'm a passionate full-stack developer with experience in modern
                web technologies. I love building applications that solve
                real-world problems and provide great user experiences.
              </p>
              <p className="text-gray-600 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing my knowledge with
                the developer community.
              </p>
            </div>

            <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
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
                    <Code className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Let's Work Together</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I'm always interested in new opportunities and exciting projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/projects">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View My Work
                </Link>
              </Button>
              <Button variant="outline" asChild className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Get In Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
