import React from "react";
import { User, Code, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AboutData } from "@/types/about";
import { getProfileImageUrl } from "@/lib/supabase-storage";
import { supabaseAdmin, supabase } from "@/lib/supabase";

async function getAboutData(): Promise<AboutData> {
  try {
    // Use Supabase client directly instead of fetch
    const client = supabaseAdmin || supabase;

    if (!client) {
      console.error("No Supabase client available in about page");
      throw new Error("Database configuration error");
    }

    console.log("About page: Fetching from Supabase directly...");

    const { data: aboutData, error } = await client
      .from("about")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("About page: Supabase error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (aboutData) {
      console.log("About page: Successfully fetched data:", aboutData.id);
      return aboutData;
    }

    console.log("About page: No data found, using default");
    throw new Error("No about data found");
  } catch (error) {
    console.error("About page: Error fetching about data:", error);
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
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative w-full site-container py-16 sm:py-24">
          <div className="text-center space-y-8">
            {aboutData.profile_image ? (
              <div className="w-48 h-48 mx-auto mb-8 relative">
                <Image
                  src={
                    getProfileImageUrl(aboutData.profile_image) ||
                    "/placeholder-profile.jpg"
                  }
                  alt={aboutData.title}
                  fill
                  className="rounded-full object-cover shadow-2xl ring-4 ring-border"
                />
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center mb-8 shadow-2xl">
                <User className="h-16 w-16 text-primary-foreground" />
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
              {aboutData.title}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {aboutData.hero_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 sm:py-16">
        <div className="site-container">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6 bg-card/70 rounded-2xl p-8 border border-border shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                {aboutData.story_title}
              </h2>
              {aboutData.story_content.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-6 bg-card/70 rounded-2xl p-8 border border-border shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                {aboutData.skills_title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground/90">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-accent/40 rounded-2xl p-8 border border-border shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              {aboutData.cta_title}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {aboutData.cta_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/projects">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View My Work
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
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
