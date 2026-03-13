import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  return (
  <section className="relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-accent/70" />
    </div>

    <div className="container relative mx-auto px-4 py-24 md:py-36">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
          <Zap className="h-4 w-4" /> AI-Powered Detection
        </div>
        <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
          Livestock & Pet Disease Detection
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
          Detect diseases early using AI image analysis. Upload a photo of your animal and get instant diagnosis with treatment recommendations.
        </p>
        <div className="flex flex-wrap gap-4">
          {!isLoggedIn ? (
            <Button size="lg" variant="secondary" asChild className="font-semibold">
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild className="font-semibold">
              <Link to="/detection">
                Go to Detection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to={isLoggedIn ? "/detection" : "/signin"}>Try Detection</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;
