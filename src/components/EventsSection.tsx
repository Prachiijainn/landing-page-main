import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import eventsImage from "@/assets/community-events.jpg";

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "Agentic AI & Workflows",
      date: "March 13, 2026",
      time: "1:40 PM - 4:25 PM",
      location: "Smart Classroom, Block-2 Emerging Technologies, CEC, CGC Landran",
      attendees: "25",
      type: "Hand-On Session",
      description: "An introduction to the world of Agentic AI & Workflows. You'll learn the fundamentals of AI and how to use it to create intelligent applications as well as automate real-world tasks."
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
            <div className="relative group overflow-hidden flex items-center justify-center order-2 lg:order-1">
              <img
                src="/2.png"
                alt="Hands-On Session"
                className="w-full h-auto max-h-[600px] object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="text-tech-midnight-ink order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-tech-neo-blue/10 text-tech-neo-blue text-xs font-semibold mb-4 w-fit">
                HANDS-ON SESSION
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Agentic AI & Workflows</h1>
              <p className="text-lg text-tech-graphite leading-relaxed mb-8">
                 Join our hands-on session on <span className="text-tech-neo-blue font-bold">March 13, 2026</span> (1:40 PM – 4:25 PM) at Smart Classroom, Block-2 Emerging Technologies, CEC, CGC Landran.<br /><br />

                <span className="flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-tech-cyber-teal animate-pulse" />
                  Only 25 seats | Free registration
                </span>
              </p>

              <a
                href="https://forms.gle/rasaNeGTAwa1r8gE6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-tech-neo-blue hover:bg-tech-neo-blue/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-tech-neo-blue/30 transition-all">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
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
                      href="https://forms.gle/rasaNeGTAwa1r8gE6"
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
