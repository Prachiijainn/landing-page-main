import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import heroImage from "@/assets/community-hero.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/home-image.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tech-midnight-ink/90 via-tech-neo-blue/70 to-tech-graphite/85 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Floating badge */}
          <div className="inline-flex items-center space-x-2 bg-tech-graphite/40 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-float border border-tech-cyber-teal/30">
            <Heart className="w-4 h-4 text-tech-cyber-teal" />
            <span className="text-sm font-medium text-tech-soft-steel">Growing Together</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-tech-soft-steel mb-6 animate-fade-in">
            We
            <span className="block text-tech-cyber-teal">WELCOME</span>
            all tech enthusiasts
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-tech-soft-steel/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Join a movement that believes in the power of people coming together to create positive change and
            foster growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button variant="community" size="lg" className="group">
              Join Our Community
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-tech-cyber-teal mr-2" />
                <span className="text-3xl font-bold text-tech-soft-steel">1,200+</span>
              </div>
              <p className="text-tech-soft-steel/80">Community Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-tech-cyber-teal mr-2" />
                <span className="text-3xl font-bold text-tech-soft-steel">50+</span>
              </div>
              <p className="text-tech-soft-steel/80">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-tech-soft-steel">15</span>
              </div>
              <p className="text-tech-soft-steel/80">Active Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-tech-cyber-teal/70 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-tech-cyber-teal rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;