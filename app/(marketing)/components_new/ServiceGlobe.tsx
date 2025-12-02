"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Text, PerspectiveCamera, OrbitControls, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionSettings } from "../components/MotionProvider";
import { Reveal } from "../lib/scroll-motion";
import { Sparkles, Cpu, LineChart, Workflow } from "lucide-react";
import * as THREE from "three";

// Service data matching ValueGrid structure
const services = [
  {
    id: 1,
    category: "Web & Product",
    title: "Premium Web Experiences",
    description:
      "Design systems, conversion copy, and elite polish—shipped in weeks, not quarters.",
    points: [
      "Next.js + Tailwind, built for speed",
      "Component libraries that actually scale",
      "Story-driven landing pages that convert",
    ],
    icon: Sparkles,
    bulletClass: "bg-cyan-400",
    color: "from-cyan-500 to-blue-500",
    position: [1.2, 0.8, 0.5] as [number, number, number], // Position on globe surface
  },
  {
    id: 2,
    category: "AI Systems",
    title: "AI Assistants & Automations",
    description:
      "Agents that book, qualify, and route—deeply integrated into the tools you already live in.",
    points: [
      "Voice & chat concierge for inbound",
      "CRM + calendar + ticketing integrations",
      "Automations that remove busywork, not humans",
    ],
    icon: Cpu,
    bulletClass: "bg-purple-400",
    color: "from-purple-500 to-pink-500",
    position: [-1.1, 0.6, 0.7] as [number, number, number],
  },
  {
    id: 3,
    category: "Acquisition",
    title: "Growth Campaigns",
    description:
      "Paid social, local SEO, and reputation flows engineered for pipeline, not vanity metrics.",
    points: [
      "Meta & Google Ads built around offers",
      "Localized SEO and content playbooks",
      "Review generation and monitoring",
    ],
    icon: LineChart,
    bulletClass: "bg-emerald-400",
    color: "from-emerald-500 to-teal-500",
    position: [0.5, -0.9, 1.0] as [number, number, number],
  },
  {
    id: 4,
    category: "Retention",
    title: "Lifecycle Systems",
    description:
      "Onboarding, loyalty, and referral systems that keep customers engaged long after the first sale.",
    points: [
      "Email & SMS journeys that feel human",
      "Insight reporting that isn't a spreadsheet dump",
      "Attribution you can actually explain",
    ],
    icon: Workflow,
    bulletClass: "bg-amber-400",
    color: "from-orange-500 to-amber-500",
    position: [-0.7, -0.8, -0.9] as [number, number, number],
  },
];

// HTML label component - clean, minimal styling
function Label({ 
  children, 
  position,
  color,
  isActive,
  isHovered
}: { 
  children: React.ReactNode;
  position: [number, number, number];
  color: string;
  isActive: boolean;
  isHovered: boolean;
}) {
  const isHighlighted = isActive || isHovered;
  
  return (
    <Html
      position={position}
      center
      transform
      occlude={false}
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          color: isHighlighted ? color : 'rgba(148, 163, 184, 0.7)',
          fontSize: '12px',
          fontWeight: '500',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
          transform: 'translateY(-100%)',
        }}
      >
        {children}
      </div>
    </Html>
  );
}

