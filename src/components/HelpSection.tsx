import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart, Share2, DollarSign, Users, Calendar, MessageCircle } from "lucide-react";
import supportImage from "@/assets/community-support.jpg";

const HelpSection = () => {
  const helpOptions = [
    {
      icon: HandHeart,
      title: "Volunteer Your Time",
      description: "Join our volunteer programs and directly impact lives in your community. From mentoring to event organizing, there's a place for everyone.",
      cta: "Start Volunteering",
      color: "primary"
    },
    {
      icon: DollarSign,
      title: "Make a Donation",
      description: "Support our initiatives with financial contributions that help us expand our reach and deepen our impact in communities.",
      cta: "Donate Now",
      color: "secondary"
    },
    {
      icon: Users,
      title: "Become a Partner",
      description: "Whether you're a business, organization, or community leader, let's collaborate to create meaningful change together.",
      cta: "Partner With Us",
      color: "accent"
    },
    {
      icon: Share2,
      title: "Spread Awareness",
      description: "Share our mission with your network and help us reach more people who want to make a difference in their communities.",
      cta: "Share Our Story",
      color: "primary"
    },
    {
      icon: Calendar,
      title: "Attend Events",
      description: "Join our workshops, community gatherings, and special events to learn, connect, and contribute to our collective growth.",
      cta: "View Events",
      color: "secondary"
    },
    {
      icon: MessageCircle,
      title: "Join Discussions",
      description: "Participate in our online forums and community discussions to share ideas, insights, and support fellow members.",
      cta: "Join Forums",
      color: "accent"
    }
  ];

  return (
    <section id="help" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How You Can Help
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every contribution matters, no matter how big or small. Here are meaningful ways 
              you can join our mission and make a lasting impact in your community.
            </p>
          </div>

          {/* Featured Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Together We Achieve More
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Your unique skills, perspective, and passion are exactly what our community needs. 
                Whether you have five minutes or five hours, there's a meaningful way for you to contribute.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join thousands of others who have discovered the joy of giving back and being part 
                of a movement that's creating positive change one community at a time.
              </p>
              <Button variant="community" size="lg" className="group">
                Get Started Today
                <HandHeart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={supportImage} 
                  alt="Community members helping each other" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Help Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpOptions.map((option, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-card">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    option.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary/20' :
                    option.color === 'secondary' ? 'bg-secondary/10 group-hover:bg-secondary/20' :
                    'bg-accent/10 group-hover:bg-accent/20'
                  }`}>
                    <option.icon className={`w-8 h-8 ${
                      option.color === 'primary' ? 'text-primary' :
                      option.color === 'secondary' ? 'text-secondary' :
                      'text-accent'
                    }`} />
                  </div>
                  <CardTitle className="text-xl text-foreground">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  <Button 
                    variant={option.color === 'primary' ? 'default' : option.color === 'secondary' ? 'secondary' : 'outline'}
                    size="sm" 
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    {option.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-community-warm to-accent-light rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your journey with us starts with a single step. Let's work together to build 
                stronger, more connected communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="community" size="lg">
                  Join Our Community
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;