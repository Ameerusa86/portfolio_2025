import { z } from "zod";

export const blogCoreFields = {
  title: z.string().min(1, "Title is required").max(255),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().trim().min(1)).max(25).default([]),
  read_time: z.number().int().min(1).max(120).default(5),
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("draft"),
};

export const createBlogSchema = z.object(blogCoreFields);
export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

type FormLike = Partial<{
  title: string;
  excerpt: string;
  content: string;
  image?: string | null;
  tags?: string[];
  read_time?: number;
  readTime?: number;
  featured?: boolean;
  status?: "published" | "draft";
}>;

export function mapFormToCreate(data: FormLike): CreateBlogInput {
  return createBlogSchema.parse({
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image || undefined,
    tags: data.tags || [],
    read_time: data.read_time ?? data.readTime ?? 5,
    featured: data.featured ?? false,
    status: data.status || "draft",
  });
}

export function mapFormToUpdate(data: FormLike): UpdateBlogInput {
  const mapped: Record<string, unknown> = { ...data };
  if (mapped.readTime && !mapped.read_time) mapped.read_time = mapped.readTime;
  return updateBlogSchema.parse(mapped);
}
