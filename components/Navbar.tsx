export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12 lg:px-16">
        <div className="rounded-full border border-white/15 bg-black/35 px-5 py-2 backdrop-blur-lg">
          <p className="text-[10px] uppercase tracking-[0.36em] text-white/88">
            Jesko Jets
          </p>
        </div>
        <div className="rounded-full border border-white/15 bg-black/35 px-5 py-2 backdrop-blur-lg">
          <p className="text-[10px] uppercase tracking-[0.26em] text-white/68">
            Scroll Timeline
          </p>
        </div>
      </div>
    </header>
  );
}
