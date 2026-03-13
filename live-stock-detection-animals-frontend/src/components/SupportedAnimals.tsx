import { Link } from "react-router-dom";
import dogImg from "@/assets/dog.jpg";
import catImg from "@/assets/cat.jpg";
import chickenImg from "@/assets/chicken.jpg";
import cowImg from "@/assets/cow.jpg";

const animals = [
  { name: "Dog", img: dogImg, angle: -45, path: "/detection/dog" },
  { name: "Cat", img: catImg, angle: 45, path: "/detection/cat" },
  { name: "Chicken", img: chickenImg, angle: 135, path: "/detection/chicken" },
  { name: "Cow", img: cowImg, angle: 225, path: "/detection/cow" },
];

const SupportedAnimals = () => (
  <section className="bg-card py-20">
    <div className="container mx-auto px-4">
      <div className="mb-14 text-center">
        <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
          Supported Animals
        </h2>
        <p className="text-muted-foreground">
          Currently supporting 4 animal categories
        </p>
      </div>

      {/* Circular Layout */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 380, height: 380 }}>
          {/* Outer dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />

          {/* Inner decorative ring */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
            style={{ width: 220, height: 220 }}
          />

          {/* Center badge */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full hero-gradient text-primary-foreground shadow-lg">
            <span className="text-2xl font-bold">4</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Animals
            </span>
          </div>

          {/* Animal cards around the circle */}
          {animals.map((a) => {
            const rad = ((a.angle - 90) * Math.PI) / 180;
            const radius = 150;
            const x = 190 + radius * Math.cos(rad);
            const y = 190 + radius * Math.sin(rad);

            return (
              <Link
                key={a.name}
                to={a.path}
                className="group absolute flex flex-col items-center gap-2"
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="overflow-hidden rounded-full border-[3px] border-primary/30 shadow-md transition-all duration-500 group-hover:border-primary group-hover:shadow-xl group-hover:scale-110">
                  <img
                    src={a.img}
                    alt={a.name}
                    className="h-20 w-20 object-cover transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24"
                    loading="lazy"
                  />
                </div>
                <span className="rounded-full bg-background px-3 py-0.5 text-xs font-bold text-foreground shadow-sm border border-border md:text-sm">
                  {a.name}
                </span>
              </Link>
            );
          })}

          {/* Connecting lines from center to each animal */}
          <svg
            viewBox="0 0 380 380"
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: "none" }}
          >
            {animals.map((a) => {
              const rad = ((a.angle - 90) * Math.PI) / 180;
              const x2 = 190 + 110 * Math.cos(rad);
              const y2 = 190 + 110 * Math.sin(rad);
              return (
                <line
                  key={a.name}
                  x1="190"
                  y1="190"
                  x2={x2}
                  y2={y2}
                  className="stroke-primary/15"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  </section>
);

export default SupportedAnimals;
