const sampleProjects = [
  {
    title: "Full Stack Portfolio Website",
    description:
      "A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean design, dark mode support, project showcase, blog system, and admin dashboard for content management.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    tech_stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "ShadCN UI",
    ],
    github_url: "https://github.com/yourusername/portfolio",
    live_url: "https://yourportfolio.dev",
    featured: true,
    published: true,
  },
  {
    title: "E-commerce Analytics Dashboard",
    description:
      "A comprehensive analytics dashboard for e-commerce businesses built with React and D3.js. Features real-time sales tracking, customer analytics, inventory management, and detailed reporting with interactive charts and graphs.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    tech_stack: [
      "React",
      "TypeScript",
      "D3.js",
      "Node.js",
      "PostgreSQL",
      "Recharts",
    ],
    github_url: "https://github.com/yourusername/ecommerce-dashboard",
    live_url: "https://dashboard-demo.vercel.app",
    featured: true,
    published: true,
  },
  {
    title: "Task Management Application",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, drag-and-drop kanban boards, and progress tracking. Built with modern web technologies for optimal performance.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    tech_stack: ["Vue.js", "Nuxt.js", "Firebase", "Vuetify", "Socket.io"],
    github_url: "https://github.com/yourusername/task-manager",
    live_url: "https://taskmanager-demo.netlify.app",
    featured: false,
    published: true,
  },
  {
    title: "Weather Forecast Application",
    description:
      "A beautiful weather application that provides detailed forecasts, weather maps, and location-based alerts. Features responsive design, offline support, and integration with multiple weather APIs for accurate data.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
    tech_stack: ["React Native", "Expo", "Redux", "Weather API", "MapBox"],
    github_url: "https://github.com/yourusername/weather-app",
    live_url: "https://weather-forecast-demo.herokuapp.com",
    featured: false,
    published: false,
  },
  {
    title: "AI-Powered Chatbot Assistant",
    description:
      "An intelligent chatbot assistant powered by machine learning algorithms. Features natural language processing, context awareness, multi-language support, and seamless integration with various platforms and APIs.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
    tech_stack: [
      "Python",
      "TensorFlow",
      "FastAPI",
      "React",
      "Docker",
      "OpenAI API",
    ],
    github_url: "https://github.com/yourusername/ai-chatbot",
    live_url: "https://chatbot-demo.fly.dev",
    featured: true,
    published: true,
  },
];

async function createSampleProjects() {
  for (const project of sampleProjects) {
    try {
      const response = await fetch("http://localhost:3002/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created project: ${result.title}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create project "${project.title}":`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating project "${project.title}":`, error);
    }
  }
}

createSampleProjects();
