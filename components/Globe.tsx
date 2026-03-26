"use client";

import { motion } from "framer-motion";

export default function Globe() {
  return (
    <section className="relative h-screen overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0 flex items-center justify-center px-6">
        <h2 className="font-display text-center text-[13vw] uppercase leading-none tracking-[0.2em] text-white/18">
          Beyond Boundaries
        </h2>
      </div>

      <video
        src="/globe-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-10 h-full w-full object-cover opacity-60 mix-blend-lighten"
      />

      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(5,5,5,0.5),rgba(5,5,5,0.84))]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-16 z-30 px-6 text-center md:px-12"
      >
        <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-white/65">
          Global Reach
        </p>
        <h3 className="font-display text-3xl uppercase tracking-[0.18em] text-white md:text-5xl">
          A world without boundaries.
        </h3>
      </motion.div>
    </section>
  );
}
