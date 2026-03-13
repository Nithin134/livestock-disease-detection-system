import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import centerImg from "@/assets/livestock-detection-center.jpg";
import dogImg from "@/assets/dog.jpg";
import catImg from "@/assets/cat.jpg";
import chickenImg from "@/assets/chicken.jpg";
import cowImg from "@/assets/cow.jpg";

type Animal = "Dog" | "Cat" | "Chicken" | "Cow";

const animals: { name: Animal; img: string; startAngle: number; color: string; hoverColor: string }[] = [
  { name: "Dog", img: dogImg, startAngle: -45, color: "#fecaca", hoverColor: "#fee2e2" }, // Reddish
  { name: "Cat", img: catImg, startAngle: 45, color: "#bfdbfe", hoverColor: "#dbeafe" }, // Bluish
  { name: "Chicken", img: chickenImg, startAngle: 135, color: "#fef08a", hoverColor: "#fef9c3" }, // Yellowish
  { name: "Cow", img: cowImg, startAngle: 225, color: "#bbf7d0", hoverColor: "#dcfce7" }, // Greenish
];

const Detection = () => {
  const navigate = useNavigate();

  const handleSelect = (animal: Animal) => {
    navigate(`/detection/${animal.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center px-4 py-2">
        <div className="relative mx-auto mt-8 transition-transform duration-500" style={{ width: 600, height: 600 }}>
          {/* Outer ring segments */}
          <svg
            viewBox="0 0 600 600"
            className="absolute inset-0 h-full w-full"
            style={{ filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.15))" }}
          >
            {animals.map((a, i) => {
              const startAngle = a.startAngle - 45;
              const endAngle = a.startAngle + 45;
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              const outerR = 290;
              const innerR = 130;
              const cx = 300;
              const cy = 300;

              const x1 = cx + outerR * Math.cos(startRad);
              const y1 = cy + outerR * Math.sin(startRad);
              const x2 = cx + outerR * Math.cos(endRad);
              const y2 = cy + outerR * Math.sin(endRad);
              const x3 = cx + innerR * Math.cos(endRad);
              const y3 = cy + innerR * Math.sin(endRad);
              const x4 = cx + innerR * Math.cos(startRad);
              const y4 = cy + innerR * Math.sin(startRad);

              const d = [
                `M ${x1} ${y1}`,
                `A ${outerR} ${outerR} 0 0 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerR} ${innerR} 0 0 0 ${x4} ${y4}`,
                "Z",
              ].join(" ");

              return (
                <path
                  key={a.name}
                  d={d}
                  fill={a.color}
                  className="cursor-pointer transition-all duration-300 hover:brightness-105"
                  style={{ 
                    stroke: "white", 
                    strokeWidth: 6,
                    transformOrigin: "center",
                  }}
                  onClick={() => handleSelect(a.name)}
                >
                  <title>{a.name}</title>
                </path>
              );
            })}
          </svg>

          {/* Animal icons directly on segments - No name, larger size */}
          {animals.map((a) => {
            const rad = (a.startAngle - 90) * Math.PI / 180;
            const placementR = 215; // Placed further out due to larger radius
            const x = 300 + placementR * Math.cos(rad);
            const y = 300 + placementR * Math.sin(rad);

            return (
              <button
                key={a.name}
                onClick={() => handleSelect(a.name)}
                className="group absolute"
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  <img
                    src={a.img}
                    alt={a.name}
                    className="h-32 w-32 rounded-full object-cover transition-all duration-500 group-hover:scale-115 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] md:h-36 md:w-36"
                  />
                </div>
              </button>
            );
          })}

          {/* Center visual */}
          <div
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-white shadow-2xl"
            style={{ width: 220, height: 220 }}
          >
            <img
              src={centerImg}
              alt="Center"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-secondary/30 px-8 py-4 text-muted-foreground backdrop-blur-sm">
          <div className="h-2.5 w-2.5 animate-ping rounded-full bg-primary" />
          <p className="text-xl font-bold uppercase tracking-widest">
            Select an animal segment for diagnosis
          </p>
        </div>
      </main>
    </div>
  );
};

export default Detection;
