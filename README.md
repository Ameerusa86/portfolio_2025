# Portfolio 2025 - Ameer Hasan

A modern, full-stack portfolio website built with cutting-edge technologies to showcase professional work, share insights through blogging, and connect with potential collaborators.

## 🚀 Features

### Frontend Features
- **Modern Design**: Sleek, responsive UI with smooth animations and glassmorphism effects
- **Portfolio Showcase**: Dynamic projects gallery with filtering and search capabilities
- **Blog Platform**: Full-featured blog with rich content, tagging, and related posts
- **About Section**: Interactive about page with skills showcase and personal story
- **Contact Form**: Professional contact form with form validation
- **SEO Optimized**: Built-in meta tags, Open Graph, and Twitter Cards support

### Admin Features
- **Content Management**: Admin dashboard for managing blogs, projects, and about content
- **Image Upload**: Integrated image upload system with Supabase storage
- **Real-time Updates**: Live content updates without page refreshes
- **Analytics**: View tracking for blog posts and engagement metrics

### Technical Features
- **Server-Side Rendering**: Fast loading with Next.js 15 and React Server Components
- **Type Safety**: Full TypeScript implementation for robust development
- **Database Integration**: Supabase for authentication, data storage, and file uploads
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Image optimization, code splitting, and caching strategies

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) for accessible components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form with Zod validation

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes with Server Actions

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Deployment**: Optimized for Vercel deployment
- **Version Control**: Git with semantic commits

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** for version control
- **Supabase Account** for database and storage

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Ameerusa86/portfolio_2025.git
cd portfolio_2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials:

```env
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Custom site URL for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. Database Setup

Run the database migrations to set up your tables:

```bash
# Run the migration script
node run-migration.js
```

Alternatively, execute the SQL files manually in your Supabase SQL editor:
- `database/create_about_table.sql`
- `database/create_profile_storage.sql`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
portfolio_2025/
├── app/                          # Next.js app directory
│   ├── (frontend)/              # Public-facing pages
│   │   ├── about/               # About page
│   │   ├── blog/                # Blog pages and post details
│   │   ├── contact/             # Contact form
│   │   └── projects/            # Projects showcase
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # API routes
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
├── database/                     # Database schemas and migrations
├── hooks/                        # Custom React hooks
├── lib/                         # Utility functions and configurations
├── public/                       # Static assets
├── supabase/                    # Supabase migrations
├── types/                       # TypeScript type definitions
└── README.md                    # Project documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Database
node run-migration.js # Run database migrations
```

## 🗄️ Database Schema

The application uses the following main tables:
- **blogs**: Blog posts with content, metadata, and analytics
- **about**: About page content and personal information
- **Storage buckets**: For profile images, blog images, and project images

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add your environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

```bash
# Build optimization for production
npm run build
```

### Other Platforms

The application is compatible with any platform that supports Node.js:
- **Netlify**: Configure build command as `npm run build`
- **Railway**: Connect GitHub and set environment variables
- **AWS/Azure**: Use container deployment with Dockerfile

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📝 Usage

### For Visitors
- Browse projects and read blog posts
- Learn about professional background and skills
- Get in touch through the contact form

### For Administrators
- Access the admin dashboard at `/admin`
- Manage blog posts, projects, and about content
- Upload and manage images
- View analytics and engagement metrics

## 🔒 Security Features

- **Row Level Security**: Implemented in Supabase for data protection
- **Input Validation**: Comprehensive form validation with Zod
- **File Upload Security**: Type and size validation for uploaded files
- **Environment Variables**: Sensitive data protected through environment configuration

## 📧 Contact

**Ameer Hasan** - Full-Stack Developer

- **Portfolio**: [Live Demo](https://portfolio-2025-jet-seven.vercel.app/)
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [@Ameerusa86](https://github.com/Ameerusa86)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 15, TypeScript, and Supabase**
