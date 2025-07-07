import { BlogPost } from "@/types/blog";

export const sampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "building-modern-web-applications-with-nextjs-15",
    title: "Building Modern Web Applications with Next.js 15",
    excerpt:
      "Explore the latest features and improvements in Next.js 15, including the new App Router, Server Components, and performance optimizations that make building modern web applications easier than ever.",
    content: `
# Building Modern Web Applications with Next.js 15

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

Next.js 15 sets a new standard for React frameworks, offering developers the tools they need to build fast, scalable, and maintainable web applications. Whether you're building a simple blog or a complex enterprise application, Next.js 15 provides the foundation for success.
    `,
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    tags: ["Next.js", "React", "Web Development", "JavaScript"],
    author: "Ameer",
    publishedAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    readTime: 8,
    featured: true,
    status: "published",
  },
  {
    id: "2",
    slug: "mastering-typescript-advanced-patterns-best-practices",
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    excerpt:
      "Dive deep into TypeScript's advanced features and learn how to write type-safe, maintainable code. From utility types to conditional types, master the patterns that make TypeScript powerful.",
    content: `
# Mastering TypeScript: Advanced Patterns and Best Practices

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

TypeScript's advanced features enable you to write more expressive, safer code. By mastering these patterns, you'll be able to catch errors at compile time and create more maintainable applications.
    `,
    image:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop",
    tags: ["TypeScript", "JavaScript", "Programming", "Web Development"],
    author: "Ameer",
    publishedAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-10T14:30:00Z",
    readTime: 12,
    featured: true,
    status: "published",
  },
  {
    id: "3",
    slug: "building-responsive-uis-with-tailwind-css",
    title: "Building Responsive UIs with Tailwind CSS",
    excerpt:
      "Learn how to create beautiful, responsive user interfaces using Tailwind CSS. Discover utility-first principles, responsive design patterns, and advanced techniques for modern web design.",
    content: `
# Building Responsive UIs with Tailwind CSS

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

Tailwind CSS empowers developers to build beautiful, responsive interfaces quickly and efficiently. Its utility-first approach, combined with powerful features like responsive design and dark mode, makes it an excellent choice for modern web development.
    `,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    tags: ["Tailwind CSS", "CSS", "Web Design", "Frontend"],
    author: "Ameer",
    publishedAt: "2025-01-08T09:15:00Z",
    updatedAt: "2025-01-08T09:15:00Z",
    readTime: 6,
    featured: false,
    status: "published",
  },
  {
    id: "4",
    slug: "future-of-web-development-trends-2025",
    title: "The Future of Web Development: Trends for 2025",
    excerpt:
      "Explore the emerging trends and technologies that will shape web development in 2025. From AI-powered development tools to new frameworks, discover what's coming next.",
    content: `
# The Future of Web Development: Trends for 2025

As we move through 2025, the web development landscape continues to evolve at a rapid pace. New technologies, frameworks, and methodologies are emerging that promise to reshape how we build and interact with web applications.

## AI-Powered Development

Artificial Intelligence is becoming an integral part of the development process:

### Code Generation
- **GitHub Copilot**: AI-powered code completion
- **ChatGPT**: Code explanation and debugging assistance
- **Cursor**: AI-integrated development environment

### Automated Testing
- AI-generated test cases
- Intelligent bug detection
- Performance optimization suggestions

## Edge Computing and Serverless

The shift towards edge computing is accelerating:

### Benefits
- **Reduced latency**: Processing closer to users
- **Better performance**: Faster response times
- **Cost efficiency**: Pay only for what you use

### Platforms
- Vercel Edge Functions
- Cloudflare Workers
- AWS Lambda@Edge

## New JavaScript Frameworks

The framework ecosystem continues to innovate:

### Solid.js
- Fine-grained reactivity
- No virtual DOM overhead
- Excellent performance

### Qwik
- Resumable applications
- Instant loading
- Progressive hydration

## Web Assembly (WASM)

WebAssembly is opening new possibilities:

- **Performance**: Near-native execution speed
- **Language diversity**: Use any language on the web
- **Complex applications**: Games, image editors, and more

## Progressive Web Apps (PWAs)

PWAs are becoming more capable:

- **Project Fugu**: New web APIs
- **Better integration**: Native-like experiences
- **Offline-first**: Reliable connectivity

## Conclusion

The future of web development is exciting and full of possibilities. By staying informed about these trends and experimenting with new technologies, developers can build better, faster, and more engaging web experiences.
    `,
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    tags: ["Web Development", "Technology", "Future", "Innovation"],
    author: "Ameer",
    publishedAt: "2025-01-05T16:45:00Z",
    updatedAt: "2025-01-05T16:45:00Z",
    readTime: 10,
    featured: false,
    status: "published",
  },
  {
    id: "5",
    slug: "database-design-patterns-modern-applications",
    title: "Database Design Patterns for Modern Applications",
    excerpt:
      "Learn essential database design patterns that will help you build scalable, maintainable applications. From normalization to denormalization, understand when and how to apply different strategies.",
    content: `
# Database Design Patterns for Modern Applications

Effective database design is crucial for building scalable, maintainable applications. In this comprehensive guide, we'll explore essential patterns and best practices for modern database architecture.

## Normalization vs. Denormalization

### Normalization Benefits
- **Data integrity**: Reduces redundancy
- **Storage efficiency**: Minimal data duplication
- **Consistency**: Single source of truth

### When to Denormalize
- **Read performance**: Fewer joins needed
- **Complex queries**: Simplified data access
- **Reporting**: Optimized for analytics

## Popular Design Patterns

### Repository Pattern
Encapsulate data access logic:

\`\`\`typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
\`\`\`

### Unit of Work
Manage transactions and changes:

\`\`\`typescript
class UnitOfWork {
  private changes: Map<string, any> = new Map();
  
  register(entity: any) {
    this.changes.set(entity.id, entity);
  }
  
  async commit() {
    // Apply all changes in a transaction
  }
}
\`\`\`

## NoSQL Patterns

### Document Store
Store related data together:

\`\`\`json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "orders": [
      { "id": "456", "total": 99.99 },
      { "id": "789", "total": 149.99 }
    ]
  }
}
\`\`\`

### Key-Value Store
Simple, fast access:

\`\`\`typescript
// Cache user sessions
const userSession = await redis.get(\`session:\${userId}\`);
\`\`\`

## Performance Optimization

### Indexing Strategies
- **Primary indexes**: On frequently queried fields
- **Composite indexes**: For multi-field queries
- **Partial indexes**: For conditional data

### Query Optimization
- **Avoid N+1 queries**: Use eager loading
- **Connection pooling**: Reuse database connections
- **Caching**: Store frequently accessed data

## Conclusion

Good database design is the foundation of successful applications. By understanding these patterns and when to apply them, you can build systems that are both performant and maintainable.
    `,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    tags: ["Database", "Design Patterns", "Backend", "Architecture"],
    author: "Ameer",
    publishedAt: "2025-01-03T11:20:00Z",
    updatedAt: "2025-01-03T11:20:00Z",
    readTime: 15,
    featured: false,
    status: "published",
  },
];
