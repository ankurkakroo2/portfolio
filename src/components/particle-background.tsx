"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

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
    const isScrollingRef = useRef(false);
    const exclusionRectsRef = useRef<DOMRect[]>([]);
    const exclusionElementsRef = useRef<Element[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Cache exclusion zone elements (query DOM once)
        const cacheExclusionElements = () => {
            const elements = document.getElementsByClassName('particle-exclusion');
            exclusionElementsRef.current = Array.from(elements);
        };

        // Update exclusion zone positions (no DOM query, just getBoundingClientRect)
        const updateExclusionRects = () => {
            const padding = 30;
            exclusionRectsRef.current = exclusionElementsRef.current
                .map(element => {
                    const rect = element.getBoundingClientRect();
                    return new DOMRect(
                        rect.left - padding,
                        rect.top - padding,
                        rect.width + (padding * 2),
                        rect.height + (padding * 2)
                    );
                });
        };

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateExclusionRects();
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
            // Only set scrolling flag if not already scrolling (reduces redundant state changes)
            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
            }

            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Show particles again after scroll stops
            scrollTimeoutRef.current = setTimeout(() => {
                updateExclusionRects(); // Update positions of exclusion zones
                isScrollingRef.current = false;
            }, 150);
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Skip rendering if scrolling
            if (isScrollingRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const mouse = mouseRef.current;
            const isDark = theme === "dark";
            const rects = exclusionRectsRef.current;

            particlesRef.current.forEach((particle) => {
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 180; // Interaction radius

                // Shimmer effect
                particle.shimmer += 0.02;
                const shimmerOpacity = (Math.sin(particle.shimmer) + 1) / 2;

                if (distance < maxDistance) {
                    // Soft boundary: Opacity fades out as distance increases
                    particle.targetOpacity = (1 - distance / maxDistance) * 0.8;

                    // Gentler push
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.15; // Gentle force
                    particle.vy -= Math.sin(angle) * force * 0.15;
                } else {
                    particle.targetOpacity = 0;
                }

                // 2. Exclusion Zone Interaction (Smooth Boundary)
                rects.forEach(rect => {
                    // Calculate distance to nearest point on rectangle
                    const nearestX = Math.max(rect.left, Math.min(particle.x, rect.right));
                    const nearestY = Math.max(rect.top, Math.min(particle.y, rect.bottom));
                    const distDx = particle.x - nearestX;
                    const distDy = particle.y - nearestY;
                    const dist = Math.sqrt(distDx * distDx + distDy * distDy);

                    const isInside = particle.x >= rect.left && particle.x <= rect.right &&
                        particle.y >= rect.top && particle.y <= rect.bottom;

                    if (isInside || dist < 40) {
                        // Smooth repulsion force (gets stronger as you get closer)
                        const repulsionStrength = isInside ? 1.0 : Math.max(0, 1 - dist / 40);

                        if (dist > 0.1) { // Avoid division by zero
                            const repulsionForce = repulsionStrength * 0.3; // Gentle force
                            particle.vx += (distDx / dist) * repulsionForce;
                            particle.vy += (distDy / dist) * repulsionForce;
                        } else if (isInside) {
                            // If exactly on the edge, push away from center
                            const centerX = (rect.left + rect.right) / 2;
                            const centerY = (rect.top + rect.bottom) / 2;
                            const toCenterDx = particle.x - centerX;
                            const toCenterDy = particle.y - centerY;
                            const toCenterDist = Math.sqrt(toCenterDx * toCenterDx + toCenterDy * toCenterDy);
                            if (toCenterDist > 0.1) {
                                particle.vx += (toCenterDx / toCenterDist) * 0.3;
                                particle.vy += (toCenterDy / toCenterDist) * 0.3;
                            }
                        }
                    }
                });

                // Physics
                particle.vx *= 0.92; // Friction
                particle.vy *= 0.92;
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Return to base - gentle spring
                const baseDx = particle.baseX - particle.x;
                const baseDy = particle.baseY - particle.y;
                particle.x += baseDx * 0.05;
                particle.y += baseDy * 0.05;

                // Opacity transition (fast response to mouse)
                particle.opacity += (particle.targetOpacity - particle.opacity) * 0.2;

                // Draw particle
                if (particle.opacity > 0.01) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

                    if (isDark) {
                        // Dark mode: Blue-white glow (optimized shadows)
                        const alpha = particle.opacity * (0.3 + shimmerOpacity * 0.2); // 0.3-0.5 opacity
                        ctx.fillStyle = `hsla(200, 100%, 80%, ${alpha})`;
                        ctx.shadowBlur = 8 * particle.opacity; // Reduced from 15 to 8
                        ctx.shadowColor = `hsla(200, 100%, 60%, ${particle.opacity * 0.5})`; // Lighter shadow
                    } else {
                        // Light mode: Subtle gray-blue
                        const alpha = particle.opacity * (0.4 + shimmerOpacity * 0.2); // 0.4-0.6 opacity
                        ctx.fillStyle = `hsla(210, 20%, 30%, ${alpha})`;
                        ctx.shadowBlur = 0;
                    }
                    ctx.fill();

                    // Reset shadow for next particle (performance optimization)
                    if (isDark) {
                        ctx.shadowBlur = 0;
                    }

                    // Draw connections
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

        cacheExclusionElements();
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
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
