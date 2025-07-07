import { Project } from "@/types/project";

export const sampleProjects: Project[] = [
  {
    id: "1",
    slug: "full-stack-portfolio-nextjs",
    title: "Full Stack Portfolio Website",
    description:
      "A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean design, dark mode support, project showcase, blog system, and admin dashboard for content management.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "ShadCN UI"],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.dev",
    featured: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2", 
    slug: "e-commerce-dashboard",
    title: "E-commerce Analytics Dashboard",
    description:
      "A comprehensive analytics dashboard for e-commerce businesses built with React and D3.js. Features real-time sales tracking, customer analytics, inventory management, and detailed reporting with interactive charts and graphs.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    techStack: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL", "Recharts"],
    githubUrl: "https://github.com/yourusername/ecommerce-dashboard",
    liveUrl: "https://dashboard-demo.vercel.app",
    featured: true,
    createdAt: "2024-12-15T00:00:00.000Z",
  },
  {
    id: "3",
    slug: "task-management-app",
    title: "Task Management Application",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, drag-and-drop kanban boards, and progress tracking. Built with modern web technologies for optimal performance.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop", 
    techStack: ["Vue.js", "Nuxt.js", "Firebase", "Vuetify", "Socket.io"],
    githubUrl: "https://github.com/yourusername/task-manager",
    liveUrl: "https://taskmanager-demo.netlify.app",
    featured: false,
    createdAt: "2024-11-20T00:00:00.000Z",
  },
  {
    id: "4",
    slug: "weather-forecast-app",
    title: "Weather Forecast Application",
    description:
      "A beautiful weather application that provides detailed forecasts, weather maps, and location-based alerts. Features responsive design, offline support, and integration with multiple weather APIs for accurate data.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
    techStack: ["React Native", "Expo", "Redux", "Weather API", "MapBox"],
    githubUrl: "https://github.com/yourusername/weather-app",
    liveUrl: "https://weather-forecast-demo.herokuapp.com",
    featured: false,
    createdAt: "2024-10-10T00:00:00.000Z",
  },
  {
    id: "5",
    slug: "ai-chatbot-assistant",
    title: "AI-Powered Chatbot Assistant",
    description:
      "An intelligent chatbot assistant powered by machine learning algorithms. Features natural language processing, context awareness, multi-language support, and seamless integration with various platforms and APIs.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
    techStack: ["Python", "TensorFlow", "FastAPI", "React", "Docker", "OpenAI API"],
    githubUrl: "https://github.com/yourusername/ai-chatbot",
    liveUrl: "https://chatbot-demo.fly.dev",
    featured: true,
    createdAt: "2024-09-05T00:00:00.000Z",
  }
];
