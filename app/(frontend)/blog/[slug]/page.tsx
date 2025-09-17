import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Eye,
  Heart,
  Link2,
  Tag,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import LikeButton from "@/components/LikeButton";
import IncrementView from "@/components/IncrementView";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButton from "@/components/ShareButton";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<BlogPost | null> {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as BlogPost;
}

function formatDate(input?: string) {
  if (!input) return "—";
  try {
    const d = new Date(input);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return input;
  }
}

function extractHighlights(content: string, max = 4): string[] {
  // Grab first few bullet-like lines as highlights
  const lines = content.split(/\r?\n/);
  const picks = lines
    .map((l) => l.trim())
    .filter((l) => /^(\-|\*|•)\s+/.test(l))
    .map((l) => l.replace(/^(\-|\*|•)\s+/, ""));
  return picks.slice(0, max);
}

export default async function Page({ params }: PageProps) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const post = await getPost(slug);
  if (!post) notFound();

  const views = post.views ?? 0;
  const likes = post.likes ?? 0;
  const highlights = extractHighlights(post.content);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Reading progress + view increment hooks */}
      <ReadingProgress />
      <IncrementView slug={slug} />

      <section className="site-container py-10">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </nav>

        {/* Title & meta */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />{" "}
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.read_time} min read
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" /> {views.toLocaleString()} views
            </span>
          </div>
        </div>

        {/* Grid layout: content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-6">
            {post.excerpt && (
              <Card className="bg-card/70 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Article
                    Overview
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            )}

            {!!post.tags?.length && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-lg font-semibold">
                  <Tag className="h-5 w-5 text-primary" /> Tags
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {post.tags.map((t) => (
                    <div
                      key={t}
                      className="rounded-xl border border-border bg-card/70 px-4 py-3 text-sm flex items-center gap-2"
                    >
                      <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent/30 border border-border">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-3 text-primary"
                          fill="currentColor"
                        >
                          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                        </svg>
                      </span>
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highlights.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {highlights.map((h, i) => (
                    <Card key={i} className="bg-card/70">
                      <CardContent className="py-5">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 inline-flex size-6 items-center justify-center rounded-md bg-accent/30 border border-border text-primary">
                            ⚡
                          </span>
                          <div>
                            <div className="font-medium">{h.split(":")[0]}</div>
                            {h.includes(":") && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {h.split(":").slice(1).join(":").trim()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-card/70">
              <CardContent className="py-6">
                <article
                  id="article-content"
                  className="prose prose-invert max-w-none"
                >
                  <pre className="whitespace-pre-wrap leading-relaxed bg-background/40 border border-border/60 p-4 rounded-lg">
                    {post.content}
                  </pre>
                </article>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Article Details
                </CardTitle>
                <CardDescription>Quick facts about this post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Published
                  </span>
                  <span>
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Read time
                  </span>
                  <span>{post.read_time} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Views
                  </span>
                  <span>{views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Likes
                  </span>
                  <span>{likes.toLocaleString()}</span>
                </div>

                <div className="pt-2 flex gap-2">
                  <LikeButton slug={slug} initialLikes={likes} />
                  <ShareButton variant="outline" className="flex-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Quick Actions
                </CardTitle>
                <CardDescription>Share or save this article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <a href={`#article-content`}>
                    <Link2 className="h-4 w-4" /> Jump to content
                  </a>
                </Button>
                <PrintButton
                  variant="secondary"
                  className="w-full justify-center"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Explore More
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/blog">
                    <span className="mr-2">📝</span> All Blogs
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/contact">
                    <span className="mr-2">🤝</span> Work Together
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/about">
                    <span className="mr-2">👤</span> About Me
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
