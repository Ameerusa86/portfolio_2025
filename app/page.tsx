import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="text-center space-y-6">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Hi, I’m <span className="text-primary">Your Name</span>
      </h1>
      <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
        A full stack developer building modern apps with Next.js, TypeScript,
        and .NET.
      </p>

      <div className="flex justify-center gap-4 pt-4">
        <Link href="/projects">
          <Button size="lg">View Projects</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            Contact Me
          </Button>
        </Link>
      </div>
    </section>
  );
}
