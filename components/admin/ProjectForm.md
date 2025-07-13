# ProjectForm Component

A comprehensive, reusable project form component built with ShadCN UI components.

## Features

- ✨ **Modern Design**: Built with ShadCN UI components and premium styling
- 🎯 **Type Safe**: Full TypeScript support with proper interfaces
- 🔥 **Validation**: Built-in form validation with error handling
- 📱 **Responsive**: Mobile-first responsive design
- 🎨 **Card Layout**: Organized sections with card-based UI
- 🖼️ **Image Upload**: Integrated image picker with preview
- 🏷️ **Tech Stack Tags**: Visual tech stack representation with badges
- 🔗 **URL Validation**: Proper URL validation for GitHub and live demo links
- ⚡ **Loading States**: Built-in loading states and form submission handling

## Props

```typescript
interface ProjectFormProps {
  project?: Project | null; // Project to edit (optional)
  onSubmit?: (data: ProjectFormData) => Promise<void>; // Form submission handler
  onCancel?: () => void; // Cancel button handler
  isSubmitting?: boolean; // Loading state
  className?: string; // Additional CSS classes
  showActions?: boolean; // Show/hide action buttons
}
```

## Usage Examples

### 1. Basic Usage (Create New Project)

```tsx
import ProjectForm from "@/components/admin/ProjectForm";

function CreateProjectPage() {
  const handleSubmit = async (projectData) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      // Handle success
    }
  };

  return <ProjectForm onSubmit={handleSubmit} onCancel={() => router.back()} />;
}
```

### 2. Edit Existing Project

```tsx
import ProjectForm from "@/components/admin/ProjectForm";

function EditProjectPage({ project }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (projectData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Handle success
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectForm
      project={project}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
```

### 3. In Modal (as used in ProjectFormModal)

```tsx
import ProjectForm from "./ProjectForm";

function ProjectFormModal({ project, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Custom Styling

```tsx
<ProjectForm
  className="max-w-4xl mx-auto"
  showActions={false} // Hide default actions
  onSubmit={handleSubmit}
>
  {/* Custom action buttons */}
  <div className="flex justify-center gap-4 mt-8">
    <Button variant="outline" onClick={handleCancel}>
      Cancel
    </Button>
    <Button type="submit" onClick={handleSubmit}>
      Save Project
    </Button>
  </div>
</ProjectForm>
```

## Form Data Structure

```typescript
interface ProjectFormData {
  title: string; // Project title (required)
  description: string; // Project description (required)
  image: string; // Image URL
  tech_stack: string[]; // Array of technologies
  github_url: string; // GitHub repository URL
  live_url: string; // Live demo URL
  featured: boolean; // Featured project flag
  published: boolean; // Published status
}
```

## Form Sections

### 1. Project Status

- **Featured Toggle**: Mark project as featured
- **Published Toggle**: Control project visibility

### 2. Project Information

- **Title**: Required project title
- **Description**: Required project description
- **Tech Stack**: Comma-separated technologies with visual badges

### 3. Project Links

- **GitHub URL**: Repository link with validation
- **Live Demo URL**: Live site link with validation

### 4. Project Image

- **Image Upload**: Drag & drop or click to upload
- **Preview**: Real-time image preview
- **Recommendations**: Size and format guidelines

## Validation

The form includes built-in validation for:

- Required fields (title, description)
- URL format validation for GitHub and live demo links
- File upload validation
- Real-time error display

## Dependencies

- ShadCN UI components (Button, Input, Textarea, Switch, Label, Card, Badge)
- React Hook Form integration ready
- Image upload via ImagePicker component
- Toast notifications via Sonner

## Styling

The component uses:

- Tailwind CSS for styling
- ShadCN design system
- Responsive grid layout
- Premium card-based UI
- Gradient accents and modern styling
