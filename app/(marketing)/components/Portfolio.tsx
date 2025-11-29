"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Reveal, SectionFade } from "../lib/scroll-motion";

const portfolioVideos = [
  {
    id: "hanna",
    name: "Lacque&Latte",
    videoPath: "/videos/hanna.mp4",
  },
  {
    id: "chris",
    name: "LostFilesToronto",
    videoPath: "/videos/chris.mp4",
  },
];

function VideoCard({ video, index }: { video: typeof portfolioVideos[0]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play video on mount and keep it playing
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked, that's okay
        });
      }
    }
  }, []);

  // Ensure video continues playing when it ends (backup for loop)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
        {/* Video */}
        <video
          ref={videoRef}
          src={video.videoPath}
          className="w-full h-auto object-cover"
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
        />
        
        {/* Overlay gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Name label */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 5 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-white text-sm font-medium tracking-wide uppercase">
            {video.name}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.15, 0]);

  return (
    <section id="portfolio" ref={sectionRef} className="relative py-28 md:py-32 overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: backgroundOpacity }}
        >
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-purple-500/8 blur-3xl" />
        </motion.div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.01]">
          <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>
      </div>

      <SectionFade>
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 relative z-10">
          <Reveal className="text-center">
            <span className="tag mb-4">PORTFOLIO</span>
            <h2 className="section-heading">CLIENT PROJECTS</h2>
            <p className="section-subtitle">
              Premium web experiences crafted with precision and attention to detail.
            </p>
          </Reveal>
          
          {/* Video Grid */}
          <div className="mt-16 md:mt-20 grid gap-6 md:grid-cols-2">
            {portfolioVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        </div>
      </SectionFade>
    </section>
  );
}

