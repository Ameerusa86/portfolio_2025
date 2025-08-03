# About Page Management Setup

This guide will help you set up the about page management system for your portfolio.

## Database Setup

1. **Create the About Table in Supabase:**

   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `database/create_about_table.sql`
   - Run the SQL script to create the about table with default data

2. **Verify Table Creation:**
   - Check the Tables section in your Supabase dashboard
   - You should see a new `about` table with the default data

## Features

### Admin Panel (`/admin/about`)

- **Full Content Management**: Edit all sections of the about page
- **Dynamic Skills**: Add/remove skills with a user-friendly interface
- **Story Paragraphs**: Manage multiple story paragraphs
- **Live Preview**: Link to view changes on the frontend
- **Form Validation**: Ensures all required fields are filled
- **Auto-save**: Automatic saving with loading states

### Frontend Integration (`/about`)

- **Dynamic Content**: Fetches content from the database
- **Fallback Data**: Shows default content if API fails
- **Server-Side Rendering**: Optimized for SEO
- **Responsive Design**: Works on all device sizes

## Admin Navigation

The About page management has been added to your admin sidebar navigation. Access it through:

**Admin Panel → About**

## API Endpoints

### GET `/api/about`

- Fetches the current about page data
- Returns default data if no custom data exists

### POST `/api/about`

- Creates new about page data
- Used for initial setup

### PUT `/api/about`

- Updates existing about page data
- Requires the about record ID

## Content Structure

The about page is divided into several manageable sections:

1. **Hero Section**

   - Page title
   - Subtitle
   - Hero description
   - Optional profile image

2. **Story Section**

   - Story title
   - Multiple story paragraphs (dynamic)

3. **Skills Section**

   - Skills title
   - Skills list (dynamic tags)

4. **Call to Action Section**
   - CTA title
   - CTA description

## Usage Instructions

1. **Access Admin Panel**: Navigate to `/admin/about`
2. **Edit Content**: Modify any section content in the form
3. **Manage Skills**: Add/remove skills using the skills interface
4. **Manage Story**: Add/remove story paragraphs as needed
5. **Save Changes**: Click "Save Changes" to update the database
6. **Preview**: Use the "Preview" button to see changes on the frontend

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks with proper error handling
- **Validation**: Client-side and server-side validation
- **Caching**: Server-side caching with revalidation

## Troubleshooting

### Database Connection Issues

- Verify your Supabase environment variables
- Check the about table exists and has proper permissions

### API Errors

- Check the browser console for detailed error messages
- Verify the API route is accessible at `/api/about`

### Content Not Updating

- Clear browser cache
- Check if changes are saved in the Supabase dashboard
- Verify the revalidation is working (may take up to 1 hour)

## Next Steps

After setting up the about page management:

1. Run the SQL script in Supabase
2. Access `/admin/about` to customize your content
3. Test the frontend at `/about` to see your changes
4. Customize the styling if needed

Your about page is now fully manageable through the admin panel!
