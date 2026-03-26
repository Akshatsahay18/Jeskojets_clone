import Globe from "@/components/Globe";
import HeroScroll from "@/components/HeroScroll";
import Navbar from "@/components/Navbar";
import PlaneMorph from "@/components/PlaneMorph";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />
      <HeroScroll />
      <PlaneMorph />
      <Globe />
    </main>
  );
}
