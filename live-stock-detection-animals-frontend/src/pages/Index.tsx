import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Advantages from "@/components/Advantages";
import SupportedAnimals from "@/components/SupportedAnimals";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <HeroSection />
      <HowItWorks />
      <Advantages />
      <SupportedAnimals />
    </main>
  </div>
);

export default Index;
