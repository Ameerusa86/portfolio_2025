import React from "react";
import { User, Code, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AboutData } from "@/types/about";
import { getProfileImageUrl } from "@/lib/supabase-storage";

async function getAboutData(): Promise<AboutData> {
  // Build an absolute base URL that works in:
  // - Dev (localhost any port)
  // - Vercel preview / prod (VERCEL_URL)
  // - Custom domain (NEXT_PUBLIC_SITE_URL)
  const baseUrl = (() => {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) return explicit.replace(/\/$/, "");
    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
    const port = process.env.PORT || "3000"; // Next dev default
    return `http://localhost:${port}`;
  })();

  try {
    const response = await fetch(`${baseUrl}/api/about`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching about data:", error);
    // Return default data if API fails
    return {
      id: "default",
      title: "About Me",
      subtitle:
        "Full-stack developer passionate about creating exceptional digital experiences that make a difference",
      hero_description:
        "Full-stack developer passionate about creating exceptional digital experiences that make a difference",
      story_title: "My Story",
      story_content: [
        "I'm a passionate full-stack developer with experience in modern web technologies. I love building applications that solve real-world problems and provide great user experiences.",
        "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.",
      ],
      skills_title: "Skills & Technologies",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Python",
      ],
      cta_title: "Let's Work Together",
      cta_description:
        "I'm always interested in new opportunities and exciting projects.",
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutData();
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {aboutData.profile_image ? (
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <Image
                  src={
                    getProfileImageUrl(aboutData.profile_image) ||
                    "/placeholder-profile.jpg"
                  }
                  alt={aboutData.title}
                  fill
                  className="rounded-full object-cover shadow-2xl ring-4 ring-white/20"
                />
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
                <User className="h-16 w-16 text-white" />
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              {aboutData.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {aboutData.hero_description}
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
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {aboutData.story_title}
              </h2>
              {aboutData.story_content.map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {aboutData.skills_title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.skills.map((skill) => (
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              {aboutData.cta_title}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {aboutData.cta_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/projects">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View My Work
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
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
