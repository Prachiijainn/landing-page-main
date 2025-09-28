import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
     { label: "Events", href: "/events" },
    { label: "About Us", href: "/about" }
   
  ];

  return (

    <nav className="fixed top-0 w-full bg-tech-midnight-ink/95 backdrop-blur-md border-b border-tech-cyber-teal/20 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
            <img
              src="/logo192.png"
              alt="NX Logo"
              className="h-20 w-auto"
            />
            <div className="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-white bg-clip-text text-transparent">
              <h1>NaedeX</h1>
            </div>
          </Link>
          

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${
                      location.pathname === item.href
                        ? "text-tech-cyber-teal bg-tech-neo-blue/20"
                        : "text-tech-soft-steel hover:text-tech-cyber-teal"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-200 ${
                isOpen 
                  ? "bg-tech-cyber-teal text-tech-midnight-ink hover:bg-tech-cyber-teal/80" 
                  : "text-tech-soft-steel hover:text-tech-cyber-teal hover:bg-tech-neo-blue/20"
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-tech-midnight-ink rounded-lg mt-2 border border-tech-cyber-teal/30">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                    ${
                      location.pathname === item.href
                        ? "text-white bg-tech-neo-blue/20"
                        : "text-tech-soft-steel hover:text-tech-cyber-teal"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <a href="https://chat.whatsapp.com/FJvnsTIzJxy8iIPPHfIkJ7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="community" size="sm" className="w-full text-white" >
                  Join Now
                </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
