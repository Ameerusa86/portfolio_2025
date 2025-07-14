const sampleBlogs = [
  {
    title: "Building Modern Web Applications with Next.js 15",
    excerpt:
      "Explore the latest features and improvements in Next.js 15, including the new App Router, Server Components, and performance optimizations that make building modern web applications easier than ever.",
    content: `# Building Modern Web Applications with Next.js 15

Next.js 15 represents a significant leap forward in React-based web development, bringing unprecedented performance improvements and developer experience enhancements. In this comprehensive guide, we'll explore the key features that make Next.js 15 a game-changer for modern web development.

## The App Router Revolution

The App Router in Next.js 15 introduces a new paradigm for building applications. Unlike the traditional Pages Router, the App Router leverages React's latest features including Server Components and Suspense.

### Key Benefits:

- **Server Components by Default**: Reduce client-side JavaScript bundle size
- **Streaming**: Improve perceived performance with progressive loading
- **Nested Layouts**: Create complex UI structures with ease
- **Loading States**: Built-in loading UI support

## Server Components: The Future of React

Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client. This results in:

- Faster initial page loads
- Better SEO performance
- Reduced bandwidth usage
- Improved Core Web Vitals

## Performance Optimizations

Next.js 15 includes several performance improvements:

- **Turbopack**: Faster development builds
- **Improved Image Optimization**: Better compression and format selection
- **Font Optimization**: Automatic font loading optimization
- **Bundle Splitting**: More efficient code splitting

## Getting Started

To start building with Next.js 15:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Conclusion

Next.js 15 sets a new standard for React frameworks, offering developers the tools they need to build fast, scalable, and maintainable web applications. Whether you're building a simple blog or a complex enterprise application, Next.js 15 provides the foundation for success.`,
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    tags: ["Next.js", "React", "Web Development", "JavaScript"],
    read_time: 8,
    featured: true,
    status: "published",
  },
  {
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    excerpt:
      "Dive deep into TypeScript's advanced features and learn how to write type-safe, maintainable code. From utility types to conditional types, master the patterns that make TypeScript powerful.",
    content: `# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has evolved from a simple type overlay for JavaScript into a powerful language that enables developers to build robust, maintainable applications. In this article, we'll explore advanced TypeScript patterns that will elevate your code quality.

## Utility Types: Your Swiss Army Knife

TypeScript's built-in utility types provide powerful ways to manipulate types:

### Partial and Required

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;
\`\`\`

### Pick and Omit

\`\`\`typescript
// Select specific properties
type UserPublic = Pick<User, 'id' | 'name'>;

// Exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
\`\`\`

## Conditional Types

Conditional types allow you to create types that depend on conditions:

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

## Template Literal Types

Create types from string patterns:

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
// Results in: "onClick" | "onFocus" | etc.
\`\`\`

## Best Practices

1. **Use strict mode**: Enable all strict type checking options
2. **Prefer interfaces over types**: For object shapes, use interfaces
3. **Use const assertions**: For immutable data structures
4. **Leverage mapped types**: For transforming existing types

## Conclusion

TypeScript's advanced features enable you to write more expressive, safer code. By mastering these patterns, you'll be able to catch errors at compile time and create more maintainable applications.`,
    image:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop",
    tags: ["TypeScript", "JavaScript", "Programming", "Web Development"],
    read_time: 12,
    featured: true,
    status: "published",
  },
  {
    title: "Building Responsive UIs with Tailwind CSS",
    excerpt:
      "Learn how to create beautiful, responsive user interfaces using Tailwind CSS. Discover utility-first principles, responsive design patterns, and advanced techniques for modern web design.",
    content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web development. Its utility-first approach enables rapid UI development while maintaining consistency and flexibility.

## The Utility-First Philosophy

Instead of writing custom CSS, Tailwind provides utility classes that apply specific styles:

\`\`\`html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-2">Card Title</h2>
  <p class="text-blue-100">Card content goes here</p>
</div>
\`\`\`

## Responsive Design Made Easy

Tailwind's responsive prefixes make it simple to create adaptive layouts:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  <!-- Responsive grid item -->
</div>
\`\`\`

## Advanced Techniques

### Custom Components with @apply

\`\`\`css
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
\`\`\`

### Dark Mode Support

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- Automatic dark mode support -->
</div>
\`\`\`

## Performance Considerations

- **Purge unused styles**: Remove unused utilities in production
- **JIT mode**: Just-in-time compilation for faster builds
- **Component extraction**: Create reusable components for complex patterns

## Conclusion

Tailwind CSS empowers developers to build beautiful, responsive interfaces quickly and efficiently. Its utility-first approach, combined with powerful features like responsive design and dark mode, makes it an excellent choice for modern web development.`,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    tags: ["Tailwind CSS", "CSS", "Web Design", "Frontend"],
    read_time: 6,
    featured: false,
    status: "published",
  },
];

async function createSampleBlogs() {
  for (const blog of sampleBlogs) {
    try {
      const response = await fetch("http://localhost:3001/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blog),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created blog: ${result.title}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create blog "${blog.title}":`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating blog "${blog.title}":`, error);
    }
  }
}

createSampleBlogs();
