"use client";

import { Target, Palette, Rocket, TrendingUp } from "lucide-react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Reveal } from "../lib/scroll-motion";

const steps = [
  {
    id: 0,
    number: "01",
    label: "Strategy & Foundation",
    title: "Strategy & Foundation",
    tagline: "We calm the chaos and find the signal.",
    description:
      "We map your market, crystallize your value proposition, and establish the metrics that matter before we touch a line of code.",
    bullets: [
      "Persona, pain points, and priorities",
      "North-star metrics and guardrails",
      "90-day momentum roadmap",
    ],
    icon: Target,
  },
  {
    id: 1,
    number: "02",
    label: "Design the Experience",
    title: "Design & Experience",
    tagline: "Interfaces that look cinematic and feel effortless.",
    description:
      "We choreograph every screen, state, and interaction so your brand feels cohesive from the first pixel to the last click.",
    bullets: [
      "Interactive Figma component system",
      "Story-driven layout and copy hierarchy",
      "Motion language and hover 'aura' states",
    ],
    icon: Palette,
  },
  {
    id: 2,
    number: "03",
    label: "Build & Automate",
    title: "Build & Integrate",
    tagline: "We ship code that flows with the rest of your stack.",
    description:
      "Production-grade Next.js builds, AI assistants, and automations that plug into the tools you already live in.",
    bullets: [
      "Next.js + Tailwind, built for speed",
      "AI assistant and workflow integrations",
      "Performance tuned and SEO-ready",
    ],
    icon: Rocket,
  },
  {
    id: 3,
    number: "04",
    label: "Launch & Optimize",
    title: "Launch & Optimize",
    tagline: "Launch like an event. Iterate like a habit.",
    description:
      "We launch, measure, and tune weekly so momentum compounds instead of stalling after day one.",
    bullets: [
      "Meta & Google Ads aligned with the funnel",
      "Weekly CRO experiments and shipping rhythm",
      "Live dashboards that show what's actually working",
    ],
    icon: TrendingUp,
  },
];

export default function LaunchSequence() {
  return (
    <>
      {/* Mobile: Full-page snap scroll sections */}
      <section 
        id="launch-mobile" 
        className="md:hidden relative"
      >
        {/* Unified subtle background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[20%] left-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
          </div>
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="snap-start snap-always h-screen flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-20 relative z-10"
          >
            <div className="mx-auto w-full max-w-5xl">
              {/* Mobile header - only on first step */}
              {index === 0 && (
                <div className="text-center mb-32 sm:mb-40">
                  <span className="tag mb-4 block">Process</span>
                  <h2 className="section-heading text-2xl sm:text-3xl">How we ship momentum</h2>
                  <p className="section-subtitle text-sm mt-2">
                    Four tightly-linked chapters. Strategy, design, build, and growth all moving in one direction.
                  </p>
                </div>
              )}

              <article className="group relative">
                {/* Top meta row */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-white/55">
                    <span>{step.number}</span>
                    <span className="h-px w-8 bg-white/18" />
                    <span>{step.label}</span>
                  </div>
                </div>

                {/* Title - responsive text */}
                <h3 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-orbitron tracking-[0.18em] sm:tracking-[0.22em] text-white break-words">
                  {step.title}
                </h3>

                {/* Tagline – word by word */}
                {step.tagline && (
                  <AnimatedText
                    text={step.tagline}
                    className="mb-3 text-base text-white/70 max-w-xl"
                    delay={0.04}
                  />
                )}

                {/* Description – word by word */}
                <AnimatedText
                  text={step.description}
                  className="mb-7 max-w-2xl text-base text-white/60 leading-relaxed"
                  delay={0.12}
                />

                {/* Bullets */}
                {step.bullets && step.bullets.length > 0 && (
                  <ul className="space-y-2.5 text-base text-white/75">
                    {step.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-2 h-px w-5 bg-white/25 group-hover:bg-emerald-400/70 transition-colors" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </div>
        ))}
      </section>

      {/* Desktop: Original layout */}
      <section id="launch" className="hidden md:block relative py-16 sm:py-20 md:py-24 lg:py-32 pt-24 sm:pt-28 md:pt-32 lg:pt-40 px-4">
        {/* Unified subtle background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[20%] left-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <Reveal className="text-center mb-32 sm:mb-40 md:mb-48 lg:mb-56 xl:mb-64">
            <span className="tag mb-4">Process</span>
            <h2 className="section-heading">How we ship momentum</h2>
            <p className="section-subtitle">
              Four tightly-linked chapters. Strategy, design, build, and growth all moving in one direction.
            </p>
          </Reveal>

          {/* Single-column chapters - responsive spacing */}
          <div className="space-y-32 sm:space-y-40 md:space-y-48 lg:space-y-64 xl:space-y-80">
            {steps.map((step, index) => (
              <Reveal key={step.id} delay={index * 0.08}>
                <article className="group relative pt-8 sm:pt-10 md:pt-12 lg:pt-16">
                  {/* Top meta row */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-white/55">
                      <span>{step.number}</span>
                      <span className="h-px w-8 bg-white/18" />
                      <span className="hidden sm:inline">
                        {step.label}
                      </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-[0.65rem] text-white/45">
                      <div className="h-1 w-6 rounded-full bg-emerald-400/60" />
                      <span>Chapter {index + 1}</span>
                    </div>
                  </div>

                  {/* Title - responsive text */}
                  <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-orbitron tracking-[0.18em] sm:tracking-[0.22em] text-white break-words">
                    {step.title}
                  </h3>

                  {/* Tagline – word by word */}
                  {step.tagline && (
                    <AnimatedText
                      text={step.tagline}
                      className="mb-3 text-sm md:text-base text-white/70 max-w-xl"
                      delay={0.04}
                    />
                  )}

                  {/* Description – word by word */}
                  <AnimatedText
                    text={step.description}
                    className="mb-7 md:mb-9 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed"
                    delay={0.12}
                  />

                  {/* Bullets */}
                  {step.bullets && step.bullets.length > 0 && (
                    <ul className="space-y-2.5 md:space-y-3 text-sm md:text-base text-white/75">
                      {step.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-px w-5 bg-white/25 group-hover:bg-emerald-400/70 transition-colors" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* Word-by-word animated text */
const wordContainer = {
  hidden: { opacity: 1 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const wordItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.p
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0% -15% 0%" }}
      custom={delay}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordItem} className="inline-block">
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}
