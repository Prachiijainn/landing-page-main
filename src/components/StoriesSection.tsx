import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, Star, Heart } from "lucide-react";

const StoriesSection = () => {
  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Community Volunteer",
      story: "Joining this community has been life-changing. I've found my passion for helping others and made friendships that will last a lifetime. The support and encouragement I've received here has helped me grow in ways I never imagined.",
      impact: "Led 3 successful food drives",
      rating: 5
    },
    {
      name: "David Chen", 
      role: "Workshop Participant",
      story: "The leadership workshops transformed how I approach challenges both in my personal and professional life. The skills I learned here have made me a better father, colleague, and community member. I'm grateful for this incredible journey.",
      impact: "Now mentors 5 young professionals",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Community Partner",
      story: "As a local business owner, partnering with this community has been one of the best decisions I've made. Together, we've created programs that have genuinely improved lives in our neighborhood. The collaboration and shared vision is inspiring.",
      impact: "Created 12 job opportunities",
      rating: 5
    },
    {
      name: "James Thompson",
      role: "Youth Mentor",
      story: "Working with young people in our mentorship program has reminded me why community matters. Seeing their growth and potential unfold has been incredibly rewarding. This community has given me purpose and direction.",
      impact: "Mentored 8 young adults",
      rating: 5
    },
    {
      name: "Lisa Wang",
      role: "Event Organizer",
      story: "I started as a shy newcomer and now I'm organizing events for hundreds of people. This community believed in me before I believed in myself. The encouragement and opportunities I've received here have been transformational.",
      impact: "Organized 15+ community events",
      rating: 5
    },
    {
      name: "Robert Johnson",
      role: "Donor & Advocate",
      story: "Seeing the direct impact of our collective efforts has been incredibly fulfilling. Every dollar donated, every hour volunteered, and every story shared creates ripples of positive change that extend far beyond what we can see.",
      impact: "Supported 50+ families",
      rating: 5
    }
  ];

  const impactStats = [
    { number: "500+", label: "Lives Touched" },
    { number: "120", label: "Active Volunteers" },
    { number: "25", label: "Local Partnerships" },
    { number: "95%", label: "Member Satisfaction" }
  ];

  return (
    <section id="stories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Community Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real stories from real people whose lives have been transformed through community connection, 
              support, and shared purpose. These are the voices that inspire us to keep growing.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</span>
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-card relative">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-current" />
                    ))}
                  </div>

                  {/* Story */}
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    "{testimonial.story}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center text-xs text-primary font-medium">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {testimonial.impact}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Story */}
          <div className="bg-gradient-to-r from-community-warm to-accent-light rounded-2xl p-8 md:p-12 text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                "This Community Changed My Life"
              </h3>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                "I came here feeling lost and disconnected. Through the mentorship program, volunteer opportunities, 
                and the incredible people I've met, I've not only found my purpose but discovered strengths I never 
                knew I had. This isn't just a community—it's a family that helps you become the best version of yourself."
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">A</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">Alex Rivera</h4>
                  <p className="text-muted-foreground">Community Ambassador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Write Your Story?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community and discover the impact you can make. Your unique perspective 
              and experiences are exactly what we need to grow stronger together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="community" size="lg">
                Share Your Story
              </Button>
              <Button variant="outline" size="lg">
                Read More Stories
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;