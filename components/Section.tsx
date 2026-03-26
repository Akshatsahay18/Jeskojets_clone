"use client";

import { motion } from "framer-motion";

type SectionProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function Section({
  eyebrow,
  title,
  description
}: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 border-y border-white/10 py-12 md:grid-cols-[0.85fr_1.15fr] md:py-16">
        <div>
          <p className="text-[11px] uppercase tracking-wideLuxury text-white/55">
            {eyebrow}
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.14em] text-white md:text-5xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

