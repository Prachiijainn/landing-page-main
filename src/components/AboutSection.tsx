import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We lead with empathy and understanding, creating safe spaces where everyone feels valued and heard."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Bringing together diverse voices and perspectives to build stronger, more inclusive communities."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Finding creative solutions to community challenges through collaboration and shared wisdom."
    },
    {
      icon: Target,
      title: "Impact",
      description: "Focused on creating lasting, positive change that uplifts individuals and strengthens communities."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tech-midnight-ink mb-6">
              Our Story & Mission
            </h2>
            <p className="text-xl text-tech-graphite max-w-3xl mx-auto leading-relaxed">
              We believe that strong communities are built on connection, compassion, and collective action. 
              Our journey began with a simple idea: everyone deserves to code.
            </p>
          </div>

          {/* Story Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-tech-midnight-ink mb-6">
                Empowering Coders, Building Futures
              </h3>
              <div className="space-y-4 text-lg text-tech-graphite">
                <p>
                  What started in 2024 as a vision by Prabhat and Prachi to make coding more accessible has rapidly grown into 
                  a thriving community of 400+ programmers, learners, and tech enthusiasts. We've learned that real growth 
                  happens when coders collaborate, share knowledge, and support each other's journeys.
                </p>
                <p>
                  Our community is more than just a network – it's a collaborative ecosystem. We celebrate breakthroughs together, 
                  troubleshoot challenges collectively, and mentor each other to achieve greater heights in our coding careers.
                </p>
                <p>
                  Every developer has a unique journey, every question drives learning, and every contribution enhances our collective knowledge. 
                  This is the foundation upon which we build our coding community and shape the future of technology.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-white border-tech-neo-blue/20 hover:border-tech-cyber-teal/40">
                  <CardContent className="p-0 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-tech-neo-blue/10 rounded-full flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-tech-neo-blue" />
                    </div>
                    <h4 className="text-lg font-semibold text-tech-midnight-ink mb-2">{value.title}</h4>
                    <p className="text-sm text-tech-graphite leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-tech-midnight-ink to-tech-neo-blue rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-tech-soft-steel mb-6">
              Our Mission
            </h3>
            <p className="text-xl text-tech-soft-steel/90 max-w-4xl mx-auto leading-relaxed">
              To create inclusive spaces where people can connect, grow, and make a meaningful impact in their communities. 
              We're committed to fostering environments where everyone has the opportunity to thrive, contribute, 
              and be part of something bigger than themselves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;