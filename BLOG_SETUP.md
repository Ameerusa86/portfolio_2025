# Blog System Setup Guide

This guide will help you set up the blog system with Supabase database integration.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Ensure you have Node.js installed

## 1. Supabase Setup

### Create a New Project

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

### Get Project Credentials

1. Go to Project Settings → API
2. Copy your project URL and API keys:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (keep this secret!)

## 2. Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 3. Database Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_create_blogs_table.sql`
4. Paste and run the SQL in the editor

### Option 2: Using Supabase CLI

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:

   ```bash
   supabase login
   ```

3. Link your project:

   ```bash
   supabase link --project-ref your-project-id
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

## 4. Verify Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/admin/blogs` in your browser
3. Try creating a new blog post
4. Check your Supabase dashboard to see the data

## 5. Features

### Blog Management

- ✅ Create, read, update, delete blog posts
- ✅ Draft and published status management
- ✅ Featured posts
- ✅ Tags and categories
- ✅ Image uploads (via UploadThing)
- ✅ Automatic slug generation
- ✅ Read time estimation

### Database Features

- ✅ UUID primary keys
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Row Level Security (RLS) policies
- ✅ Optimized indexes for performance

## 6. API Endpoints

- `GET /api/blogs` - List all blogs (with filtering)
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/[id]` - Get single blog
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Query Parameters for GET /api/blogs:

- `status=published|draft|all` - Filter by status
- `featured=true` - Show only featured posts
- `limit=10` - Limit number of results

## 7. Troubleshooting

### Common Issues

**"Failed to load blogs" error:**

- Check environment variables are set correctly
- Verify Supabase project URL and keys
- Check network connection

**Database connection errors:**

- Ensure database migration was run successfully
- Check Supabase project is not paused (free tier)
- Verify service role key has correct permissions

**TypeScript errors:**

- Run `npm run build` to check for type issues
- Ensure all imports are correct

### Debug Mode

Add this to your `.env.local` for detailed logging:

```env
NODE_ENV=development
```

## 8. Production Deployment

### Environment Variables

Ensure these are set in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Row Level Security

The database comes with RLS policies that allow:

- Public read access to published blogs
- Full access for admin operations (using service role key)

### Performance

- Database indexes are optimized for common queries
- Consider enabling Supabase's built-in caching for production

## 9. Next Steps

1. **Authentication**: Add user authentication for admin panel
2. **SEO**: Implement OpenGraph meta tags for blog posts
3. **Comments**: Add comment system using Supabase
4. **Analytics**: Track blog post views and engagement
5. **Search**: Implement full-text search functionality

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Review the Supabase project logs
3. Ensure all environment variables are correctly set
4. Verify the database migration completed successfully
