import { useState, useEffect } from "react";
import { User, Mail, Calendar, ChevronRight, X, LogOut, ChevronDown, AlertCircle, ShieldAlert, Apple, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  animal: string;
  disease: string;
  date: string;
  image: string;
  causes: string[];
  precautions: string[];
  food: string[];
  medications: string[];
}

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    const user = JSON.parse(userStr);
    setUserData(user);
    fetchHistory(user.id);
  }, [navigate]);

  const fetchHistory = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.reverse()); // Show latest first
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Profile Card */}
          <div className="mb-8 rounded-2xl border bg-card p-8 card-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full hero-gradient text-primary-foreground shadow-lg">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{userData.name}</h1>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {userData.email}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Detection History */}
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Detection History</h2>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:card-shadow-hover card-shadow"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                    <img src={item.image} alt={item.animal} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-foreground">{item.disease}</p>
                    <p className="text-sm text-muted-foreground">{item.animal}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground bg-muted/20">
                No detection history yet.
              </div>
            )}
          </div>
        </div>

        {/* Left Side Drawer */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex overflow-hidden">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-foreground/60 backdrop-blur-md transition-opacity duration-300" 
              onClick={() => setSelectedItem(null)} 
            />
            
            {/* Drawer Content */}
            <div className="relative flex w-full md:max-w-[50%] flex-col bg-card shadow-2xl animate-in slide-in-from-left duration-500">
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="font-display text-xl font-bold text-foreground uppercase tracking-tight">Detection Details</h3>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="rounded-full p-2 hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="mb-8 flex justify-center">
                  <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-primary/20 shadow-2xl">
                    <img src={selectedItem.image} alt={selectedItem.animal} className="h-full w-full object-cover" />
                  </div>
                </div>
                
                <div className="mb-8 text-center">
                  <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    {selectedItem.animal}
                  </span>
                  <h4 className="font-display text-3xl font-black text-foreground leading-tight tracking-tight">
                    {selectedItem.disease}
                  </h4>
                  <p className="mt-2 text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" /> {selectedItem.date}
                  </p>
                </div>

                <div className="space-y-4">
                  <DetailAccordion 
                    icon={AlertCircle} 
                    title="Causes" 
                    items={selectedItem.causes} 
                    defaultOpen={true}
                  />
                  <DetailAccordion 
                    icon={ShieldAlert} 
                    title="Precautions" 
                    items={selectedItem.precautions} 
                  />
                  <DetailAccordion 
                    icon={Apple} 
                    title="Recommended Food" 
                    items={selectedItem.food} 
                  />
                  <DetailAccordion 
                    icon={Pill} 
                    title="Medications" 
                    items={selectedItem.medications} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const DetailAccordion = ({ 
  icon: Icon, 
  title, 
  items, 
  defaultOpen = false 
}: { 
  icon: any; 
  title: string; 
  items: string[];
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/5 bg-background shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isOpen ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'} transition-all duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="font-display font-bold text-foreground">
            {title}
          </h4>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="border-t bg-muted/20 p-4">
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-foreground/80">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 shadow-sm" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
