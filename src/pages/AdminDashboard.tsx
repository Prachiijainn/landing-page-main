import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Eye, GitBranch, ExternalLink, Calendar, User, Mail, Loader2, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { projectService, type Project } from "@/services/projectService";

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const { toast } = useToast();

  // Load all projects and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [allProjects, projectStats] = await Promise.all([
          projectService.getAllProjects(),
          projectService.getProjectStats()
        ]);
        setProjects(allProjects);
        setStats(projectStats);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleApprove = async (projectId: string) => {
    try {
      const result = await projectService.approveProject(projectId);
      if (result.success) {
        setProjects(prev =>
          prev.map(project =>
            project.id === projectId
              ? { ...project, status: 'approved' as const }
              : project
          )
        );
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Error",
        description: "Failed to approve project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (projectId: string) => {
    try {
      const result = await projectService.rejectProject(projectId);
      if (result.success) {
        setProjects(prev =>
          prev.map(project =>
            project.id === projectId
              ? { ...project, status: 'rejected' as const }
              : project
          )
        );
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          rejected: prev.rejected + 1
        }));
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Error",
        description: "Failed to reject project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await projectService.deleteProject(projectId);
      if (result.success) {
        const deletedProject = projects.find(p => p.id === projectId);
        setProjects(prev => prev.filter(project => project.id !== projectId));

        // Update stats
        if (deletedProject) {
          setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            [deletedProject.status]: prev[deletedProject.status] - 1
          }));
        }

        toast({
          title: "Success",
          description: result.message,
        });

        // Close modal if the deleted project was selected
        if (selectedProject?.id === projectId) {
          setSelectedProject(null);
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 flex-1 min-w-0">{project.title}</CardTitle>
          <Badge className={`${getStatusColor(project.status)} flex-shrink-0`}>
            {project.status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-600 space-x-4 flex-wrap gap-2">
          <div className="flex items-center min-w-0">
            <User className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{project.author}</span>
          </div>
          <div className="flex items-center flex-shrink-0">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="flex flex-wrap gap-2 mt-auto">
          <Button
            variant="community"
            size="sm"
            onClick={() => setSelectedProject(project)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>

          {project.status === 'pending' && (
            <>
              <Button
                variant="community"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleApprove(project.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="community"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReject(project.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {/* Delete button - available for all projects */}
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(project.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const approvedProjects = projects.filter(p => p.status === 'approved');
  const rejectedProjects = projects.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage and review community project submissions</p>
            </div>

            {/* Stats Cards */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-tech-neo-blue" />
                <span className="ml-2 text-gray-600">Loading dashboard...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
                  <Card>
                    <CardContent className="p-6 bg-white">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-sm text-gray-600">Pending Review</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 bg-white">
                      <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 bg-white">
                      <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 bg-white">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-gray-600">Total Projects</div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Projects Tabs */}
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 data-[state=active]:shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Pending ({pendingProjects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 data-[state=active]:shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Approved ({approvedProjects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 data-[state=active]:shadow-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Rejected ({rejectedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {pendingProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                {pendingProjects.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">No pending projects to review</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {approvedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                {approvedProjects.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">No approved projects yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {rejectedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                {rejectedProjects.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">No rejected projects</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold break-words pr-4 flex-1">{selectedProject.title}</h2>
                <Button variant="ghost" onClick={() => setSelectedProject(null)} className="flex-shrink-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {selectedProject.image_url && (
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 break-words whitespace-pre-wrap">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold mb-2">Author</h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedProject.author}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate text-sm">{selectedProject.author_email}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Submitted</h3>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(selectedProject.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedProject.github_url && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <GitBranch className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {selectedProject.live_url && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {selectedProject.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleApprove(selectedProject.id);
                          setSelectedProject(null);
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve Project
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => {
                          handleReject(selectedProject.id);
                          setSelectedProject(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject Project
                      </Button>
                    </>
                  )}

                  {/* Delete button - always available */}
                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleDelete(selectedProject.id);
                      // Modal will close automatically in handleDelete if project is deleted
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;