// Hotspot marker component - minimal, tech-forward design
function Hotspot({
  position,
  serviceId,
  onClick,
  isActive,
  serviceColor,
}: {
  position: [number, number, number];
  serviceId: number;
  onClick: () => void;
  isActive: boolean;
  serviceColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerDotRef = useRef<THREE.Mesh>(null);
  const crosshairRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { reduceMotion } = useMotionSettings();

  // Get subtle color based on service - more muted, professional
  const getColor = () => {
    if (serviceColor.includes('cyan')) return { 
      accent: '#0ea5e9', 
      glow: 'rgba(14, 165, 233, 0.15)',
      line: 'rgba(14, 165, 233, 0.4)'
    };
    if (serviceColor.includes('purple')) return { 
      accent: '#8b5cf6', 
      glow: 'rgba(139, 92, 246, 0.15)',
      line: 'rgba(139, 92, 246, 0.4)'
    };
    if (serviceColor.includes('emerald')) return { 
      accent: '#10b981', 
      glow: 'rgba(16, 185, 129, 0.15)',
      line: 'rgba(16, 185, 129, 0.4)'
    };
    return { 
      accent: '#f59e0b', 
      glow: 'rgba(245, 158, 11, 0.15)',
      line: 'rgba(245, 158, 11, 0.4)'
    }; // amber
  };

  const colors = getColor();

  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (reduceMotion) return;
    const time = clock.getElapsedTime();
    
    // Make hotspot group always face camera (billboard effect)
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      groupRef.current.lookAt(camera.position);
    }
    
    // Subtle pulse for inner dot
    if (innerDotRef.current) {
      const pulse = isActive || isHovered 
        ? 1 + Math.sin(time * 2) * 0.08 
        : 1 + Math.sin(time * 1.5) * 0.04;
      innerDotRef.current.scale.setScalar(pulse);
    }

    // Subtle crosshair rotation (relative to hotspot, not globe)
    if (crosshairRef.current) {
      crosshairRef.current.rotation.z = time * 0.2;
    }
  });

  const baseScale = isHovered ? 1.15 : 1;
  const glowIntensity = isActive || isHovered ? 1.2 : 0.6;

  return (
    <group position={position} ref={groupRef} scale={baseScale}>
      {/* Minimal crosshair */}
      <group ref={crosshairRef}>
        <mesh>
          <boxGeometry args={[0.15, 0.002, 0.002]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={isActive || isHovered ? 0.4 : 0.2}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.002, 0.15, 0.002]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={isActive || isHovered ? 0.4 : 0.2}
          />
        </mesh>
      </group>
      
      {/* Clickable area */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }} 
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Central dot */}
      <mesh ref={innerDotRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={glowIntensity}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Subtle glow */}
      <mesh>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial
          color={colors.accent}
          transparent
          opacity={isActive || isHovered ? 0.1 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Number label - always visible, not occluded by globe */}
      <Label
        position={[0, -0.22, 0]}
        color={colors.accent}
        isActive={isActive}
        isHovered={isHovered}
      >
        {serviceId.toString().padStart(2, "0")}
      </Label>
    </group>
  );
}

// Globe component
function Globe({ selectedService, onServiceClick }: { selectedService: number | null; onServiceClick: (id: number) => void }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const { reduceMotion } = useMotionSettings();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <group>
      {/* Main globe sphere - reduced geometry for mobile performance */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[
          2, 
          isMobile ? 24 : 32, // Reduced segments on mobile
          isMobile ? 24 : 32
        ]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Wireframe overlay for futuristic look - reduced segments on mobile */}
      <mesh>
        <sphereGeometry args={[
          2.01, 
          isMobile ? 12 : 16,
          isMobile ? 12 : 16
        ]} />
        <meshBasicMaterial
          color="#0ea5e9"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Service hotspots */}
      {services.map((service) => (
        <Hotspot
          key={service.id}
          position={service.position}
          serviceId={service.id}
          onClick={() => onServiceClick(service.id)}
          isActive={selectedService === service.id}
          serviceColor={service.color}
        />
      ))}
    </group>
  );
}

