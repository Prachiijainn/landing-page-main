import { supabase, hasValidSupabaseConfig } from '@/lib/supabase';
import { mockProjectService } from './mockProjectService';
import { emailService } from './emailService';
import { toastNotificationService } from './toastNotificationService';

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

class ProjectService {
  // Get all approved projects for public display
  async getApprovedProjects(): Promise<Project[]> {
    if (!hasValidSupabaseConfig) {
      console.log('🔄 Using mock data - configure Supabase for real functionality');
      return mockProjectService.getApprovedProjects();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved projects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getApprovedProjects:', error);
      return [];
    }
  }

  // Get all projects (admin only)
  async getAllProjects(): Promise<Project[]> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.getAllProjects();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all projects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      return [];
    }
  }

  // Submit a new project
  async submitProject(projectData: ProjectSubmission): Promise<{ success: boolean; message: string }> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.submitProject(projectData);
    }

    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          author: projectData.author,
          author_email: projectData.author_email,
          technologies: projectData.technologies,
          github_url: projectData.github_url || null,
          live_url: projectData.live_url || null,
          image_url: projectData.image_url || null,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting project:', error);
        return {
          success: false,
          message: 'Failed to submit project. Please try again.'
        };
      }

      return {
        success: true,
        message: 'Project submitted successfully! It will be reviewed by our team.'
      };
    } catch (error) {
      console.error('Error in submitProject:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  // Approve a project (admin only)
  async approveProject(projectId: string): Promise<{ success: boolean; message: string }> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.approveProject(projectId);
    }

    try {
      // First get the project details to send notification
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('title, author_email')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        console.error('Error fetching project for notification:', fetchError);
        return {
          success: false,
          message: 'Failed to approve project'
        };
      }

      // Update project status
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('Error approving project:', error);
        return {
          success: false,
          message: 'Failed to approve project'
        };
      }

      // Show toast notification for project approval
      toastNotificationService.showProjectApproval(project.title);

      // Send email notification
      await emailService.sendProjectApprovalEmail(
        project.author_email,
        project.title,
        projectId
      );

      return {
        success: true,
        message: 'Project approved successfully!'
      };
    } catch (error) {
      console.error('Error in approveProject:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  // Reject a project (admin only)
  async rejectProject(projectId: string): Promise<{ success: boolean; message: string }> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.rejectProject(projectId);
    }

    try {
      // First get the project details to send notification
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('title, author_email')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        console.error('Error fetching project for notification:', fetchError);
        return {
          success: false,
          message: 'Failed to reject project'
        };
      }

      // Update project status
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('Error rejecting project:', error);
        return {
          success: false,
          message: 'Failed to reject project'
        };
      }

      // Show toast notification for project rejection
      toastNotificationService.showProjectRejection(project.title);

      // Send email notification
      await emailService.sendProjectRejectionEmail(
        project.author_email,
        project.title,
        projectId
      );

      return {
        success: true,
        message: 'Project rejected'
      };
    } catch (error) {
      console.error('Error in rejectProject:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  // Get projects by status
  async getProjectsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Project[]> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.getProjectsByStatus(status);
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ${status} projects:`, error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProjectsByStatus:', error);
      return [];
    }
  }

  // Delete a project (admin only)
  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.deleteProject(projectId);
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return {
          success: false,
          message: 'Failed to delete project'
        };
      }

      return {
        success: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  // Get project statistics (admin only)
  async getProjectStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    if (!hasValidSupabaseConfig) {
      return mockProjectService.getProjectStats();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status');

      if (error) {
        console.error('Error fetching project stats:', error);
        return { total: 0, pending: 0, approved: 0, rejected: 0 };
      }

      const stats = data.reduce(
        (acc, project) => {
          acc.total++;
          acc[project.status]++;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 }
      );

      return stats;
    } catch (error) {
      console.error('Error in getProjectStats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
}

// Export a singleton instance
export const projectService = new ProjectService();