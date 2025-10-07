// Mock service for when Supabase is not configured
export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  author_email: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  likes_count?: number;
}

export interface ProjectSubmission {
  title: string;
  description: string;
  author: string;
  author_email: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}

class MockProjectService {
  private projects: Project[] = [
    {
      id: "1",
      title: "Task Management App",
      description: "A modern task management application built with React and TypeScript. Features include drag-and-drop functionality, real-time updates, and team collaboration.",
      author: "John Doe",
      author_email: "john@example.com",
      technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
      github_url: "https://github.com/johndoe/task-app",
      live_url: "https://task-app-demo.com",
      image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      created_at: "2024-10-01",
      status: "approved",
      likes_count: 24
    },
    {
      id: "2",
      title: "Weather Dashboard",
      description: "A responsive weather dashboard that provides real-time weather information with beautiful visualizations and forecasts.",
      author: "Jane Smith",
      author_email: "jane@example.com",
      technologies: ["Vue.js", "JavaScript", "Chart.js", "OpenWeather API"],
      github_url: "https://github.com/janesmith/weather-dashboard",
      live_url: "https://weather-dash.com",
      image_url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      created_at: "2024-09-28",
      status: "approved",
      likes_count: 18
    },
    {
      id: "3",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
      author: "Mike Johnson",
      author_email: "mike@example.com",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
      github_url: "https://github.com/mikejohnson/ecommerce",
      image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      created_at: "2024-09-25",
      status: "approved",
      likes_count: 31
    },
    {
      id: "4",
      title: "AI Chat Application",
      description: "A real-time chat application powered by AI with natural language processing capabilities. Features include smart replies, sentiment analysis, and multi-language support.",
      author: "Alice Johnson",
      author_email: "alice@example.com",
      technologies: ["React", "Node.js", "OpenAI API", "Socket.io", "MongoDB"],
      github_url: "https://github.com/alice/ai-chat",
      live_url: "https://ai-chat-demo.com",
      image_url: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=250&fit=crop",
      created_at: "2024-10-05",
      status: "pending",
      likes_count: 7
    }
  ];

  async getApprovedProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.projects.filter(project => project.status === 'approved'));
      }, 500);
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.projects]);
      }, 500);
    });
  }

  async submitProject(projectData: ProjectSubmission): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject: Project = {
          id: Date.now().toString(),
          ...projectData,
          created_at: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        
        this.projects.push(newProject);
        
        resolve({
          success: true,
          message: 'Project submitted successfully! (Mock mode - set up Supabase for real functionality)'
        });
      }, 1000);
    });
  }

  async approveProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex].status = 'approved';
          console.log('🎉 Mock: Project approved:', this.projects[projectIndex].title);
          console.log('📧 Mock: Notification sent to:', this.projects[projectIndex].author_email);
          resolve({
            success: true,
            message: 'Project approved successfully! (Mock mode)'
          });
        } else {
          resolve({
            success: false,
            message: 'Project not found'
          });
        }
      }, 500);
    });
  }

  async rejectProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex].status = 'rejected';
          console.log('📝 Mock: Project rejected:', this.projects[projectIndex].title);
          console.log('📧 Mock: Notification sent to:', this.projects[projectIndex].author_email);
          resolve({
            success: true,
            message: 'Project rejected (Mock mode)'
          });
        } else {
          resolve({
            success: false,
            message: 'Project not found'
          });
        }
      }, 500);
    });
  }

  async getProjectsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.projects.filter(project => project.status === status));
      }, 500);
    });
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects.splice(projectIndex, 1);
          resolve({
            success: true,
            message: 'Project deleted successfully (Mock mode)'
          });
        } else {
          resolve({
            success: false,
            message: 'Project not found'
          });
        }
      }, 500);
    });
  }

  async getProjectStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = this.projects.reduce(
          (acc, project) => {
            acc.total++;
            acc[project.status]++;
            return acc;
          },
          { total: 0, pending: 0, approved: 0, rejected: 0 }
        );
        resolve(stats);
      }, 500);
    });
  }
}

export const mockProjectService = new MockProjectService();