import { PawPrint, Upload, Brain, ClipboardList } from "lucide-react";

const steps = [
  { icon: PawPrint, title: "Select Animal", desc: "Choose from Dog, Cat, Chicken, or Cow" },
  { icon: Upload, title: "Upload Image", desc: "Take or upload a photo of the affected area" },
  { icon: Brain, title: "AI Detects Disease", desc: "Our ML model analyzes the image instantly" },
  { icon: ClipboardList, title: "Get Treatment Info", desc: "Receive causes, precautions & medication" },
];

const HowItWorks = () => (
  <section className="bg-card py-20">
    <div className="container mx-auto px-4">
      <div className="mb-14 text-center">
        <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
        <p className="text-muted-foreground">Four simple steps to detect disease</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={i} className="group relative rounded-2xl border bg-background p-8 text-center transition-all hover:card-shadow-hover card-shadow">
            <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full hero-gradient text-xs font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform group-hover:scale-110">
              <s.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
