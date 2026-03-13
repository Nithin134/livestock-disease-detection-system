import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Stethoscope className="h-6 w-6" />
            VetAI Detect
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered livestock and pet disease detection platform. Helping farmers, veterinarians, and pet owners detect diseases early using advanced machine learning.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-display font-semibold text-foreground">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/detection" className="hover:text-primary transition-colors">Disease Detection</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link>
            <Link to="/signup" className="hover:text-primary transition-colors">Get Started</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-display font-semibold text-foreground">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@vetai-detect.com</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +1 (555) 123-4567</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> San Francisco, CA</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © 2026 VetAI Detect. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
