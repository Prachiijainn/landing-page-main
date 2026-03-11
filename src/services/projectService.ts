import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
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
  private get collection() {
    return collection(db, 'projects');
  }

  // Get all approved projects for public display
  async getApprovedProjects(): Promise<Project[]> {
    try {
      const q = query(
        this.collection,
        where('status', '==', 'approved'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Error fetching approved projects:', error);
      return [];
    }
  }

  // Get all projects (admin only)
  async getAllProjects(): Promise<Project[]> {
    try {
      const q = query(this.collection, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
  }

  // Submit a new project
  async submitProject(projectData: ProjectSubmission): Promise<{ success: boolean; message: string }> {
    try {
      await addDoc(this.collection, {
        ...projectData,
        github_url: projectData.github_url || null,
        live_url: projectData.live_url || null,
        image_url: projectData.image_url || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        likes_count: 0
      });

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
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        console.error('Project not found for approval:', projectId);
        return {
          success: false,
          message: 'Failed to find project'
        };
      }

      const projectData = projectSnap.data();

      // Update project status
      await updateDoc(projectRef, {
        status: 'approved',
        updated_at: serverTimestamp()
      });

      // Show toast notification for project approval
      toastNotificationService.showProjectApproval(projectData.title);

      // Send email notification
      await emailService.sendProjectApprovalEmail(
        projectData.author_email,
        projectData.title,
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
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        console.error('Project not found for rejection:', projectId);
        return {
          success: false,
          message: 'Failed to find project'
        };
      }

      const projectData = projectSnap.data();

      // Update project status
      await updateDoc(projectRef, {
        status: 'rejected',
        updated_at: serverTimestamp()
      });

      // Show toast notification for project rejection
      toastNotificationService.showProjectRejection(projectData.title);

      // Send email notification
      await emailService.sendProjectRejectionEmail(
        projectData.author_email,
        projectData.title,
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
    try {
      const q = query(
        this.collection,
        where('status', '==', status),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error(`Error fetching ${status} projects:`, error);
      return [];
    }
  }

  // Delete a project (admin only)
  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(db, 'projects', projectId));

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
    try {
      const querySnapshot = await getDocs(this.collection);

      const stats = querySnapshot.docs.reduce(
        (acc: any, doc: any) => {
          const project = doc.data();
          acc.total++;
          if (acc[project.status] !== undefined) {
            acc[project.status]++;
          }
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
