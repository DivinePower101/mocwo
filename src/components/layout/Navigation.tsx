import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Partnership", path: "/partnership" },
    { name: "MOCWO", path: "/mocwo" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Prayer", path: "/prayer-ai" }, // ✅ Prayer AI Page
  ];

  const isActive = (path: string) => location.pathname === path;

  // Hide navbar only on main FHC landing page
  if (location.pathname === "/fhc") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border font-serif">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo2} alt="MOCWO Logo" className="h-12 w-auto max-w-full" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-serif">
              MOCWO
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300
                  ${isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
                    : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 hover:bg-clip-text hover:text-transparent"
                  }`}
              >
                <span className="font-serif">{item.name}</span>
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
            <Button variant="outline" size="sm" className="ml-4 border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white">
              Admin
            </Button>
          </div>

          {/* Mobile menu */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 text-sm font-medium transition-all rounded-lg
                    ${isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white"
                      : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 hover:text-white"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Button variant="outline" size="sm" className="w-full border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
