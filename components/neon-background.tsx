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

        // Line properties with curved paths
        const lines: Array<{
            x: number;
            y: number;
            angle: number;
            speed: number;
            color: string;
            curve: number;
            curveSpeed: number;
            curveAmplitude: number;
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
            const color = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${opacity})`;

            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                angle: Math.random() * Math.PI * 2,
                speed: (0.5 + Math.random() * 1) / 3, // Reduced to 1/3 of original speed
                color: color,
                curve: 0,
                curveSpeed: 0.005 + Math.random() * 0.01,
                curveAmplitude: 0.1 + Math.random() * 0.2,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Increased opacity for faster fade
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);

                // Update curve
                line.curve += line.curveSpeed;

                // Calculate curved movement with reduced effect
                const curveOffset = Math.sin(line.curve) * line.curveAmplitude;
                const adjustedAngle = line.angle + curveOffset;

                // Update position with curved trajectory
                line.x += Math.cos(adjustedAngle) * line.speed;
                line.y += Math.sin(adjustedAngle) * line.speed;

                // Draw line
                ctx.lineTo(line.x, line.y);
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 1.5;
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