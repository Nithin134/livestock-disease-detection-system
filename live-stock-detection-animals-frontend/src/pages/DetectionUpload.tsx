import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  Pill,
  Apple,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import dogImg from "@/assets/dog.jpg";
import catImg from "@/assets/cat.jpg";
import chickenImg from "@/assets/chicken.jpg";
import cowImg from "@/assets/cow.jpg";
import { LucideIcon } from "lucide-react";

type Animal = "dog" | "cat" | "chicken" | "cow";

interface DetectionResult {
  diseaseName: string;
  causes: string[];
  precautions: string[];
  foodItems: string[];
  medications: string[];
}

const animalImages: Record<Animal, string> = {
  dog: dogImg,
  cat: catImg,
  chicken: chickenImg,
  cow: cowImg,
};

const mockResults: Record<Animal, DetectionResult> = {
  dog: {
    diseaseName: "Canine Dermatitis",
    causes: ["Allergic reactions", "Bacterial infection", "Parasites (fleas/mites)"],
    precautions: ["Keep the dog clean and dry", "Avoid known allergens", "Regular flea treatment"],
    foodItems: ["Omega-3 rich food", "Hypoallergenic diet", "Fresh vegetables"],
    medications: ["Antihistamines", "Topical antibiotics", "Medicated shampoo"],
  },
  cat: {
    diseaseName: "Feline Upper Respiratory Infection",
    causes: ["Feline herpesvirus", "Calicivirus", "Bacterial secondary infection"],
    precautions: ["Isolate from other cats", "Keep warm and hydrated", "Clean eyes and nose regularly"],
    foodItems: ["Warm wet food", "Chicken broth", "High-protein diet"],
    medications: ["Lysine supplements", "Eye drops", "Antibiotics if bacterial"],
  },
  chicken: {
    diseaseName: "Newcastle Disease",
    causes: ["Paramyxovirus", "Contact with infected birds", "Contaminated equipment"],
    precautions: ["Quarantine new birds", "Disinfect poultry houses", "Vaccination program"],
    foodItems: ["Electrolyte water", "High-energy feed", "Vitamin supplements"],
    medications: ["No specific treatment", "Antibiotics for secondary infections", "Supportive care"],
  },
  cow: {
    diseaseName: "Bovine Mastitis",
    causes: ["Bacterial infection (Staph, Strep)", "Poor milking hygiene", "Teat injuries"],
    precautions: ["Proper milking technique", "Clean udders before milking", "Dry cow therapy"],
    foodItems: ["High-quality hay", "Mineral supplements", "Clean fresh water"],
    medications: ["Intramammary antibiotics", "Anti-inflammatory drugs", "Teat sealants"],
  },
};

const DetectionUpload = () => {
  const { animal } = useParams<{ animal: string }>();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const animalKey = animal?.toLowerCase() as Animal;
  const isValid = animalKey && animalKey in mockResults;

  if (!isValid) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto flex flex-col items-center px-4 py-20">
          <h2 className="text-xl font-bold text-foreground">Invalid animal</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/detection")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Detection
          </Button>
        </main>
      </div>
    );
  }

  const displayName = animalKey.charAt(0).toUpperCase() + animalKey.slice(1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDetect = async () => {
    if (!uploadedImage || !fileRef.current?.files?.[0]) return;
    setLoading(true);

    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const animalRouteMap: Record<Animal, string> = {
      dog: "dogs",
      cat: "goats",
      chicken: "poultry",
      cow: "cattle",
    };

    const routePrefix = animalRouteMap[animalKey];
    const backendUrl = `https://livestock-disease-detection-system-production.up.railway.app//${routePrefix}/predict`;

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to connect to detection service");
      }

      const data = await response.json();

      if (data.error) {
        toast({ title: "Detection Error", description: data.error, variant: "destructive" });
        return;
      }

      const finalResult = {
        diseaseName: data.prediction,
        causes: data.causes || ["Unknown"],
        precautions: data.precautions || ["No specific precautions found"],
        foodItems: data.foodItems || ["Standard bird feed"],
        medications: data.medications || ["Consult your vet"],
      };
      
      setResult(finalResult);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        await fetch("https://livestock-disease-detection-system-production.up.railway.app//auth/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            history_item: {
              id: Date.now().toString(),
              animal: displayName,
              disease: data.prediction,
              date: new Date().toLocaleString(),
              image: uploadedImage,
              causes: finalResult.causes,
              precautions: finalResult.precautions,
              food: finalResult.foodItems,
              medications: finalResult.medications
            }
          }),
        });
      }

      toast({ title: "Detection Complete", description: `Disease detected: ${data.prediction}` });
    } catch (error) {
      console.error("Detection error:", error);
      toast({
        title: "Error",
        description: "Could not reach the detection server. Is it running?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUploadedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/detection")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img
              src={animalImages[animalKey]}
              alt={displayName}
              className="h-12 w-12 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {displayName} Disease Detection
              </h1>
              <p className="text-sm text-muted-foreground">Upload an image to diagnose</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="mx-auto max-w-xl animate-fade-in">
            <div className="rounded-2xl border bg-card p-8 card-shadow">
              <h3 className="mb-4 text-center font-display text-lg font-semibold text-foreground">
                Upload {displayName} Image
              </h3>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

              {!uploadedImage ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-secondary/50 p-10 transition-colors hover:border-primary/60"
                >
                  <Upload className="h-10 w-10 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Click to upload image</span>
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/20">
                      <img src={uploadedImage} alt="Uploaded" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDetect} disabled={loading} className="flex-1" size="lg">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                        </>
                      ) : (
                        "Detect Now"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setUploadedImage(null)} className="flex-1">
                      Change Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
            <div className="rounded-2xl border bg-card p-8 card-shadow">
              {/* Show analyzed image on top */}
              <div className="mb-8 flex justify-center">
                <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg">
                  <img src={uploadedImage || ""} alt="Analyzed" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="mb-6 flex items-center justify-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full hero-gradient text-primary-foreground shadow-lg">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Detected Disease</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">{result.diseaseName}</h2>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <AccordionCard 
                  icon={AlertCircle} 
                  title="Likely Causes" 
                  items={result.causes} 
                  defaultOpen={true}
                />
                <AccordionCard 
                  icon={ShieldAlert} 
                  title="Precautions" 
                  items={result.precautions} 
                />
                <AccordionCard 
                  icon={Apple} 
                  title="Recommended Food" 
                  items={result.foodItems} 
                />
                <AccordionCard 
                  icon={Pill} 
                  title="Medications" 
                  items={result.medications} 
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={reset} size="lg" className="flex-1 max-w-xs rounded-full px-8">
                Upload Another
              </Button>
              <Button variant="outline" onClick={() => navigate("/detection")} size="lg" className="flex-1 max-w-xs rounded-full px-8">
                Change Animal
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AccordionCard = ({ 
  icon: Icon, 
  title, 
  items, 
  defaultOpen = false 
}: { 
  icon: LucideIcon; 
  title: string; 
  items: string[];
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10 bg-background transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} transition-colors duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="font-display text-lg font-bold text-foreground">
            {title}
          </h4>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="border-t bg-muted/30 p-5 pt-4">
          <ul className="grid gap-3 sm:grid-cols-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetectionUpload;
