"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    targetOpacity: number;
    shimmer: number;
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationFrameRef = useRef<number | undefined>(undefined);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [isScrolling, setIsScrolling] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Initialize particles in a denser grid
        const initParticles = () => {
            particlesRef.current = [];
            const spacing = 20; // Increased density
            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing + Math.random() * 5;
                    const y = j * spacing + Math.random() * 5;
                    particlesRef.current.push({
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        vx: 0,
                        vy: 0,
                        size: Math.random() * 1.5 + 1, // Thicker particles
                        opacity: 0,
                        targetOpacity: 0,
                        shimmer: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        // Scroll handler - hide particles during scroll
        const handleScroll = () => {
            setIsScrolling(true);

            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Show particles again after scroll stops
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Skip rendering if scrolling
            if (isScrolling) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const mouse = mouseRef.current;
            const isDark = theme === "dark";

            particlesRef.current.forEach((particle) => {
                // Calculate distance from mouse
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 180; // Larger interaction radius

                // Reveal particles near mouse
                if (distance < maxDistance) {
                    particle.targetOpacity = (1 - distance / maxDistance) * 0.8; // Higher opacity

                    // Very subtle push - reduced force
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.15; // Reduced from 0.5
                    particle.vy -= Math.sin(angle) * force * 0.15;
                } else {
                    particle.targetOpacity = 0;
                }

                // Smooth opacity transition - slower
                particle.opacity += (particle.targetOpacity - particle.opacity) * 0.05; // Reduced from 0.1

                // Apply velocity
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Return to base position - gentler
                particle.vx += (particle.baseX - particle.x) * 0.02; // Reduced from 0.05
                particle.vy += (particle.baseY - particle.y) * 0.02;

                // Stronger damping for slower movement
                particle.vx *= 0.85; // Reduced from 0.9
                particle.vy *= 0.85;

                // Update shimmer
                particle.shimmer += 0.02;

                // Draw particle
                if (particle.opacity > 0.01) {
                    // Shimmer effect
                    const shimmerIntensity = Math.sin(particle.shimmer) * 0.3 + 0.7;

                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

                    // Color based on theme
                    if (isDark) {
                        // Dark mode: subtle blue-white
                        const distanceRatio = Math.min(distance / maxDistance, 1);
                        const hue = 200;
                        const saturation = 40 - distanceRatio * 20;
                        const lightness = 70 + (1 - distanceRatio) * 20;
                        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity * shimmerIntensity})`;
                    } else {
                        // Light mode: darker, more visible particles
                        const distanceRatio = Math.min(distance / maxDistance, 1);
                        const hue = 210;
                        const saturation = 25 - distanceRatio * 10;
                        const lightness = 30 + distanceRatio * 15; // Darker for visibility
                        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity * shimmerIntensity * 0.7})`; // Higher opacity
                    }

                    ctx.fill();

                    // Add subtle glow
                    if (particle.opacity > 0.3) {
                        ctx.shadowBlur = 3;
                        ctx.shadowColor = isDark ? 'rgba(200, 220, 255, 0.3)' : 'rgba(80, 100, 120, 0.4)'; // Stronger glow in light mode
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }

                    // Draw very subtle connections to nearby particles
                    particlesRef.current.forEach((otherParticle) => {
                        if (particle === otherParticle) return;

                        const pdx = particle.x - otherParticle.x;
                        const pdy = particle.y - otherParticle.y;
                        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

                        if (pdist < 50 && particle.opacity > 0.2 && otherParticle.opacity > 0.2) { // Longer connections
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            const lineOpacity = (1 - pdist / 50) * Math.min(particle.opacity, otherParticle.opacity) * 0.2; // More visible lines

                            if (isDark) {
                                ctx.strokeStyle = `hsla(200, 40%, 70%, ${lineOpacity})`;
                            } else {
                                ctx.strokeStyle = `hsla(210, 30%, 40%, ${lineOpacity * 0.6})`; // Darker, more visible lines
                            }

                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [theme, isScrolling]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
