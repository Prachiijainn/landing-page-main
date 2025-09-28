import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import eventsImage from "@/assets/community-events.jpg";

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: " 5 hours LIVE Hackathon",
      date: "October 4, 2025",
      time: "10:00 AM - 15:00 PM",
      location: "Discord",
      attendees: 0,
      type: "Hackathon",
      description: "Develop essential coding skills and learn how to inspire others with your ideas."
    }
  ];

  return (
    <section id="events" className="py-20 bg-tech-soft-steel">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tech-midnight-ink mb-6">
              Events & Updates
            </h2>
            <p className="text-xl text-tech-graphite max-w-3xl mx-auto leading-relaxed">
              Stay connected with our community through regular events, workshops, and gatherings 
              designed to foster growth, learning, and meaningful connections.
            </p>
          </div>

          {/* Featured Event */}

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/Hackathon.png" 
                  alt="Community events and workshops" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tech-neo-blue/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  {/* <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-tech-midnight-ink mb-1">Next Event</h4>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="text-tech-midnight-ink">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">NaedeX Represents</h1>
              <p className="text-lg font-semibold text-tech-graphite leading-relaxed">
                Innovation and creativity! <br />
                Join our 5-hour LIVE Hackathon on Oct 4, 2025 (10 AM – 3 PM), right from Discord. Build, innovate, and compete with your team of 4.<br /><br />

                Themes: Open Innovation · Smart Campus · Sustainability · Digital Well-Being · Fun & Games<br /><br />

                Only 12 slots | ₹40 per team
              </p>
              <p className="font-bold text-lg">Register now</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Upcoming Events
            </h3>
            <div className="grid md:grid-cols-1">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-tech-neo-blue/20 hover:border-tech-cyber-teal/40 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-tech-neo-blue bg-tech-neo-blue/10 px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-tech-midnight-ink line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-tech-graphite">
                        <Calendar className="w-4 h-4 mr-2 text-tech-neo-blue" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-tech-graphite">
                        <Clock className="w-4 h-4 mr-2 text-tech-neo-blue" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-tech-graphite">
                        <MapPin className="w-4 h-4 mr-2 text-tech-neo-blue" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-tech-graphite mb-4 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    <a 
                      href="https://forms.gle/VNjAxxM9ajkLJTpp9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-tech-neo-blue text-white w-full group-hover:bg-tech-neo-blue group-hover:text-white group-hover:border-tech-neo-blue"
                      >
                        Register Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;