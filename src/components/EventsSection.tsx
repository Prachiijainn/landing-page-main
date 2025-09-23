import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import eventsImage from "@/assets/community-events.jpg";

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "Community Workshop: Leadership Skills",
      date: "Nov 15, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Community Center",
      attendees: 24,
      type: "Workshop",
      description: "Develop essential leadership skills and learn how to inspire positive change in your community."
    },
    {
      title: "Monthly Community Gathering",
      date: "Nov 22, 2024", 
      time: "6:00 PM - 8:00 PM",
      location: "Central Park Pavilion",
      attendees: 85,
      type: "Social",
      description: "Join fellow community members for networking, sharing stories, and building lasting connections."
    },
    {
      title: "Volunteer Training Session",
      date: "Dec 1, 2024",
      time: "10:00 AM - 12:00 PM", 
      location: "Online",
      attendees: 32,
      type: "Training",
      description: "Learn about our volunteer programs and discover how you can make the biggest impact."
    }
  ];

  const pastHighlights = [
    {
      title: "Annual Community Impact Summit",
      description: "200+ attendees celebrated our collective achievements and planned for the future.",
      impact: "3 new partnerships formed"
    },
    {
      title: "Youth Mentorship Launch",
      description: "Successfully launched our youth mentorship program with 50 mentor-mentee pairs.",
      impact: "50 young people enrolled"
    },
    {
      title: "Community Garden Project",
      description: "Transformed an empty lot into a thriving community garden that feeds 30 families.",
      impact: "30 families supported"
    }
  ];

  return (
    <section id="events" className="py-20 bg-community-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Events & Updates
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay connected with our community through regular events, workshops, and gatherings 
              designed to foster growth, learning, and meaningful connections.
            </p>
          </div>

          {/* Featured Event */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={eventsImage} 
                  alt="Community events and workshops" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-1">Next Event</h4>
                    <p className="text-sm text-muted-foreground">Community Workshop: Leadership Skills</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Join Our Upcoming Events
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our events are designed to bring people together, share knowledge, and strengthen 
                our community bonds. Whether you're looking to learn new skills, meet like-minded 
                individuals, or contribute to meaningful projects, there's something for everyone.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                From intimate workshops to large community gatherings, each event is an opportunity 
                to grow, connect, and make a positive impact together.
              </p>
              <Button variant="community" size="lg">
                View All Events
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Upcoming Events
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-foreground line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                      Register Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Highlights */}
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Recent Highlights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {pastHighlights.map((highlight, index) => (
                <Card key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      {highlight.title}
                    </h4>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {highlight.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {highlight.impact}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get the latest updates on upcoming events, community news, and opportunities to get involved.
              </p>
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;