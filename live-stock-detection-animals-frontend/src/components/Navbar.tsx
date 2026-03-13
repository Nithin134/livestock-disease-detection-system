import { Link, useLocation } from "react-router-dom";
import { Menu, X, Stethoscope, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, [location]);

  const links = [
    { to: "/", label: "Home" },
  ];
  if (isLoggedIn) {
    links.push({ to: "/detection", label: "Detection" });
    links.push({ to: "/profile", label: "Profile" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Stethoscope className="h-7 w-7" />
          Live Stock Detection
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-3 flex gap-2">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" size="icon" asChild className="rounded-full">
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card p-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" asChild className="flex-1">
                  <Link to="/signin" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button asChild className="flex-1">
                <Link to="/profile" onClick={() => setOpen(false)}>View Profile</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
