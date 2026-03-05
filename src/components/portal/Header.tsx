import { Search, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Submit Application", path: "/submit" },
    { label: "Track Application", path: "/track" },
    { label: "Admin Dashboard", path: "/admin" },
  ];

  return (
    <header className="w-full">
      {/* Top saffron band */}
      <div className="h-1.5 saffron-gradient" />
      
      {/* Main header */}
      <div className="gov-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-gov-saffron">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold leading-tight">
                  Government of India
                </h1>
                <p className="text-xs text-white/70">National Portal • AI-Powered Services</p>
              </div>
            </Link>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-gov-saffron"
                />
              </div>
            </div>

            {/* Language + mobile menu */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 hidden md:flex">
                <Globe className="h-4 w-4 mr-1" />
                English
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="border-t border-white/10 bg-white/5">
          <div className="container mx-auto px-4">
            <ul className={`${mobileOpen ? "flex flex-col py-2" : "hidden"} md:flex md:flex-row md:items-center md:gap-0`}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 ${
                      location.pathname === item.path
                        ? "bg-white/15 text-gov-saffron"
                        : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Green bottom band */}
      <div className="h-1 bg-gov-green" />
    </header>
  );
};

export default Header;
