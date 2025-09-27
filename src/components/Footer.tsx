import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "How to Help", href: "#help" },
    { label: "Events", href: "#events" },
    { label: "Stories", href: "#stories" },
    { label: "Join Us", href: "#join" },
    { label: "Contact", href: "#contact" }
  ];

  const communityLinks = [
    { label: "Volunteer Opportunities", href: "#" },
    { label: "Partnership Program", href: "#" },
    { label: "Resource Center", href: "#" },
    { label: "Success Stories", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Blog", href: "#" }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-tech-graphite to-tech-midnight-ink text-tech-soft-steel py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-4 text-tech-soft-steel">Community</h3>
              <p className="text-tech-soft-steel/80 mb-6 leading-relaxed max-w-md">
                Building stronger communities through connection, compassion, and collective action. 
                Join us in creating positive change that lasts.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-tech-soft-steel/80">
                  <Mail className="w-4 h-4 mr-3 text-tech-cyber-teal" />
                  <span>hello@community.org</span>
                </div>
                <div className="flex items-center text-tech-soft-steel/80">
                  <Phone className="w-4 h-4 mr-3 text-tech-cyber-teal" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center text-tech-soft-steel/80">
                  <MapPin className="w-4 h-4 mr-3 text-tech-cyber-teal" />
                  <span>123 Community St, Cityville, ST 12345</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 bg-tech-midnight-ink rounded-full text-tech-soft-steel hover:bg-tech-cyber-teal hover:text-tech-midnight-ink transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-tech-soft-steel">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-tech-soft-steel/80 hover:text-tech-cyber-teal transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-tech-soft-steel">Community</h4>
              <ul className="space-y-3">
                {communityLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-tech-soft-steel/80 hover:text-tech-cyber-teal transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-tech-midnight-ink/60 rounded-2xl p-8 mb-12 border border-tech-cyber-teal/20">
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold mb-4 text-tech-soft-steel">Stay Connected</h4>
              <p className="text-tech-soft-steel/80 mb-6">
                Get the latest community updates, event announcements, and inspiring stories 
                delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-tech-graphite border border-tech-cyber-teal/30 text-tech-soft-steel placeholder-tech-soft-steel/60 focus:outline-none focus:border-tech-cyber-teal focus:bg-tech-graphite/80"
                />
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-tech-cyber-teal text-tech-midnight-ink hover:bg-tech-cyber-teal/80 font-semibold"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-tech-soft-steel/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <div className="text-tech-soft-steel/60 text-sm mb-4 md:mb-0">
                <p className="flex items-center">
                  © 2024 Community Organization. Made with 
                  <Heart className="w-4 h-4 mx-1 text-tech-cyber-teal" />
                  for positive change.
                </p>
              </div>

              {/* Legal Links */}
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 p-3 bg-tech-cyber-teal rounded-full text-tech-midnight-ink hover:bg-tech-cyber-teal/80 transition-all duration-300 shadow-lg hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-tech-midnight-ink via-tech-cyber-teal to-tech-neo-blue"></div>
    </footer>
  );
};

export default Footer;