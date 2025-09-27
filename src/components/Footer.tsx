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
  ArrowUp,
  MessageCircle
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" }
  ];
  const socialLinks = [
    { icon: MessageCircle, label: "WhatsApp", href: "https://chat.whatsapp.com/FJvnsTIzJxy8iIPPHfIkJ7" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/naedex.org_" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/naedex" }
    
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-tech-midnight-ink/95 text-tech-soft-steel py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-4 text-tech-soft-steel">NaedeX</h3>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-tech-soft-steel/80">
                  <Mail className="w-4 h-4 mr-3 text-tech-cyber-teal" />
                  <span>naedex.org@gmail.com</span>
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
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-tech-soft-steel/20 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <div className="text-tech-soft-steel/60 text-sm mb-4 md:mb-0">
                <p className="flex items-center">
                  © 2025 NaedeX . Made by NaedeX.
                </p>
              </div>

              {/* Legal Links */}
              {/* <div className="flex space-x-6 text-sm">
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-tech-soft-steel/60 hover:text-tech-cyber-teal transition-colors">
                  Cookie Policy
                </a>
              </div> */}
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