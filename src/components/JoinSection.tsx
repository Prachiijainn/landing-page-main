import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, Mail, UserPlus, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JoinSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    interests: "",
    involvement: "",
    newsletter: true,
    updates: true,
    events: true
  });

  const { toast } = useToast();

  const membershipLevels = [
    {
      icon: Mail,
      title: "Newsletter Subscriber",
      description: "Stay updated with our community news, upcoming events, and inspiring stories.",
      benefits: ["Monthly newsletter", "Event announcements", "Community updates"],
      cta: "Subscribe Free"
    },
    {
      icon: Users,
      title: "Community Member",
      description: "Join our active community with full access to discussions, resources, and networking.",
      benefits: ["Access to member forums", "Resource library", "Networking opportunities", "Priority event registration"],
      cta: "Become a Member"
    },
    {
      icon: UserPlus,
      title: "Active Volunteer",
      description: "Take an active role in our mission by volunteering your time and skills to help others.",
      benefits: ["Volunteer opportunities", "Training programs", "Recognition events", "Direct impact on community"],
      cta: "Start Volunteering"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Please complete all required fields",
        description: "We need your name and email to get started.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Welcome to our community! 🎉",
      description: "Thank you for joining us. You'll receive a welcome email shortly with next steps.",
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      interests: "",
      involvement: "",
      newsletter: true,
      updates: true,
      events: true
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="join" className="py-20 bg-community-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Take the first step towards making a meaningful impact. Choose how you'd like to be involved 
              and become part of a community that's changing lives every day.
            </p>
          </div>

          {/* Membership Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {membershipLevels.map((level, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-card relative">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <level.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{level.title}</CardTitle>
                  <p className="text-muted-foreground leading-relaxed">{level.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {level.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    {level.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Get Started Today</CardTitle>
                <p className="text-muted-foreground">
                  Fill out this form to join our community and we'll help you find the perfect way to get involved.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label htmlFor="interests">What interests you most about our community?</Label>
                    <Textarea
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      placeholder="Share what drew you to us and what you hope to gain from being part of our community..."
                      rows={3}
                    />
                  </div>

                  {/* Involvement Level */}
                  <div className="space-y-3">
                    <Label>How would you like to get involved?</Label>
                    <RadioGroup
                      value={formData.involvement}
                      onValueChange={(value) => handleInputChange('involvement', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="newsletter" id="newsletter-only" />
                        <Label htmlFor="newsletter-only" className="text-sm">Newsletter subscriber (stay informed)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="member" id="member" />
                        <Label htmlFor="member" className="text-sm">Active member (participate in discussions)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="volunteer" id="volunteer" />
                        <Label htmlFor="volunteer" className="text-sm">Volunteer (hands-on involvement)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partner" id="partner" />
                        <Label htmlFor="partner" className="text-sm">Potential partner (collaboration opportunities)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Communication Preferences */}
                  <div className="space-y-3">
                    <Label>Communication Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="newsletter-pref"
                          checked={formData.newsletter}
                          onCheckedChange={(checked) => handleInputChange('newsletter', !!checked)}
                        />
                        <Label htmlFor="newsletter-pref" className="text-sm">Monthly newsletter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="updates-pref"
                          checked={formData.updates}
                          onCheckedChange={(checked) => handleInputChange('updates', !!checked)}
                        />
                        <Label htmlFor="updates-pref" className="text-sm">Community updates and news</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="events-pref"
                          checked={formData.events}
                          onCheckedChange={(checked) => handleInputChange('events', !!checked)}
                        />
                        <Label htmlFor="events-pref" className="text-sm">Event announcements</Label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="community" size="lg" className="w-full">
                    Join Our Community
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">What You'll Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Immediate access to our welcome resources and community guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Personal onboarding call with a community coordinator</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Connection with other members who share your interests</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Invitations to members-only events and workshops</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Questions?</h3>
                  <p className="text-muted-foreground mb-4">
                    We're here to help you find the perfect way to get involved in our community.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Schedule a Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;