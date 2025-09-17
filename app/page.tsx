"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Code, Briefcase, User, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogPost } from "@/types/blog";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/blogs?status=published&featured=true&limit=2"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }
        const blogs = await response.json();
        setFeaturedBlogPosts(blogs);
      } catch (error) {
        console.error("Failed to fetch featured blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);
  const features = [
    {
      icon: Code,
      title: "Modern Technologies",
      description:
        "Building with the latest tools and frameworks like Next.js, TypeScript, and Tailwind CSS.",
    },
    {
      icon: Briefcase,
      title: "Professional Experience",
      description:
        "Years of experience creating scalable applications and solving complex problems.",
    },
    {
      icon: User,
      title: "User-Focused Design",
      description:
        "Creating intuitive and accessible interfaces that users love to interact with.",
    },
  ];

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="relative w-full mx-auto site-container text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold sm:text-6xl lg:text-7xl text-foreground">
              Hi, I'm <span className="text-primary">Ameer Hasan</span>
            </h1>
            <p className="max-w-4xl mx-auto text-muted-foreground text-xl lg:text-2xl leading-relaxed">
              A passionate full-stack developer creating modern web applications
              with clean code and exceptional user experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/projects">
                <Briefcase className="h-5 w-5 mr-2" />
                View My Work
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8 py-4 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 lg:py-32">
        <div className="site-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              What I Bring to the Table
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Combining technical expertise with creative problem-solving to
              deliver outstanding results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-8 transition-all duration-300 hover:scale-[1.02] border border-border bg-card/70 backdrop-blur-sm"
              >
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {featuredBlogPosts.length > 0 && (
        <section className="w-full py-20 lg:py-32">
          <div className="site-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Latest from the Blog
              </h2>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Insights, tutorials, and thoughts on web development and
                technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {loading ? (
                // Loading skeleton
                <>
                  <div className="bg-muted/40 rounded-xl h-80 animate-pulse" />
                  <div className="bg-muted/40 rounded-xl h-80 animate-pulse" />
                </>
              ) : (
                featuredBlogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              )}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-lg px-8 py-4 border-border hover:bg-accent hover:text-accent-foreground"
              >
                <Link href="/blog">
                  <BookOpen className="h-5 w-5 mr-2" />
                  View All Articles
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full py-20 lg:py-32">
        <div className="site-container">
          <div className="text-center bg-accent/40 rounded-3xl p-12 lg:p-20 border border-border">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Let's work together to bring your ideas to life with modern web
              technologies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/contact">Start a Conversation</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-lg px-8 py-4 border-border hover:bg-accent hover:text-accent-foreground"
              >
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
