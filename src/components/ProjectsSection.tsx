import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ExternalLink, Calendar, User, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ProjectUploadModal from "@/components/ProjectUploadModal";
import LikeButton from "@/components/LikeButton";
import { projectService, type Project } from "@/services/projectService";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      // Store the current page in localStorage so we can redirect back after login
      localStorage.setItem('redirectAfterLogin', '/projects');
      navigate('/login');
    } else {
      setIsUploadModalOpen(true);
    }
  };

  // Load approved projects from Supabase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const approvedProjects = await projectService.getApprovedProjects();
        setProjects(approvedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const handleProjectSubmit = async (projectData: {
    title: string;
    description: string;
    author: string;
    author_email: string;
    technologies: string[];
    github_url?: string;
    live_url?: string;
    image_url?: string;
  }) => {
    try {
      const result = await projectService.submitProject(projectData);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        setIsUploadModalOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-tech-soft-steel">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tech-midnight-ink mb-6">
              Community Projects
            </h2>
            <p className="text-xl text-tech-graphite max-w-3xl mx-auto leading-relaxed mb-8">
              Discover amazing projects built by our community members. Share your own work and get inspired by others.
            </p>
            <Button
              onClick={handleUploadClick}
              className="bg-tech-neo-blue hover:bg-tech-neo-blue/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAuthenticated ? "Submit Your Project" : "Sign In to Submit Project"}
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-tech-neo-blue" />
              <span className="ml-2 text-tech-graphite">Loading projects...</span>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {projects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-tech-neo-blue/20 hover:border-tech-cyber-teal/40 bg-white overflow-hidden">
                    {project.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                      <CardTitle className="text-lg md:text-xl text-tech-midnight-ink line-clamp-2 mb-2">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center text-xs md:text-sm text-tech-graphite mb-3">
                        <User className="w-4 h-4 mr-1" />
                        {project.author}
                        <Calendar className="w-4 h-4 ml-4 mr-1" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <p className="text-tech-graphite mb-3 md:mb-4 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                        {project.description}
                      </p>

                      {/* Like Button */}
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <LikeButton
                          itemId={project.id}
                          itemType="project"
                          initialCount={project.likes_count || 0}
                          size="sm"
                          variant="ghost"
                        />
                        <div className="text-xs text-tech-graphite">
                          {project.likes_count || 0} {(project.likes_count || 0) === 1 ? 'like' : 'likes'}
                        </div>
                      </div>

                      <div className="flex gap-1 md:gap-2">
                        {project.github_url && (
                          <Button
                            variant="community"
                            size="sm"
                            className="flex-1 text-xs md:text-sm px-2 md:px-3"
                            asChild
                          >
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <GitBranch className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              <span className="hidden sm:inline">GitHub</span>
                              <span className="sm:hidden">Git</span>
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button
                            variant="community"
                            size="sm"
                            className="flex-1 text-white text-xs md:text-sm px-2 md:px-3"
                            asChild
                          >
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 text-white" />
                              Live
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {projects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-tech-graphite text-lg">No projects available yet. Be the first to submit one!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProjectUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleProjectSubmit}
      />
    </section>
  );
};

export default ProjectsSection;