// 3D Scene component
function Scene3D({ selectedService, onServiceClick }: { selectedService: number | null; onServiceClick: (id: number) => void }) {
  const { reduceMotion } = useMotionSettings();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={reduceMotion ? 0.4 : 0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[-5, 3, -5]} intensity={0.7} color="#a78bfa" />
      <pointLight position={[0, -5, 0]} intensity={0.5} color="#34d399" />
      <directionalLight position={[0, 5, -5]} intensity={0.6} color="#ffffff" />

      {/* Globe */}
      <Globe selectedService={selectedService} onServiceClick={onServiceClick} />

      {/* OrbitControls for drag-to-rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

// Service detail panel component - matches ValueGrid service-card styling
function ServicePanel({ service, isVisible }: { service: typeof services[0] | null; isVisible: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!service) return null;

  const IconComponent = service.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.article
          initial={{ opacity: 0, x: 50, y: 20, scale: 0.9, rotateY: -15, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 30, scale: 0.95, filter: "blur(10px)" }}
          transition={{ 
            duration: 0.7, 
            ease: [0.19, 1, 0.22, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="service-card service-card-hover group max-w-md w-full"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Halo effect */}
          <div className="service-card-halo" />
          
          {/* Sweep animation */}
          <div className="service-card-sweep" />

          {/* Content wrapper */}
          <div className="service-card-inner px-7 py-6 md:px-8 md:py-7">
            {/* Top row: icon + meta */}
            <motion.div 
              className="mb-5 flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-3">
                <motion.div 
                  className="service-card-corner flex h-8 w-8 items-center justify-center border border-white/15 bg-slate-900/80"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <IconComponent className="h-3.5 w-3.5 text-slate-100" />
                </motion.div>
                <div className="service-meta">
                  <span className="opacity-70 mr-3">
                    {service.id.toString().padStart(2, "0")}
                  </span>
                  <span>{service.category}</span>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h3 
              className="text-lg md:text-xl font-medium tracking-[0.16em] text-slate-50 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {service.title}
            </motion.h3>

            {/* Description */}
            <motion.p 
              className="text-sm md:text-[0.95rem] text-slate-300/85 leading-relaxed mb-5 max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {service.description}
            </motion.p>

            {/* Bullet points */}
            <motion.ul 
              className="space-y-2.5 text-sm md:text-[0.95rem] text-slate-200/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {service.points.map((point, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                >
                  <span className={`mt-[0.55rem] h-px w-5 rounded-full ${service.bulletClass}`} />
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Animated gradient overlay on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 rounded-[1.75rem] pointer-events-none`}
            animate={{ opacity: isHovered ? 0.08 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.article>
      )}
    </AnimatePresence>
  );
}

export default function ServiceGlobe() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const { reduceMotion } = useMotionSettings();
  const selectedServiceData = useMemo(
    () => services.find((s) => s.id === selectedService) || null,
    [selectedService]
  );

  // Memoize DPR calculation to prevent recalculation on every render
  // Adaptive DPR based on device capabilities - mobile optimized
  const dpr = useMemo((): [number, number] => {
    if (typeof window === 'undefined') return [1, 1.5];
    const width = window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const maxDPR = width < 640 ? 1 : width < 1024 ? 1.25 : 1.5;
    return [1, Math.min(devicePixelRatio, maxDPR)];
  }, []);

  return (
    <section id="services" className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Enhanced background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Animated gradient orbs */}
        {/* Static background effects - removed animations for better performance */}
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-3xl opacity-30" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent,rgba(2,6,23,0.3))]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="tag mb-4">What we deliver</span>
          <h2 className="section-heading">
            A single team for full-stack growth
          </h2>
          <p className="section-subtitle">
            One partner across web, AI, and performance so your momentum never stalls.
          </p>
        </Reveal>

        {/* Main content: Globe + Panel */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] overflow-visible">
          {/* Connection line effect when service is selected */}
          {selectedServiceData && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px pointer-events-none z-0"
            >
              <div className="relative w-full h-full">
                <div 
                  className="absolute left-[calc(50%-1px)] top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${selectedServiceData.color.includes('cyan') ? 'rgba(6, 182, 212, 0.3)' : selectedServiceData.color.includes('purple') ? 'rgba(168, 85, 247, 0.3)' : selectedServiceData.color.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)'}, transparent)`,
                  }}
                />
                <motion.div
                  className="absolute left-[calc(50%-2px)] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: selectedServiceData.color.includes('cyan') ? '#06b6d4' : selectedServiceData.color.includes('purple') ? '#a855f7' : selectedServiceData.color.includes('emerald') ? '#10b981' : '#f59e0b',
                    boxShadow: `0 0 20px ${selectedServiceData.color.includes('cyan') ? 'rgba(6, 182, 212, 0.6)' : selectedServiceData.color.includes('purple') ? 'rgba(168, 85, 247, 0.6)' : selectedServiceData.color.includes('emerald') ? 'rgba(16, 185, 129, 0.6)' : 'rgba(249, 115, 22, 0.6)'}`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          )}
          
          {/* 3D Globe Canvas - responsive height */}
          <motion.div 
            className="w-full lg:w-1/2 h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] relative lg:-translate-x-8 lg:-translate-y-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Glow effect around canvas */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10 blur-2xl opacity-50" />
            
            <Canvas
              dpr={dpr}
              gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
                stencil: false,
                depth: true,
                logarithmicDepthBuffer: false,
              }}
              frameloop={reduceMotion ? "demand" : "always"}
              performance={{ min: 0.5 }}
              className="w-full h-full relative z-10 touch-pan-y touch-pinch-zoom"
              style={{ willChange: 'auto' }}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
                <Scene3D
                  selectedService={selectedService}
                  onServiceClick={setSelectedService}
                />
              </Suspense>
            </Canvas>
            
            {/* Enhanced instructions overlay - responsive text */}
            <motion.div 
              className="absolute bottom-2 sm:bottom-0 sm:-bottom-4 right-4 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-end sm:items-center gap-2 z-20 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span className="hidden sm:inline">Drag to rotate</span>
                  <span className="sm:hidden">Swipe to rotate</span>
                </span>
                <span className="hidden sm:inline h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="hidden sm:inline">Click hotspots</span>
                  <span className="sm:hidden">Tap hotspots</span>
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Service Detail Panel - responsive min-height */}
          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
            {selectedServiceData ? (
              <ServicePanel service={selectedServiceData} isVisible={true} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="service-card max-w-md w-full text-center"
              >
                <div className="service-card-inner px-8 py-10">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 mb-4"
                  >
                    <svg 
                      className="h-8 w-8 text-white/40" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </motion.div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Click a hotspot on the globe to explore our services
                  </p>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-wider">
                    Interactive Discovery
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

