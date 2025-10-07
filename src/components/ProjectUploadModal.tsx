import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { validateImageFile, compressImage, generateImagePreview } from "@/utils/imageUtils";

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: {
    title: string;
    description: string;
    author: string;
    author_email: string;
    technologies: string[];
    github_url?: string;
    live_url?: string;
    image_url?: string;
  }) => void;
}

const ProjectUploadModal = ({ isOpen, onClose, onSubmit }: ProjectUploadModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    author_email: "",
    github_url: "",
    live_url: "",
    image_url: ""
  });
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies(prev => [...prev, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(prev => prev.filter(t => t !== tech));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedImage(file);
    
    try {
      // Generate preview
      const preview = await generateImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      console.error('Error generating image preview:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImageForUpload = async (file: File): Promise<string> => {
    try {
      // Compress image for better performance
      const compressedImage = await compressImage(file, 800, 0.8);
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Fallback to original file as base64
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setSelectedImage(imageFile);
      
      try {
        const preview = await generateImagePreview(imageFile);
        setImagePreview(preview);
      } catch (error) {
        console.error('Error generating image preview:', error);
        alert('Error processing image. Please try again.');
      }
    } else {
      alert('Please drop an image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.author || !formData.author_email) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if image is provided (either uploaded file or URL)
    if (!selectedImage && !formData.image_url.trim()) {
      alert("Please upload an image or provide an image URL for your project");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;
      
      // Process uploaded image if present
      if (selectedImage) {
        imageUrl = await processImageForUpload(selectedImage);
      }

      await onSubmit({
        ...formData,
        technologies,
        github_url: formData.github_url || undefined,
        live_url: formData.live_url || undefined,
        image_url: imageUrl || undefined
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        author: "",
        author_email: "",
        github_url: "",
        live_url: "",
        image_url: ""
      });
      setTechnologies([]);
      setNewTech("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Error submitting project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-tech-midnight-ink">
            Submit Your Project
          </DialogTitle>
          <p className="text-tech-graphite">
            Share your project with the community. It will be reviewed before being published.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Project Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your project title"
                className="text-tech-midnight-ink font-medium"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your project, its features, and what makes it special"
                className="text-tech-midnight-ink font-medium"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Author Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author" className="text-sm font-medium">
                Your Name *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Your full name"
                className="text-tech-midnight-ink font-medium"
                required
              />
            </div>

            <div>
              <Label htmlFor="author_email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="author_email"
                type="email"
                value={formData.author_email}
                onChange={(e) => handleInputChange("author_email", e.target.value)}
                placeholder="your.email@example.com"
                className="text-tech-midnight-ink font-medium"
                required
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Label className="text-sm font-medium">Technologies Used</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add a technology (e.g., React, Node.js)"
                className="text-tech-midnight-ink font-medium"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeTechnology(tech)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url" className="text-sm font-medium">
                GitHub URL
              </Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => handleInputChange("github_url", e.target.value)}
                placeholder="https://github.com/username/project"
                className="text-tech-midnight-ink font-medium"
              />
            </div>

            <div>
              <Label htmlFor="live_url" className="text-sm font-medium">
                Live Demo URL
              </Label>
              <Input
                id="live_url"
                value={formData.live_url}
                onChange={(e) => handleInputChange("live_url", e.target.value)}
                placeholder="https://your-project.com"
                className="text-tech-midnight-ink font-medium"
              />
            </div>
          </div>

          {/* Project Image Upload */}
          <div>
            <Label className="text-sm font-medium">
              Project Image *
            </Label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Project preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Upload Area */}
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-tech-neo-blue bg-tech-neo-blue/5' 
                    : 'border-gray-300 hover:border-tech-neo-blue/50'
                }`}
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-tech-graphite mb-2">
                  <strong>Required:</strong> Drag and drop an image here, or click to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedImage ? 'Change Image' : 'Choose Image'}
                </Button>
                <p className="text-xs text-gray-500">
                  Max 5MB • JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Alternative: Image URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-tech-graphite">or paste image URL</span>
                </div>
              </div>
              
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                className="text-tech-midnight-ink font-medium"
              />
            </div>
            
            <p className="text-xs text-tech-graphite mt-2">
              <strong>Required:</strong> Please upload a screenshot or demo image of your project. Images are automatically compressed for optimal performance.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-tech-neo-blue hover:bg-tech-neo-blue/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-4 bg-tech-soft-steel rounded-lg">
          <p className="text-sm text-tech-graphite">
            <strong>Note:</strong> Your project will be reviewed by our team before being published.
            You'll receive an email notification once it's approved or if we need any changes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectUploadModal;