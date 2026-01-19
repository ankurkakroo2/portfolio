"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
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
    const fadeInProgressRef = useRef(1); // 0 = fully hidden, 1 = fully visible
    const exclusionRectsRef = useRef<DOMRect[]>([]);
    const exclusionElementsRef = useRef<Element[]>([]);
    const animationPauseUntilRef = useRef(0);
    const pauseClearedRef = useRef(false);
    const delayedPathsRef = useRef(new Set<string>());
    const { theme } = useTheme();
    const themeRef = useRef(theme);
    const themeMixRef = useRef(theme === "dark" ? 1 : 0); // 0 = light, 1 = dark
    const pathname = usePathname();

    // Update theme ref when theme changes, without triggering the main effect
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        if (delayedPathsRef.current.has(pathname)) {
            return;
        }

        delayedPathsRef.current.add(pathname);
        const delayMs = pathname === "/" ? 2200 : pathname === "/logs" ? 1800 : 0;
        if (delayMs > 0) {
            animationPauseUntilRef.current = Math.max(
                animationPauseUntilRef.current,
                performance.now() + delayMs
            );
        }
    }, [pathname]);

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
            // Only initialize if empty to avoid resetting on resize if desired,
            // but here we keep original behavior or maybe check particlesRef.current.length
            // The original code re-initialized on resize. Let's keep that but maybe we don't need to empty it if we want to preserve positions?
            // For now, let's keep it simple and just re-init on resize as before, but NOT on theme change.
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
                fadeInProgressRef.current = 0; // Start fade-out
            }

            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Show particles again after scroll stops
            scrollTimeoutRef.current = setTimeout(() => {
                updateExclusionRects(); // Update positions of exclusion zones
                isScrollingRef.current = false;
                // fadeInProgress will gradually increase in animate loop
            }, 150);
        };

        // Linear interpolation helper
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        // Animation loop
        const animate = () => {
            if (performance.now() < animationPauseUntilRef.current) {
                if (!pauseClearedRef.current) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    pauseClearedRef.current = true;
                }
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            pauseClearedRef.current = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Skip rendering if scrolling
            if (isScrollingRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            // Smooth fade-in after scroll stops
            if (fadeInProgressRef.current < 1) {
                fadeInProgressRef.current = Math.min(1, fadeInProgressRef.current + 0.05); // Gradual fade-in
            }

            // Smooth theme transition
            const targetThemeVal = themeRef.current === "dark" ? 1 : 0;
            // interpolate themeMixRef.current towards targetThemeVal
            // Slower transition for theme: 0.02 per frame approx matches longer duration
            const themeDiff = targetThemeVal - themeMixRef.current;
            if (Math.abs(themeDiff) > 0.001) {
                themeMixRef.current += themeDiff * 0.05;
            } else {
                themeMixRef.current = targetThemeVal;
            }

            const themeMix = themeMixRef.current; // 0 = light, 1 = dark

            const mouse = mouseRef.current;
            const rects = exclusionRectsRef.current;
            const particles = particlesRef.current;
            const particleCount = particles.length;
            const maxDistance = 180; // Interaction radius
            const maxDistanceSq = maxDistance * maxDistance;
            const exclusionDistance = 40;
            const exclusionDistanceSq = exclusionDistance * exclusionDistance;
            const connectionDistance = 50;
            const connectionDistanceSq = connectionDistance * connectionDistance;
            const fadeInProgress = fadeInProgressRef.current;

            for (let i = 0; i < particleCount; i++) {
                const particle = particles[i];
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distanceSq = dx * dx + dy * dy;

                // Shimmer effect
                particle.shimmer += 0.02;
                const shimmerOpacity = (Math.sin(particle.shimmer) + 1) / 2;

                if (distanceSq < maxDistanceSq) {
                    const distance = Math.sqrt(distanceSq);
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
                for (let r = 0; r < rects.length; r++) {
                    const rect = rects[r];
                    // Calculate distance to nearest point on rectangle
                    const nearestX = Math.max(rect.left, Math.min(particle.x, rect.right));
                    const nearestY = Math.max(rect.top, Math.min(particle.y, rect.bottom));
                    const distDx = particle.x - nearestX;
                    const distDy = particle.y - nearestY;
                    const distSq = distDx * distDx + distDy * distDy;

                    const isInside = particle.x >= rect.left && particle.x <= rect.right &&
                        particle.y >= rect.top && particle.y <= rect.bottom;

                    if (isInside || distSq < exclusionDistanceSq) {
                        const dist = Math.sqrt(distSq);
                        // Smooth repulsion force (gets stronger as you get closer)
                        const repulsionStrength = isInside ? 1.0 : Math.max(0, 1 - dist / exclusionDistance);

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
                }

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

                    // Interpolate Colors
                    // Light: hsla(210, 20%, 30%, alpha) -> H:210, S:20, L:30
                    // Dark:  hsla(200, 100%, 80%, alpha) -> H:200, S:100, L:80

                    const h = lerp(210, 200, themeMix);
                    const s = lerp(20, 100, themeMix);
                    const l = lerp(30, 80, themeMix);

                    // Light alpha base: 0.4, Dark alpha base: 0.3
                    const alphaBase = lerp(0.4, 0.3, themeMix);

                    const alpha = particle.opacity * fadeInProgress * (alphaBase + shimmerOpacity * 0.2);

                    ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${alpha})`;

                    // Shadow only for dark mode mostly
                    // Light shadow blur: 0
                    // Dark shadow blur: 8 * ...
                    const shadowBlur = lerp(0, 8, themeMix) * particle.opacity * fadeInProgress;
                    if (shadowBlur > 0.5) {
                        ctx.shadowBlur = shadowBlur;
                        // Shadow color: Light: none/irrelevant, Dark: 200, 100, 60
                        ctx.shadowColor = `hsla(200, 100%, 60%, ${particle.opacity * fadeInProgress * 0.5})`;
                    } else {
                        ctx.shadowBlur = 0;
                    }

                    ctx.fill();

                    // Reset shadow
                    ctx.shadowBlur = 0;

                    // Draw connections
                    if (particle.opacity > 0.2) {
                        for (let j = 0; j < particleCount; j++) {
                            if (j === i) continue;
                            const otherParticle = particles[j];
                            if (otherParticle.opacity <= 0.2) continue;

                            const pdx = particle.x - otherParticle.x;
                            const pdy = particle.y - otherParticle.y;
                            const pdistSq = pdx * pdx + pdy * pdy;

                            if (pdistSq < connectionDistanceSq) { // Longer connections
                                const pdist = Math.sqrt(pdistSq);
                                ctx.beginPath();
                                ctx.moveTo(particle.x, particle.y);
                                ctx.lineTo(otherParticle.x, otherParticle.y);

                                const lineOpacity = (1 - pdist / connectionDistance) * Math.min(particle.opacity, otherParticle.opacity) * 0.2;

                                // Line Color Interpolation
                                // Light: hsla(210, 30%, 40%, ...)
                                // Dark:  hsla(200, 40%, 70%, ...)
                                const lh = lerp(210, 200, themeMix);
                                const ls = lerp(30, 40, themeMix);
                                const ll = lerp(40, 70, themeMix);

                                // Alpha multiplier: Light: 0.6, Dark: 1.0 (implicit in previous code which didn't have multiplier for dark)
                                const laMult = lerp(0.6, 1.0, themeMix);

                                ctx.strokeStyle = `hsla(${lh}, ${ls}%, ${ll}%, ${lineOpacity * laMult})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

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
    }, []); // Empty dependency array!

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
