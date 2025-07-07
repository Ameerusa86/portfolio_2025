import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Code, Briefcase, User, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { sampleBlogPosts } from "@/lib/sample-blogs";

export default function HomePage() {
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

  // Get featured blog posts for the homepage
  const featuredBlogPosts = sampleBlogPosts
    .filter((post) => post.featured)
    .slice(0, 2);

  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold sm:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-xl">
            A passionate full-stack developer creating modern web applications
            with clean code and exceptional user experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/projects">
              <Briefcase className="h-4 w-4 mr-2" />
              View My Work
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">What I Bring to the Table</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combining technical expertise with creative problem-solving to
            deliver outstanding results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow"
            >
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      {featuredBlogPosts.length > 0 && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Latest from the Blog</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development and
              technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredBlogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/blog">
                <BookOpen className="h-4 w-4 mr-2" />
                View All Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-2xl p-12 space-y-6">
        <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Let's work together to bring your ideas to life with modern web
          technologies.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Start a Conversation</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More About Me</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
