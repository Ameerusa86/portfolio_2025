import * as React from "react";
import type { MDXComponents } from "mdx/types";

// Map MDX elements to styled components using our design tokens
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: React.ComponentProps<"h1">) => (
      <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-foreground" />
    ),
    h2: (props: React.ComponentProps<"h2">) => (
      <h2
        {...props}
        className="text-2xl font-semibold mt-6 mb-3 text-foreground"
      />
    ),
    h3: (props: React.ComponentProps<"h3">) => (
      <h3
        {...props}
        className="text-xl font-medium mt-4 mb-2 text-foreground"
      />
    ),
    p: (props: React.ComponentProps<"p">) => (
      <p {...props} className="mb-4 leading-relaxed text-foreground/90" />
    ),
    ul: (props: React.ComponentProps<"ul">) => (
      <ul {...props} className="list-disc ml-6 mb-4 space-y-2" />
    ),
    ol: (props: React.ComponentProps<"ol">) => (
      <ol {...props} className="list-decimal ml-6 mb-4 space-y-2" />
    ),
    li: (props: React.ComponentProps<"li">) => (
      <li {...props} className="text-foreground/90 leading-relaxed" />
    ),
    pre: (props: React.ComponentProps<"pre">) => (
      <pre
        {...props}
        className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm"
      />
    ),
    code: (props: React.ComponentProps<"code">) => (
      <code
        {...props}
        className="bg-muted px-2 py-1 rounded text-sm font-mono"
      />
    ),
    blockquote: (props: React.ComponentProps<"blockquote">) => (
      <blockquote
        {...props}
        className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
      />
    ),
    a: (props: React.ComponentProps<"a">) => (
      <a
        {...props}
        className="text-primary hover:text-primary/80 underline transition-colors"
      />
    ),
    table: (props: React.ComponentProps<"table">) => (
      <table {...props} className="w-full border-collapse my-4 text-sm" />
    ),
    th: (props: React.ComponentProps<"th">) => (
      <th
        {...props}
        className="border border-border bg-accent/30 px-3 py-2 text-left"
      />
    ),
    td: (props: React.ComponentProps<"td">) => (
      <td {...props} className="border border-border px-3 py-2 align-top" />
    ),
    ...components,
  };
}
