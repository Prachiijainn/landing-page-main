import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import heroImage from "@/assets/community-hero.jpg";

const HeroSection = () => {
  return (

    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/video2.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-tech-midnight-ink/10 via-black/10 to-tech-graphite/5 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-tech-soft-steel mb-6 animate-fade-in"style={{ color: "rgb(11, 28, 91)" }}>
            We
            <span className="block" style={{ color: "rgb(11, 28, 91)" }}>WELCOME</span>
            All Tech Enthusiasts
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-tech-soft-steel/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ color: "rgb(11, 28, 91)" }}>
            An organization that believes in the power of people.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <a href="https://chat.whatsapp.com/FJvnsTIzJxy8iIPPHfIkJ7" target="_blank" rel="noopener noreferrer">
              <Button variant="community" size="lg" className="group text-black">
                Join Our Community
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-7 text-black"/>
                <span className="text-3xl font-bold text-black">400+</span>
              </div>
              <p className="text-black">Community Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-black">15</span>
              </div>
              <p className="text-black">Active Projects</p>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;