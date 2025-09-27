import { useState } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@community.org",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "(555) 123-4567",
      description: "Available Monday-Friday, 9 AM - 5 PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Community St, Cityville, ST 12345",
      description: "Open for visits by appointment"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon-Fri: 9AM-5PM",
      description: "Weekend support available via email"
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-700" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please complete all required fields",
        description: "We need your name, email, and message to assist you.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent successfully! 📧",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-tech-soft-steel">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tech-midnight-ink mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-tech-graphite max-w-3xl mx-auto leading-relaxed">
              Have questions, ideas, or want to learn more about getting involved? 
              We'd love to hear from you and help you find your place in our community.
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-tech-neo-blue/20 hover:border-tech-cyber-teal/40 bg-white">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-tech-neo-blue/10 rounded-full flex items-center justify-center">
                    <info.icon className="w-8 h-8 text-tech-neo-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-tech-midnight-ink mb-2">{info.title}</h3>
                  <p className="text-tech-neo-blue font-medium mb-2">{info.details}</p>
                  <p className="text-sm text-tech-graphite">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white border-tech-neo-blue/20">
              <CardHeader>
                <CardTitle className="text-2xl text-tech-midnight-ink flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-tech-neo-blue" />
                  Send Us a Message
                </CardTitle>
                <p className="text-tech-graphite">
                  Whether you have questions, want to collaborate, or need support, 
                  we're here to help. Fill out the form below and we'll get back to you promptly.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how we can help you or share your thoughts..."
                      rows={5}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="community" size="lg" className="w-full">
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* FAQ Section */}
              <Card className="bg-community-warm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">How can I get involved?</h4>
                    <p className="text-sm text-muted-foreground">
                      There are many ways to get involved! Start by joining our newsletter, 
                      attending an event, or volunteering for one of our programs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Do you accept donations?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we welcome donations of all sizes. Every contribution helps us 
                      expand our programs and reach more people in need.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Can organizations partner with you?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely! We're always looking for like-minded organizations to 
                      collaborate with. Contact us to discuss partnership opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Connect With Us</CardTitle>
                  <p className="text-muted-foreground">
                    Follow us on social media for daily inspiration, community updates, and behind-the-scenes content.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 hover:bg-primary/20 ${social.color}`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>💡 Pro Tip:</strong> Follow us on social media for daily inspiration, 
                      event updates, and to see the amazing impact our community is making every day!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Need Immediate Support?</h3>
                  <p className="mb-6 text-white/90">
                    For urgent matters or if you need immediate assistance, 
                    don't hesitate to reach out directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Call Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white text-white hover:bg-white/10"
                    >
                      Emergency Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;