"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function CinematicHero() {
	const sectionRef = useRef<HTMLElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [loaded, setLoaded] = useState(false);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	// Smooth spring for scroll progress
	const smoothProgress = useSpring(scrollYProgress, {
		mass: 0.5,
		stiffness: 100,
		damping: 30,
	});

	// Parallax layers at different speeds
	const backgroundLayer1 = useTransform(smoothProgress, [0, 1], [0, 100]);
	const backgroundLayer2 = useTransform(smoothProgress, [0, 1], [0, 60]);
	const backgroundLayer3 = useTransform(smoothProgress, [0, 1], [0, 40]);

	// Content parallax
	const contentY = useTransform(smoothProgress, [0, 1], [0, 80]);
	const contentOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
	const contentScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);

	// Background glow intensity
	const glowScale = useTransform(smoothProgress, [0, 1], [1, 1.3]);
	const glowOpacity = useTransform(smoothProgress, [0, 0.8], [0.8, 0.2]);

	// Rotating gradient position
	const gradientRotation = useTransform(smoothProgress, [0, 1], [0, 360]);

	useEffect(() => {
		// Trigger initial animation sequence
		const timer = setTimeout(() => setLoaded(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const headline = "Premium web, AI, and growth—crafted into one cinematic story.";
	const subheadline = "We ship momentum systems—design, automation, and campaigns that move in sync and compound results.";

	return (
		<section 
			ref={sectionRef} 
			className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24"
		>
			{/* Animated Background Layers */}
			<div className="absolute inset-0 -z-10">
				{/* Base layer - deep gradient */}
				<motion.div
					className="absolute inset-0"
					style={{
						background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(2,6,23,0.98), rgba(2,6,23,1))",
						y: backgroundLayer1,
					}}
				/>

				{/* Middle layer - animated gradient orbs */}
				<motion.div
					className="absolute inset-0"
					style={{
						y: backgroundLayer2,
						rotate: gradientRotation,
					}}
				>
					<motion.div
						className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
						style={{
							background: "radial-gradient(circle, rgba(14,165,233,0.4), transparent 70%)",
							scale: glowScale,
						}}
						animate={{
							x: [0, 50, 0],
							y: [0, -30, 0],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
						style={{
							background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)",
							scale: glowScale,
						}}
						animate={{
							x: [0, -40, 0],
							y: [0, 40, 0],
						}}
						transition={{
							duration: 18,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 2,
						}}
					/>
					<motion.div
						className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full blur-3xl opacity-25 -translate-x-1/2 -translate-y-1/2"
						style={{
							background: "radial-gradient(circle, rgba(20,184,166,0.35), transparent 70%)",
							scale: glowScale,
						}}
						animate={{
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 15,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</motion.div>

				{/* Top layer - particle grid */}
				<motion.div
					className="absolute inset-0 opacity-[0.03]"
					style={{ y: backgroundLayer3 }}
				>
					<div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
				</motion.div>

				{/* Vignette */}
				<div 
					className="absolute inset-0"
					style={{
						background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent, rgba(2,6,23,0.9))",
					}}
				/>
			</div>

			{/* Floating Particle Elements */}
			<AnimatePresence>
				{loaded && (
					<>
						{Array.from({ length: 12 }).map((_, i) => {
							const delay = i * 0.3;
							const duration = 8 + (i % 3) * 2;
							const size = 2 + (i % 3);
							const startX = (i % 4) * 25;
							const startY = (Math.floor(i / 4) % 3) * 33;

							return (
								<motion.div
									key={i}
									className="absolute rounded-full bg-sky-400/20 blur-sm"
									style={{
										width: `${size}px`,
										height: `${size}px`,
										left: `${startX}%`,
										top: `${startY}%`,
									}}
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: [0, 0.6, 0],
										scale: [0, 1.5, 0],
										x: [
											`${Math.random() * 100 - 50}px`,
											`${Math.random() * 100 - 50}px`,
											`${Math.random() * 100 - 50}px`,
										],
										y: [
											`${Math.random() * 100 - 50}px`,
											`${Math.random() * 100 - 50}px`,
											`${Math.random() * 100 - 50}px`,
										],
									}}
									transition={{
										duration,
										repeat: Infinity,
										ease: "easeInOut",
										delay,
									}}
								/>
							);
						})}
					</>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<motion.div
				ref={containerRef}
				className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8"
				style={{
					y: contentY,
					opacity: contentOpacity,
					scale: contentScale,
				}}
			>
				<AnimatePresence mode="wait">
					{loaded && (
						<motion.div
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.08,
										delayChildren: 0.2,
									},
								},
							}}
							className="w-full"
						>
							{/* Tag */}
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 30, scale: 0.8 },
									visible: {
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 200,
											damping: 20,
										},
									},
								}}
								className="mb-6 md:mb-8"
							>
								<motion.span
									className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs uppercase tracking-[0.4em] text-white/70 backdrop-blur-md"
									whileHover={{
										scale: 1.05,
										borderColor: "rgba(255,255,255,0.2)",
										transition: { duration: 0.2 },
									}}
								>
									<motion.span
										className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400"
										animate={{
											opacity: [0.5, 1, 0.5],
											scale: [1, 1.2, 1],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									/>
									Arvado
								</motion.span>
							</motion.div>

							{/* Headline with character-by-character reveal */}
							<div className="w-full max-w-5xl mx-auto mb-6 md:mb-8">
								<motion.h1
									className="text-[clamp(1.875rem,5.5vw,4.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white break-normal hyphens-none"
									variants={{
										hidden: { opacity: 0 },
										visible: { opacity: 1 },
									}}
								>
									{headline.split(" ").map((word, wordIndex, words) => {
										const wordSpan = (
											<span key={wordIndex} className="inline-block whitespace-nowrap">
												{word.split("").map((char, charIndex) => {
													// Clean any hidden characters (soft hyphens, zero-width spaces, etc.)
													const cleanChar = char.replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '');
													return (
														<motion.span
															key={`${wordIndex}-${charIndex}`}
															className="inline-block"
															variants={{
																hidden: {
																	opacity: 0,
																	y: 50,
																	rotateX: -90,
																	filter: "blur(10px)",
																},
																visible: {
																	opacity: 1,
																	y: 0,
																	rotateX: 0,
																	filter: "blur(0px)",
																	transition: {
																		type: "spring",
																		stiffness: 150,
																		damping: 12,
																		delay: (wordIndex * 10 + charIndex) * 0.03,
																	},
																},
															}}
															style={{
																display: "inline-block",
																transformStyle: "preserve-3d",
															}}
														>
															{cleanChar}
														</motion.span>
													);
												})}
											</span>
										);
										
										// Add space between words
										if (wordIndex < words.length - 1) {
											return (
												<>
													{wordSpan}
													<span key={`space-${wordIndex}`} className="inline-block whitespace-pre"> </span>
												</>
											);
										}
										return wordSpan;
									})}
								</motion.h1>
							</div>

							{/* Subheadline with slide-up reveal */}
							<motion.p
								variants={{
									hidden: {
										opacity: 0,
										y: 40,
										filter: "blur(8px)",
									},
									visible: {
										opacity: 1,
										y: 0,
										filter: "blur(0px)",
										transition: {
											duration: 0.8,
											delay: headline.split("").length * 0.03 + 0.3,
											ease: [0.22, 1, 0.36, 1],
										},
									},
								}}
								className="mx-auto mb-10 md:mb-12 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed"
							>
								{subheadline}
							</motion.p>

							{/* CTA Buttons */}
							<motion.div
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
										transition: {
											staggerChildren: 0.1,
											delayChildren: headline.split("").length * 0.03 + 0.6,
										},
									},
								}}
								className="flex flex-col items-center justify-center gap-4 sm:flex-row"
							>
								<motion.a
									href="#contact"
									variants={{
										hidden: {
											opacity: 0,
											y: 30,
											scale: 0.8,
										},
										visible: {
											opacity: 1,
											y: 0,
											scale: 1,
											transition: {
												type: "spring",
												stiffness: 200,
												damping: 15,
											},
										},
									}}
									whileHover={{
										scale: 1.05,
										y: -3,
										transition: { duration: 0.2 },
									}}
									whileTap={{ scale: 0.98 }}
									className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-10 py-4 text-base font-semibold text-white shadow-2xl shadow-sky-500/30 ring-1 ring-white/20"
								>
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
										initial={false}
									/>
									<span className="relative z-10">Book a call</span>
									<motion.div
										className="absolute inset-0 bg-white/20"
										initial={{ x: "-100%" }}
										whileHover={{ x: "100%" }}
										transition={{ duration: 0.6 }}
									/>
								</motion.a>

								<motion.a
									href="#launch"
									variants={{
										hidden: {
											opacity: 0,
											y: 30,
											scale: 0.8,
										},
										visible: {
											opacity: 1,
											y: 0,
											scale: 1,
											transition: {
												type: "spring",
												stiffness: 200,
												damping: 15,
												delay: 0.1,
											},
										},
									}}
									whileHover={{
										scale: 1.05,
										y: -3,
										borderColor: "rgba(255,255,255,0.3)",
										backgroundColor: "rgba(255,255,255,0.1)",
										transition: { duration: 0.2 },
									}}
									whileTap={{ scale: 0.98 }}
									className="rounded-2xl border border-white/15 bg-white/[0.03] px-10 py-4 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
								>
									See how we launch
								</motion.a>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</section>
	);
}
