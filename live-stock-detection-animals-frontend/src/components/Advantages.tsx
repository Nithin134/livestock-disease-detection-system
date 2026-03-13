import { ShieldCheck, DollarSign, Cpu, Smile } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Early Disease Detection", desc: "Catch diseases before they spread and become severe" },
  { icon: DollarSign, title: "Reduces Veterinary Cost", desc: "Save money with early, accurate AI-based diagnosis" },
  { icon: Cpu, title: "AI-Powered Accuracy", desc: "Advanced machine learning models trained on thousands of cases" },
  { icon: Smile, title: "Easy to Use", desc: "Designed for farmers, vets, and pet owners of all ages" },
];

const Advantages = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="mb-14 text-center">
        <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Why Choose Us</h2>
        <p className="text-muted-foreground">Built for real-world animal healthcare</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 transition-all hover:card-shadow-hover card-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl hero-gradient text-primary-foreground">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Advantages;
