"use client";

import { useEffect, useRef } from 'react';
import { THEME_COLORS } from '../lib/constants/theme';

export default function NeonBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match window size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Line properties with curved paths and pulse
        const lines: Array<{
            x: number;
            y: number;
            angle: number;
            speed: number;
            color: string;
            baseColor: string;
            curve: number;
            curveSpeed: number;
            curveAmplitude: number;
            size: number;
            pulse: number;
            pulseSpeed: number;
            shouldPulse: boolean;
            pulsePhase: number;
        }> = [];

        // Available colors for the lines
        const colors = [
            THEME_COLORS.primary.electricBlue.rgb,
            THEME_COLORS.primary.roseMagenta.rgb,
            THEME_COLORS.primary.hotPink.rgb,
            THEME_COLORS.primary.iceBlue.rgb,
        ];

        // Create initial lines
        for (let i = 0; i < 50; i++) {
            const opacity = THEME_COLORS.opacity.neonLine.min +
                Math.random() * (THEME_COLORS.opacity.neonLine.max - THEME_COLORS.opacity.neonLine.min);

            const selectedColor = colors[Math.floor(Math.random() * colors.length)];
            const baseColor = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${opacity * 1.5})`;

            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                angle: Math.random() * Math.PI * 2,
                speed: (0.5 + Math.random() * 1) / 3,
                color: baseColor,
                baseColor: baseColor,
                curve: 0,
                curveSpeed: 0.001 + Math.random() * 0.002,
                curveAmplitude: 0.05 + Math.random() * 0.1,
                size: 0.5 + Math.random() * 2,
                pulse: 0,
                pulseSpeed: 0.005 + Math.random() * 0.01,
                shouldPulse: false,
                pulsePhase: Math.random() * Math.PI * 2,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            lines.forEach(line => {
                // Randomly start pulsing
                if (!line.shouldPulse && Math.random() < 0.001) { // 0.1% chance per frame to start pulsing
                    line.shouldPulse = true;
                    line.pulse = 0; // Reset pulse phase when starting
                }
                // Stop pulsing after one complete cycle
                if (line.shouldPulse && line.pulse > Math.PI * 2) {
                    line.shouldPulse = false;
                    line.pulse = 0;
                }

                ctx.beginPath();
                ctx.moveTo(line.x, line.y);

                // Update curve
                line.curve += line.curveSpeed;

                // Update pulse
                line.pulse += line.shouldPulse ? line.pulseSpeed : 0;
                const pulseEffect = line.shouldPulse
                    ? Math.sin(line.pulse + line.pulsePhase) * 0.3 + 0.7  // Oscillates between 0.4 and 1.0
                    : 1; // No pulse effect for non-pulsing particles

                // Calculate curved movement
                const curveOffset = Math.sin(line.curve) * line.curveAmplitude;
                const adjustedAngle = line.angle + curveOffset;

                // Update position with curved trajectory
                line.x += Math.cos(adjustedAngle) * line.speed;
                line.y += Math.sin(adjustedAngle) * line.speed;

                // Draw line with pulsing effect
                ctx.lineTo(line.x, line.y);

                // Parse base color to apply pulse effect
                const baseColorMatch = line.baseColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                if (baseColorMatch) {
                    const [_, r, g, b, a] = baseColorMatch;
                    line.color = `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * pulseEffect})`;
                }

                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.size * pulseEffect;
                ctx.stroke();

                // Bounce off edges with slight angle adjustment
                if (line.x < 0 || line.x > canvas.width) {
                    line.angle = Math.PI - line.angle;
                    line.curve = Math.random() * Math.PI * 2;
                    line.curveAmplitude = 0.1 + Math.random() * 0.2;
                }
                if (line.y < 0 || line.y > canvas.height) {
                    line.angle = -line.angle;
                    line.curve = Math.random() * Math.PI * 2;
                    line.curveAmplitude = 0.1 + Math.random() * 0.2;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
} 